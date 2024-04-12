Установить Software
NodeJs
npm
docker
minikube
kubectl
ingress-nginx
skaffold
postman
fish - optionality

Образы докера должны быть на hub.docker.com

Для микросервисов там где есть файлик package.json ставим зависимости
npm install

Заходим в корень где есть файл skaffold.yaml и запускаем приложение
minikube start
skaffold dev

Возможно команду skaffold dev нужно будет ввести второй раз

После старта приложения в консоли должна быть строка - Listening on port 3000!

Дальше можно тестировать авторизацию в Postman
ticketing.k8s/api/users/signup
В body raw вставляем данные пользователя и отправляем их
{
    "email": "dsggf@6u7h.ert",
    "password": "234FfE4g5G"
}

