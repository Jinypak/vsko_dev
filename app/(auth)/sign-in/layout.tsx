import '../../globals.css';

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
};

export default SignInLayout;
