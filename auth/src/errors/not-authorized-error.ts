import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {

	statusCode = 401;

	constructor() {
		super('Not authorized');

		// для получения и установки прототипов рекомендуется использовать 
		// методы getPrototypeOf() и setPrototypeOf().
		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}

	serializeErrors() {
		return [{ message: 'Not authorized' }];
	}

}