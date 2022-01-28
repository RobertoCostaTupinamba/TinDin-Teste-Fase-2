import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenInterface {
  id: {
    id: string;
  };
}

export default function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso Negado!!' });
  }

  try {
    const secret = process.env.SECRET || '';

    const id = jwt.verify(token, secret);

    res.locals.id = (id as TokenInterface).id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
