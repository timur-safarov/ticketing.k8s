import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@npm-tisafarov/common';
import { createTicketsRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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

app.use(currentUser);
app.use(createTicketsRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

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