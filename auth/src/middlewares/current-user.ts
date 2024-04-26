import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface UserPayload {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}


export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {

	// Короткая проверка для - !req.session || !req.session.jwt
	if (!req.session?.jwt) {
		return next();
	}

	try {

		// process.env.JWT_KEY мы создаём через pod(Deployment) auth-depl.yaml
		// process.env.JWT_KEY! - восклицательный на конце говорит что мы знаем 100% что переменная определена уже
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;

		req.currentUser = payload;

	} catch(err) {}

	next();

};
