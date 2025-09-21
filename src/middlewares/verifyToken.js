import { request, response } from 'express';
import * as userRepositories from '../repositories/userRepositores';
import jwt from 'jsonwebtoken';

export default async function verifyToken(req = request, res = response, next) {
  const authorization = req.headers.authorization;

  if (authorization && (authorization.startsWith('Bearer ') || authorization.startsWith('JWT '))) {
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY ?? '', async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token Invalid',
        });
      }

      const data = decoded;
      const user = await userRepositories.findUniqueUserId(data.id);

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Token Invalid',
    });
  }
}
