import 'bootstrap/dist/css/bootstrap.css';

// Global css должны быть в нашем файле app
export default ({ Component, pageProps }) => {
	return <Component {...pageProps} />
};