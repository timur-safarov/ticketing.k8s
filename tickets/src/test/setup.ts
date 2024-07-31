import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ConnectOptions, connect } from "mongoose";
import request from 'supertest';

// Импортируем запуск приложения из файла app
import { app } from "../app";
import jwt from 'jsonwebtoken';

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

// declare global {
//   function signin(): Promise<string>;
// }

// declare global {
// 	function signin(): string[];
// }


declare global {
	// Тут мы указываем что должун вернуться массив в котором будет строка
	// [`session=${base64}`]
	// если бы функция была бы асинхронная то нужно писать так Promise<string[]>;
	function signin(): string[];
}


let mongo: any;

// До всего
beforeAll(async() => {

	// Временно создадим тут переменную ENV
	process.env.JWT_KEY = 'SDFAGFDHGFDHGF';
	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

// Это нужно для тестов - тестовая авторизация
global.signin = () => {

	// Build JWT payload. { id, email }
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};

	// Create the JWT!
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build session object. { jwt: my_jwt }
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	// The Buffer. from() method creates a new buffer filled with the specified string, array, or buffer
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// Мы увидем вывод в терминале после cd tickets && npm run test
	// console.log(`express:sess=${base64}`);

	// return a string thats a coockie with the encoded data 
	// Тут должна начится строка так же как в браузере после авторизации
	// Чтобы увидеть передаваемые куки в консоли браузера идём сюда
	// network->Fetch/XHR->Headers

	// так было в уроке return [`express:sess=${base64}`];
	// а так у меня
	return [`session=${base64}`];

};