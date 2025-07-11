import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>LUXE - Premium E-commerce Platform</title>
        <meta name="description" content="Discover luxury products from the world's finest brands" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}