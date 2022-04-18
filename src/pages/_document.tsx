import * as React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import PreloadAPI from '../components/PreloadAPI';

// import theme from '../styles/theme';


class AppDocument extends Document {

  render() {
    return (
      <Html>

        <Head>

          {/*<meta name="theme-color" content={theme.palette.primary.main} />*/}

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          {/*自定义字体*/}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          {/*<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600&display=swap" rel="stylesheet" />*/}

          <link href="https://fonts.googleapis.com/css2?family=Sofia&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap" rel="stylesheet" />
          {/*<link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap" rel="stylesheet"/>*/}

          <PreloadAPI />
        </Head>

        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;



