// Обработчик ошибок
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {

	if (err instanceof CustomError) {

        // console.log(err.errors);
        // const validationErrors: ValidationResultError = {};
        // err.errors.forEach((error) => {});
		// err.errors.map((error) => {});

        // 400 - that means is a bad request
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });

	}

	res.status(400).send({
		errors: [{ message: 'Something went wrong' }]
	});

};