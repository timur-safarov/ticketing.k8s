import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {

	// process.env.JWT_KEY мы создаём через pod(Deployment) auth-depl.yaml
	// Он нужен для токен авторизации
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	try {

		// auth-mongo-srv - имя сервиса
		// ip адрес по умолчанию
		// имя базы данных - mongoose создаст её автоматически
		// В фигурных скобках пишем доплнительные опции
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			// bufferCommands?: boolean,
			// authSource: 'admin',
			// dbName: 'auth',
			// user: 'root',
			// pass: 'root',
			autoIndex: true,
			autoCreate: true,
		});

		console.log('Connected to MongoDb');

	} catch(err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!');
	});

};

start();

// app.get('/api/users/currentuser', (req, res) => {
// 	res.send('Hi there!');
// });

