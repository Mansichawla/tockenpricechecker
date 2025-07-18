import Head from 'next/head';

export default function Layout({ children, title = 'Token Price Fetcher' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Fetch historical token prices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    </>
  );
}