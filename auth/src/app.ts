import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@npm-tisafarov/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true);
app.use(json());

// secure: true означает что мы используем https
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
		//secure: true
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

export { app };