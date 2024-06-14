import axios from 'axios';

export default ({ req }) => {


	if (typeof window === 'undefined') {
		// Это означает что мы на сервере

		return axios.create({

			// Request should be made to http://ingress-nginx.ingress-nginx...sagsdgfg

			// 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
			// ЧТобы узнать SERVICENAME нашего ingress-nginx выполним эту команду
			// kubectl get services -n ingress-nginx
			// Примечание: необходимо использовать тип NodePort, т.к. Minikube не поддерживает сервис LoadBalancer
			// Если есть тип LoadBalancer то выбераем этот сервис
			baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers

		});

	} else {
		// Или мы на клиенте в браузере
		return axios.create({
			baseURL: '/'
		});

	}

};