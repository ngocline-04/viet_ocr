// eslint-disable-next-line simple-import-sort/imports
import '@/styles/global.scss';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { I18nextProvider } from 'react-i18next';
import { PersistGate } from 'redux-persist/integration/react';

import { DialogView } from '@/components';
import { LoadingProgress } from '@/components/loading';
import { ToastView } from '@/components/toast';
import EmptyLayout from '@/layouts/empty-layout';
import i18n from '@/utils/i18n/i18n';
import type { NextPage } from 'next/types';
import { wrapperStore } from '../stores/store';

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: (props: LayoutProps) => React.ReactElement;
};

export type LayoutProps = {
  children: React.ReactNode;
};

const MyApp = ({ Component, ...rest }: AppPropsWithLayout) => {
  const { store, props } = wrapperStore.useWrappedStore(rest);
  const Layout = Component.Layout ?? EmptyLayout;
  return (
    <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="light">
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  controlHeight: 38.75,
                  algorithm: true,
                },
              },
            }}
          >
            <Layout>
              <ToastView />
              <Component {...props.pageProps} />
              <DialogView />
              <LoadingProgress />
            </Layout>
          </ConfigProvider>
        </ThemeProvider>
      </I18nextProvider>
    </PersistGate>
  );
};

export default wrapperStore.withRedux(MyApp);
