import { CustomError } from './custom-error';

/**
 *  throw new DatabaseConnectionError();
 * 
 */
export class DatabaseConnectionError extends CustomError {

	statusCode = 500;
	reason = 'Error connection to Database';

	constructor() {

		// Прописываем super() чтобы вызывать конструктор внутри базового класса
		super('Error connection to Database');

		// Only because we are extending a build in class
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);

	}

	serializeErrors() {
		return [
			{ message: this.reason }
		];
	}

}