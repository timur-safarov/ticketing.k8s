import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ConnectOptions, connect } from "mongoose";
import request from 'supertest';

// Импортируем запуск приложения из файла app
import { app } from "../app";

// https://stackoverflow.com/questions/73780201/i-cant-understand-how-do-globals-work-in-typescript-nodejs-and-what-is-their

// Включаем global перепенные для TYPESCRIPT
// declare global as typeof globalThis

// declare global {
// 	namespace NodeJS {
// 		interface Global {
// 			signin(): Promise<string[]>;
// 		}
// 	}
// }

declare global {
  function signin(): Promise<string>;
}


let mongo: any;

// До всего
beforeAll(async() => {

	// Временно создадим тут переменную ENV
	process.env.JWT_KEY = 'SDFAGFDHGFDHGF';

	// this no longer works
	// mongo = new MongoMemoryServer();
	// const mongoUri = await mongo.getUri();

	// it is now
	// Этот пакет программно запускает реальный/настоящий сервер MongoDB 
	// из nodejs для тестирования или макетирования во время разработки.
	// По умолчанию он хранит данные в памяти. Свежий запущенный процесс mongod занимает около 7 МБ памяти. 
	// Сервер позволит вам подключить вашу любимую ODM или клиентскую библиотеку к серверу MongoDB 
	// и запускать изолированные друг от друга интеграционные тесты.
	mongo = await MongoMemoryServer.create();

	// mongodb://127.0.0.1:21930/
	const mongoUri = mongo.getUri();

	// mongoose.connect('<строка-соединения>', <опции>, <обратный вызов>);
	// Функция обратного вызова записывает на консоль сообщение, указывающее, было ли соединение успешным или нет.
	// await mongoose.connect(mongoUri, {
	// 	useNewUrlParser: true,
	// 	useUnifiedTopology: true
	// } as ConnectOptions);

	// mongoose 8^ connect
	await mongoose.connect(mongoUri, {});


});

// До того как все тесты начнутся
beforeEach(async () => {

	const collections = await mongoose.connection.db.collections();

	// Удаляем существующие коллекции в базе
	for(let collection of collections) {
		await collection.deleteMany({});
	}

});


afterAll(async () => {

	await mongo.stop();
	await mongoose.connection.close();

});


global.signin = async () => {

	const email = 'test@test.com';
	const password = 'password';

	const responce = await request(app)
		.post('/api/users/signup')
		.send({
			email,
			password
		})
		.expect(201);

	const cookie = responce.headers['set-cookie'];

	// const cookie = responce.get('Set-Cookie');

	// Мы увидем вывод в терминале после cd auth && npm run test
	// console.log(cookie);

	return cookie;

};