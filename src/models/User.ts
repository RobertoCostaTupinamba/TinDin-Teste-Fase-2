import { Schema, model, Types } from 'mongoose';

import validateEmail from '../utils/validateEmail';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export type user = {
  name: string;
  _id: Types.ObjectId;
  email: string;
};

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'E-mail é obrigatório'],
    validate: [validateEmail, 'Insira um endereço de E-mail válido'],
  },
  password: { type: String, required: true },
});

const UserModel = model<IUser>('User', schema);

export default UserModel;
