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
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyC1iFC4wTfpCDWv6_Ju1IMfFe9p_Z48xQs',
  authDomain: 'viet-ocr-2622f.firebaseapp.com',
  projectId: 'viet-ocr-2622f',
  storageBucket: 'viet-ocr-2622f.firebasestorage.app',
  messagingSenderId: '37228984836',
  appId: '1:37228984836:web:f7266b90c6a56ec4791351',
  measurementId: 'G-9R3891DE0F',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth();
// const analytics = getAnalytics(app);
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
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user?.uid;
        if (uid) {
          router.push('/home');
        }
      } else {
        router.push('/');
      }
    });
  },[])
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
