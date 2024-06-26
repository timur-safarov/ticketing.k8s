import express from 'express';
import { currentUser } from '@npm-tisafarov/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {

	// res.send('Hi there currentuser!');
	res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };