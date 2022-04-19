import * as React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';
import { get } from 'lodash';
import { SWRConfig } from 'swr';
import BasicLayout from '../layout/BasicLayout';
import { wrapper } from '../store';
import { Theme } from '../features';
import { fetcher } from '../utils/utils';

import '../styles/globals.css';


NProgress.configure({
  showSpinner: false,
  minimum: 0.09,
  speed: 180,
  trickleSpeed: 160
});

interface MyAppProps extends AppProps {
  showBack?: boolean;
}


function App(props: MyAppProps) {

  const { Component, pageProps } = props;


  React.useEffect(() => {
    NProgress.done();
  }, [pageProps]);


  React.useEffect(() => {

    Router.beforePopState((e: any) => {

      const shallow = get(e, 'options.shallow');

      if (!shallow)
        NProgress.start();
      return true;
    });


  }, []);


  return (

    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />

      </Head>

      <Theme>
        {/*@ts-ignore*/}
        <SnackbarProvider maxSnack={3}>
          <BasicLayout pageProps={pageProps}>
            <SWRConfig
              value={{
                fetcher: fetcher
              }}
            >
              {/*@ts-ignore*/}
              <Component {...pageProps} />
            </SWRConfig>
          </BasicLayout>
        </SnackbarProvider>
      </Theme>

    </>

  );
}

export default wrapper.withRedux(App);
