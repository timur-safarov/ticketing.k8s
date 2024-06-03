const LandingPage = ({ color }) => {

	// console.log('I am in the component', color);

	return <h1>Landing page</h1>;

};

// Когда мы рендерим компоненты в пределах сайта в SSR фазе
// У нас нету возможности сделать Request между компонентами
// Потому что все компоненты рендеряться в один момент
// Для исполнения кода на СЕРВЕРЕ мы суём его в getInitialProps
LandingPage.getInitialProps = () => {

	// Эта надпись будет видна только в терминале, но не в консоли браузера
	// console.log('I am on the server!');

	// Тут мы можем передать переменные в наш LandingPage
	return { color: 'red' };
};

export default LandingPage;