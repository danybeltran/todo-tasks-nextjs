import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return typeof localStorage !== "undefined" && <Component {...pageProps} />;
}

export default MyApp;
