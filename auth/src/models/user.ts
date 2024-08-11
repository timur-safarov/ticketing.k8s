import mongoose from 'mongoose';
import { Password } from '../services/password';

/**
 *  An interface that describes the properties
 * 	that are required to create a new User
 */
interface UserAttrs {
	email: string;
	password: string;
}

/**
 *  An interface that describes the properties
 * 	that a User model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

/**
 *  An interface that describes the properties
 * 	that a User Document has
 */
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		// Тут мы пишем String с большой буквы потому что ссылаемся на реальный JS внутри mongoose
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	// toJSON меняет и удаляет значения в текущем объекте
	toJSON: {
		transform(doc, ret) {
			// Тут мы просто менаем ret._id на ret.id чтобы выглядело презентабельней
			// А также удаляем password чтобы его не было вывести, только передать
			ret.id = ret._id;
			delete ret._id;
			delete ret.password;
			delete ret.__v;
		}
	}
});

userSchema.pre('save', async function(done) {

	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	
	done();

});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
// 	email: 'test@test.com',
// 	password: 'root'
// });

export { User };