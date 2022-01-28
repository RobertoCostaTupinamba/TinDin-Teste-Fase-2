import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { user } from '../models/User';

export interface IUserPayload {
  email: string;
  password: string;
}

export type resUser = {
  token?: string;
  user?: user;
  status?: number;
  message?: string | string[];
};

export class UserService {
  public async authUser(payload: IUserPayload): Promise<resUser> {
    const { email, password } = payload;
    let response: resUser;
    const errosCamposFaltando = [];

    // Validação
    if (!email) {
      errosCamposFaltando.push('O nome é obrigatório');
    }

    if (!password) {
      errosCamposFaltando.push('A senha é obrigatório');
    }

    if (errosCamposFaltando.length !== 0) {
      response = { message: errosCamposFaltando, status: 400 };
      return response;
    }

    // check if user exists
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      response = { message: 'E-mail ou senha inválida!', status: 404 };
      return response;
    }

    // check password
    const checkPassword = await bcrypt.compare(password, userExist.password);

    if (!checkPassword) {
      response = { message: 'E-mail ou senha inválida!', status: 404 };
      return response;
    }

    const secret: string = process.env.SECRET || '';

    const token = jwt.sign(
      {
        id: userExist._id,
      },
      secret,
      {
        expiresIn: '30m', // Expira em 30 minutos
      },
    );

    response = { token, user: { _id: userExist._id, name: userExist.name, email: userExist.email } };

    return response;
  }
}
