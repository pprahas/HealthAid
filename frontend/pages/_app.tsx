import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import { Providers } from "../app/providers";
import Layout from "../app/layout";

export default function MyApp({ Component, pageProps }) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }