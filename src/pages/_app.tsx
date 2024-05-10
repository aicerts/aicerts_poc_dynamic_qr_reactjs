import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  
  return (
    <>
     <Head>
        <title>Aicerts</title>
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
      </Head>
      <Component {...pageProps} router={router} />
    </>
  );
};

export default App;
