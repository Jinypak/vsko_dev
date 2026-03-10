const encoder = new TextEncoder();
const decoder = new TextDecoder();

const DEFAULT_DEV_JWT_SECRET = 'local-dev-auth-jwt-secret';
const NODE_ENV_TO_SECRET_KEY: Record<string, string> = {
  production: 'AUTH_JWT_SECRET_PRODUCTION',
  development: 'AUTH_JWT_SECRET_DEVELOPMENT',
  test: 'AUTH_JWT_SECRET_TEST',
};

type JwtPayload = {
  sub: string;
  channel: 'email' | 'kakao';
  iat: number;
  exp: number;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  return Buffer.from(binary, 'binary').toString('base64');
}

function base64ToBytes(base64: string) {
  const binary = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlEncode(input: Uint8Array | string) {
  const bytes = typeof input === 'string' ? encoder.encode(input) : input;
  const base64 = bytesToBase64(bytes);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return base64ToBytes(padded);
}

async function signHmacSha256(content: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(content));
  return new Uint8Array(signature);
}

async function verifyHmacSha256(content: string, signature: Uint8Array, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(content));
}

function getTrimmedEnv(name: string) {
  return process.env[name]?.trim() ?? '';
}

export function getAuthJwtSecret() {
  const env = process.env.NODE_ENV ?? 'development';
  const commonSecret = getTrimmedEnv('AUTH_JWT_SECRET');
  if (commonSecret) return commonSecret;

  const envSpecificKey = NODE_ENV_TO_SECRET_KEY[env];
  if (envSpecificKey) {
    const envSpecificSecret = getTrimmedEnv(envSpecificKey);
    if (envSpecificSecret) return envSpecificSecret;
  }

  if (env === 'development') {
    return DEFAULT_DEV_JWT_SECRET;
  }

  return '';
}

export async function createAdminSessionJwt(payload: {
  principal: string;
  channel: 'email' | 'kakao';
  ttlSeconds: number;
  secret: string;
}) {
  const now = Math.floor(Date.now() / 1000);

  const tokenPayload: JwtPayload = {
    sub: payload.principal,
    channel: payload.channel,
    iat: now,
    exp: now + payload.ttlSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await signHmacSha256(signingInput, payload.secret);
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export async function verifyAdminSessionJwt(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = base64UrlDecode(encodedSignature);
  const isValidSignature = await verifyHmacSha256(signingInput, signature, secret);
  if (!isValidSignature) return null;

  const payloadRaw = decoder.decode(base64UrlDecode(encodedPayload));
  const payload = JSON.parse(payloadRaw) as Partial<JwtPayload>;

  if (!payload.sub || !payload.channel || typeof payload.exp !== 'number' || typeof payload.iat !== 'number') {
    return null;
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    principal: payload.sub,
    channel: payload.channel,
    exp: payload.exp,
    iat: payload.iat,
  };
}
