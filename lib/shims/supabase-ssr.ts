type CookieAdapter = {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[],
  ) => void;
};

type ClientOptions = {
  cookies: CookieAdapter;
};

type QueryResult = Promise<{ data: unknown[]; error: null }>;

function createMockClient() {
  return {
    from(table: string) {
      void table;
      return {
        async select(): QueryResult {
          return { data: [], error: null };
        },
      };
    },
  };
}

export function createServerClient(url: string, key: string, options: ClientOptions) {
  void url;
  void key;
  void options;
  return createMockClient();
}

export function createBrowserClient(url: string, key: string) {
  void url;
  void key;
  return createMockClient();
}
