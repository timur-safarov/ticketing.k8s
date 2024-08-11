import axios from 'axios';

const LandingPage = ({ currentUser }) => {

	// console.log(currentUser);
	// axios.get('/api/users/currentuser');

	console.log(currentUser);

	return <h1>Landing page</h1>;

};

// Когда мы рендерим компоненты в пределах сайта в SSR фазе
// У нас нету возможности сделать Request между компонентами
// Потому что все компоненты рендеряться в один момент
// Для исполнения кода на СЕРВЕРЕ мы суём его в getInitialProps
LandingPage.getInitialProps = async ({ req }) => {

	// Получаем заголовки браузера куки и т.д.
	// console.log(req.headers);

	// Эта надпись будет видна только в терминале, но не в консоли браузера
	// console.log('I am on the server!');

	// Тут мы можем передать переменные в наш LandingPage
	// return { color: 'red' };
	// const LandingPage = ({ color })


	if (typeof window === 'undefined') {
		// Это означает что мы на сервере
		// Request should be made to http://ingress-nginx.ingress-nginx...sagsdgfg

		// 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
		// ЧТобы узнать SERVICENAME нашего ingress-nginx выполним эту команду
		// kubectl get services -n ingress-nginx
		// Примечание: необходимо использовать тип NodePort, т.к. Minikube не поддерживает сервис LoadBalancer
		// Если есть тип LoadBalancer то выбераем этот сервис
		const { data } = await axios.get(
			'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
			{
				// headers: {
				// 	Host: 'ticketing.k8s'
				// }

				headers: req.headers

			}
		);

		return data;

	} else {
		// we are in the browser
		// Request should be made with base url of whitch = ''

		const { data } = await axios.get('/api/users/currentuser');

		return data;
	}

	return {};
};

export default LandingPage;