import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// Global css должны быть в нашем файле app
const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
			<Header currentUser={currentUser} />
			<Component {...pageProps} />
		</div>
	);
};

AppComponent.getInitialProps = async appContext => {

	// console.log(Object.keys(appContext));
	const client = buildClient(appContext.ctx);
	const { data } = await client.get('/api/users/currentuser');

	let pageProps = {};

	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}

	// pageProps - Вернёт текущего пользователя
	// console.log(pageProps);

	// data - Вернёт текущего пользователя
	// console.log(data);

	return {
		pageProps,
		...data
	};

};

export default AppComponent;