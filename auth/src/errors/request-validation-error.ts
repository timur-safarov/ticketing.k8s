import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

/**
 *  throw new RequestValidationError();
 * 
 */
export class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {

		// Прописываем super() чтобы вызывать конструктор внутри базового класса
		// Потому как у нас есть extends класс
		super('Invalid request parametrs');

		// Only because we are extending a build in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);

	}

	serializeErrors() {

		// Тут будет возвращён массив
		return this.errors.map((err) => {

			if (err.type === 'field') {
				return { message: err.msg, field: err.path };
			} else {
				return {};
			}

		});
	}

}