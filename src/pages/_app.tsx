import '../styles/global.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/700.css';
import '@fontsource/yeseva-one/400.css';
import '@fontsource/jetbrains-mono/100.css';
import '@fontsource/jetbrains-mono/200.css';
import '@fontsource/jetbrains-mono/300.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';

import type { AppProps } from 'next/app';
import { ParallaxProvider } from 'react-scroll-parallax';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ParallaxProvider>
    <Component {...pageProps} />
  </ParallaxProvider>
);

export default MyApp;
