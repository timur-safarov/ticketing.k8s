import express, { Request, Response } from 'express';
// import { body, query, Result, validationResult } from 'express-validator';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@npm-tisafarov/common';

import { User } from '../models/user';

// Так как у нас есть validateRequest то RequestValidationError нам больше не нужен
// import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/signup', [
		body('email').isEmail()
			.withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters')
	],
	validateRequest,
	async (req: Request, res: Response) => {

	// Так как у нас есть validateRequest убераем тут errors
	// const errors = validationResult(req);
	// const errors: Result = validationResult(req);

	// if (!errors.isEmpty()) {
	// 	throw new RequestValidationError(errors.array());
	// }
	
	const { email, password } = req.body;

	// Если пользователь не будет найден то вернёт null
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		// В консоль ошибку вывести можно так
		// console.log('Email in use');
		// return res.send({});
		throw new BadRequestError('Email in use');
	}

	const user = User.build({
		email,
		password
	});

	await user.save();

	// Generate GWT
	// process.env.JWT_KEY мы создаём через pod(Deployment) auth-depl.yaml
	// process.env.JWT_KEY! - восклицательный на конце говорит что мы знаем 100% что переменная определена уже
	const userJwt = jwt.sign(
		{
			id: user.id,
			email: user.email
		}, process.env.JWT_KEY!
	);

	// Store it on session object
	req.session = {
		jwt: userJwt
	};

	// 201 так как пользователь был только что создан
	res.status(201).send(user);

});

export { router as signupRouter };