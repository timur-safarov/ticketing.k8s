import { CustomError } from './custom-error';

/**
 *  throw new NotFoundError();
 * 
 */
export class NotFoundError extends CustomError {
	
	statusCode = 404;

	constructor() {

		// Прописываем super() чтобы вызывать конструктор внутри базового класса
		// Потому как у нас есть extends класс
		super('Route not found');

		Object.setPrototypeOf(this, NotFoundError.prototype);

	}

	serializeErrors() {
		return [{ message: 'Not found' }];
	}

}