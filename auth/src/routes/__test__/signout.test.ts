import request from 'supertest';

// Импортируем запуск приложения из файла app
import { app } from "../../app";

it('clears the cookie signing out', async () => {

	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'email@email.com',
			password: 'password'
		})
		.expect(201);

	const responce = await request(app)
		.post('/api/users/signout')
		.send({})
		.expect(200);

	// Так тоже можно получить Cookie
	// НО это будет не массив, а хрен знает что
	// const cookies = responce.get('Set-Cookie');

	// А так мы получаем одинарный массив
	const cookies = responce.headers['set-cookie'];

	// session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly
    // console.log(cookies[0]);

	// Проверяем раны ли наши куки данной строке
	// ПО идеи данная сирока не длжна меняться, иначе тест не будет работать
	expect(cookies[0]).toEqual(
		'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
	);

});