import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {

	// console.log(currentUser);
	// axios.get('/api/users/currentuser');

	// console.log(currentUser);

	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are NOT signed in</h1>
	);

};

// Когда мы рендерим компоненты в пределах сайта в SSR фазе
// У нас нету возможности сделать Request между компонентами
// Потому что все компоненты рендеряться в один момент
// Для исполнения кода на СЕРВЕРЕ мы суём его в getInitialProps
LandingPage.getInitialProps = async context => {

	console.log('LANDING PAGE!');

	// ЧТобы повторно не обращаться в наш import файл добавим его в константу
	const client = buildClient(context);

	// Получаем заголовки браузера куки и т.д.
	// console.log(req.headers);

	// Эта надпись будет видна только в терминале, но не в консоли браузера
	// console.log('I am on the server!');

	// Тут мы можем передать переменные в наш LandingPage
	// return { color: 'red' };
	// const LandingPage = ({ color })

	const { data } = await client.get('/api/users/currentuser');

	return data;
};

export default LandingPage;