export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	/** 
	 * Указываем что метод должен вернуть массив - []
	 * 
	 */
	abstract serializeErrors(): {
		message?: string;
		field?: string;
	}[];

}