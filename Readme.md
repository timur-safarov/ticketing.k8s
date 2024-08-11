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

Также должен работать ingress-nginx сервис
Проверить есть ли он можно так
kubectl get services -n ingress-nginx
Примечание: у Minikube будет тип NodePort, т.к. Minikube не поддерживает сервис LoadBalancer


В курсе указан домен ticketing.dev, а мы прописали как ticketing.k8s


Должен быть создан secret с именем jwt-secret
Проверить какие есть уже - если есть наш jwt-secret то создавать не нужно, или удалить и создать
kubectl get secrets
В уроке создаётся такой jwt-secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

Об это рассказано в уроке Глава 9. Authentication Strategies and Options -> 13. Creating and Accessing Secrets


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

Создать тикет

Авторизоваться
https://ticketing.k8s/api/users/signup

Войти под тем же пользователем
https://ticketing.k8s/api/users/signin

Создать тикет
https://ticketing.k8s/api/tickets
Указываем метод POST
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json
Во вкладке body
{
    "title": "concert",
    "price": 234
}
Устанавливаем JSON
Переходим в raw и жмём отправить

Должен вернуться объект
{
    "title": "concert",
    "price": 234,
    "userId": "66aabc63d7ced0b403dfd9b1",
    "__v": 0,
    "id": "66aabcd40c492456a847b364"
}


/**===============================================================================================================**/

Получиь существующий тикет
66aabcd40c492456a847b364 - это ID тикета
https://ticketing.k8s/api/tickets/66aabcd40c492456a847b364

Указываем метод GET
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json

Устанавливаем JSON
Переходим в raw и жмём отправить

Должен вернуться объект
{
    "title": "concert",
    "price": 234,
    "userId": "66aabc63d7ced0b403dfd9b1",
    "__v": 0,
    "id": "66aabcd40c492456a847b364"
}


/**===============================================================================================================**/

Получить все тикеты

https://ticketing.k8s/api/tickets/
Указываем метод GET
Во вкладке Headers->Key пишем Content-Type
Во вкладке Header->value пишем application/json

Устанавливаем JSON
Переходим в raw и жмём отправить

Должен вернуться массив объектов
[
    {
        "title": "concert",
        "price": 234,
        "userId": "66aabc63d7ced0b403dfd9b1",
        "__v": 0,
        "id": "66aabcd40c492456a847b364"
    }
]

/**===============================================================================================================**/

Чтобы создать токен использую эти ресурсы
https://www.base64decode.org/
https://jwt.io/
Об это рассказано в уроке Глава 9. Authentication Strategies and Options -> 11. JWT Signing Keys


Token для K8S
Создаём секретный доступ через jsonwebtoken
kubectl create secret generic jwt-secret --from-literal=jwt=asdf

В уроке создаётся такой jwt-secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

Об это рассказано в уроке Глава 9. Authentication Strategies and Options -> 13. Creating and Accessing Secrets

Просмотреть все secrets
kubectl get secrets

Удалить существующий secret
kubectl delete secret jwt-secret

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
Само приложение должно работать тоже
Сами тесты у нас написаны в папкках __test__

cd auth/
cd tickets/
npm run test

/**===============================================================================================================**/

Чтобы увидеть передаваемые куки в консоли браузера идём сюда
network->Fetch/XHR->Headers

Кликаем на нужную нам ссылку из списка в консоли и выбираем далее
Тут будут куки
Headers->Responce Headers

Также полезные вкладки где видны ошибки и передаваемый данные
network->Fetch/XHR
Кликаем на нужную нам ссылку из списка в консоли и выбираем далее
Headers->Preview
Headers->Responce


Страницы сайта
https://ticketing.k8s/auth/signup


Также куки для домена можно посмотреть в консоли так
Удалить их или изменить также можно
Application->Cookies->domain-name


/**===============================================================================================================**/

Мои Пакеты тут
https://www.npmjs.com/~tisafarov
import { BadRequestError } from "@npm-tisafarov/common/errors/bad-request-error";

Чтобы обновить пакеты переходим сюда
cd common
npm run pub

Потом идём туда где у нас используется эта зависимость и обновляем пакеты
cd tickets
npm update @npm-tisafarov/common

/**===============================================================================================================**/

Куки в браузере храняться в base64 - чтобы увидеть куки в виде json раскодируйте их
https://www.base64decode.org/
Будет примерно такая строка
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODBhYzkzN2FiMjc4YjllOTliZDFmMyIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJpYXQiOjE3MTk3MDg4MTl9.W1fwhoMauXCRjTd31grB-QVSTto8E5O6-7BPLBZl_NY"}

/**===============================================================================================================**/

Url адреса и роуты, котрые будут доступны прописываются тут
infra/k8s/ingress-srv.yaml

/**===============================================================================================================**/

NATS документация
https://docs.nats.io/

Так как nats не использует JS мы встраиваем его с помощью пакета с npmjs.com
https://www.npmjs.com/package/node-nats-streaming

Docker образы, которые мы используем
nats
nats-streaming

Глава 14 - урок 7. Port-Forwarding with Kubectl

Чтобы соединиться с nats в нашем K8S 
1). Нужно убедиться что под есть
kubectl get pods - ищем имя пода для nats
2). Нужно прокинуть порт к клиенту nats
4222 - это порт который мы указываем в настройках сервиса для клиента nats
kubectl port-forward nats-depl-79486c67b9-69b4q 4222:4222

Список портов port-forward если нужно
ps -ef|grep port-forward

Удалить port-forward если нужно
kill -9 1645387

3). cd nats-test/
Потом НЕ ЗАКРЫВАЯ работу порта - открываем НОВУЮ вкладку консоли и вводим
npm run publish
4). Включаем слушатель - открываем новое окно в терминале
cd nats-test/
npm run listen
5). Теперь в окне с publish мы можем рестортовать его введя команду 
rs
ВНИМАНИЕ! - выше команда rs а не ls - не перепутайте!
И потом окно с listen будет получать сообщения
В listen мы тоже можем запускать рестарт - rs

6). Далее можно прокинуть порт к мониторингу nats, 
    который позволит проверять почему некоторые сообщения не приходят или опаздывают
8222 - это порт который мы указываем в настройках сервиса для мониторинга nats
kubectl get pods - ищем имя пода для nats
kubectl port-forward nats-depl-79486c67b9-69b4q 8222:8222
Теперь мы можем через браузер подключиться для просмотра таблиц мониторинга nats
http://localhost:8222/streaming
http://localhost:8222/streaming/channelsz?subs=1

7). Можно открыть несколько слушателей и проверять чтобы только один из низ получал сообщение


/**===============================================================================================================**/

Если при разработки мы создаём новый depl или srv то нужно убедиться что они запущены
kubectl get pods

/**===============================================================================================================**/

Чтобы перейте непосредственно в браузер вводим эту команду
Только нужно чтобы minikube был запущен
minikube dashboard

/**===============================================================================================================**/