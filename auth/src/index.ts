import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';

import { NotFoundError } from './errors/not-found-error';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: true
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

/**
 * Эту ошибку нужно выводить до app.use(errorHandler);
 * Без express-async-errors async будет работать только без throw
 * 
 * app.get('*', async (req, res, next) => {
 * 		next(new NotFoundError('Broken'));
 * });
 * 
 */
app.get('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

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

