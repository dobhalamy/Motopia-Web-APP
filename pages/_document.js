/* eslint-disable max-len */
import React from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';

import { ServerStyleSheets } from '@material-ui/styles';
import gtmParts from 'react-google-tag-manager';
import { VIDEOS_STRUCTURED_DATA } from '@/constants';

class MyDocument extends Document {
  render() {
    const gtm = gtmParts({
      id: 'GTM-NC7CQ69',
      dataLayerName: this.props.dataLayerName || 'dataLayer',
    });
    return (
      <Html lang="en">
        <Head>
          {gtm.scriptAsReact()}
          <script type="text/ld+json">{VIDEOS_STRUCTURED_DATA}</script>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <meta
            name="facebook-domain-verification"
            content="mhsxzxxk5l43gt2tysf9sk37su0m8o"
          />
        </Head>
        <body>
          {gtm.noScriptAsReact()}
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDx7FGH45DSNlrNmu22o4-HFdJ7StqAl-8&libraries=places&language=en" />
          <Main />
          <NextScript />
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src="//js.hs-scripts.com/7800832.js"
          />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>,
    ],
  };
};

export default MyDocument;
