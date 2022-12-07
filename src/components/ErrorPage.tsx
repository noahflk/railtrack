export const ErrorPage: React.FC = () => (
  <div className="flex h-screen flex-col items-center justify-center space-y-4">
    <h1 className="text-4xl font-bold">Sorry.. there was an error</h1>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/dashboard" className="font-medium text-primary hover:text-primary-light">
      Go back to the Dashboard
    </a>
  </div>
);
