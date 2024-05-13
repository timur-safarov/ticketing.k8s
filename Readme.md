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

Посмотреть ip кластера
minikube ip

И указать его для нашего домена в файле /etc/hosts
192.168.49.2    ticketing.k8s

Перейти в папку где лежит файл skaffold.yaml и запустить команду
это нужно делать в том же окне терминала где был запущен minikube
skaffold dev

Возможно команду skaffold dev нужно будет ввести второй раз

После старта приложения в консоли должна быть строка - Listening on port 3000!

Дальше можно тестировать авторизацию в Postman

Отлючить в Postman ssl
File->settings->ssl certificate verefication - OFF

Url для тестирования
ticketing.k8s/api/users/signup

Если я буду использовать https то будут сохраняться куки
https://ticketing.k8s/api/users/signup

Указываем метод POST
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json

В body тип данных должен быть json

В body->raw вставляем данные пользователя и отправляем их
{
    "email": "dsggf@6u7h.ert",
    "password": "234FfE4g5G"
}

Вернуться должны примерно вот такие данные
{
    "email": "dsggf@6u7h.ert",
    "password": "7b74fb7f740629b427e57604b434b7d1a1816a6afa4663e4a56442f4b984b24c4400f3d06b246cbc23d0347a1e9b8c1111bcaab1463bec1727d9cb02b459119a.2e05439621d9d497",
    "_id": "6626d0b57ba40555abba8a27",
    "__v": 0
}



Если будут сделаны изменения в коде, возможно понадобиться повторный запуск
skaffold dev или skaffold run


/**===============================================================================================================**/

Чтобы использовать signin с начала нужно авторизоваться также через api под тем жепользователем тут
https://ticketing.k8s/api/users/signup

Используем signin через API
https://ticketing.k8s/api/users/signin

Указываем метод POST
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json

В body->raw вставляем данные пользователя и отправляем их
{
    "email": "dsggf@6u7h.ert",
    "password": "234FfE4g5G"
}

/**===============================================================================================================**/

Получаем данные текущего пользователя через API
С начала нужно успешно пройти signup, signin - иначе пользователь не будет найден

https://ticketing.k8s/api/users/currentuser
Указываем метод GET
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json


/**===============================================================================================================**/

Выходим из подавторизации и удаляем сессии и куки через API
С начала нужно успешно пройти signup, signin - иначе пользователь не будет найден

https://ticketing.k8s/api/users/signout
Указываем метод POST
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json

Должен вернуться пустой объект {} и пользователь не должен быть найден https://ticketing.k8s/api/users/currentuser

/**===============================================================================================================**/

Чтобы создать токен использую эти ресурсы
https://www.base64decode.org/
https://jwt.io/
Об это рассказано в уроке Глава 9. Authentication Strategies and Options -> 11. JWT Signing Keys


Token для K8S
Создаём секретный доступ через jsonwebtoken
kubectl create secret generic jwt-secret --from-literal=jwt=asdf
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

Об это рассказано в уроке Глава 9. Authentication Strategies and Options -> 13. Creating and Accessing Secrets

/**===============================================================================================================**/

skaffold dev
команда создаст продолжающийся «цикл обратной связи», т.е. не только соберет все и задеплоит в кластер, 
но и расскажет о состоянии pod’ов в данный момент, будет следить за изменениями и обновлять состояние pod’ов.
Т.е. если вы меняете файлы то происходит обновление

тот же процесс, что и dev, только не следит за изменениями
https://skaffold.dev/docs/references/cli/#skaffold-run
skaffold run

/**===============================================================================================================**/

200 OK - вывод данных работает
201 Created - запись только что создана
304 Not Modified
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
405 NOT_ALLOWED
422 Unprocessable Entity
500 Internal Server Error
502 Bad Gateway Host Not Found or connection failed


/**===============================================================================================================**/

Запуск тестов
cd auth/
npm run test


/**===============================================================================================================**/