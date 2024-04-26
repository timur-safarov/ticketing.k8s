import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

// Так как у нас есть validateRequest то RequestValidationError нам больше не нужен
// import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/signin', [

	body('email')
		.isEmail()
		.withMessage('Email must be valid'),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('You must supply a password'),

], 
validateRequest, 
async (req: Request, res: Response) => {

	// Так как у нас есть validateRequest убираем проверку errors
	// const errors = validationResult(req);
	
	// if (!errors.isEmpty()) {
	// 	throw new RequestValidationError(errors.array());
	// }

	// res.send('Hi there signin!');

	const { email, password } = req.body;

	const existingUser = await User.findOne({ email });

	if (!existingUser) {
		throw new BadRequestError('Invalid credentials - user not found');
	}

	const passwordsMatch = await Password.compare(
		existingUser.password,
		password
	);

	if (!passwordsMatch) {
		throw new BadRequestError('Invalid credentials - the wrong password');
	}

	// Generate GWT
	// process.env.JWT_KEY мы создаём через pod(Deployment) auth-depl.yaml
	// process.env.JWT_KEY! - восклицательный на конце говорит что мы знаем 100% что переменная определена уже
	const userJwt = jwt.sign(
		{
			id: existingUser.id,
			email: existingUser.email
		}, process.env.JWT_KEY!
	);

	// Store it on session object
	req.session = {
		jwt: userJwt
	};

	// 200 Так как пользователь был выбран из базы
	res.status(200).send(existingUser);

});

export { router as signinRouter };