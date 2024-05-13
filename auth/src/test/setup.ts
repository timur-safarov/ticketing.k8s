import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ConnectOptions, connect } from "mongoose";

// Импортируем запуск приложения из файла app
import { app } from "../app";

let mongo: any;

// До всего
beforeAll(async() => {

	// Временно создадим тут переменную ENV
	process.env.JWT_KEY = 'SDFAGFDHGFDHGF';

	// this no longer works
	// mongo = new MongoMemoryServer();
	// const mongoUri = await mongo.getUri();

	// it is now
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	// mongoose.connect('<строка-соединения>', <опции>, <обратный вызов>);
	// Функция обратного вызова записывает на консоль сообщение, указывающее, было ли соединение успешным или нет.
	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	} as ConnectOptions);

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