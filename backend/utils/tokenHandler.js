import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax');
  const secure = isProduction || sameSite === 'none';

  res.cookie('token', token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
  });

  return token;
};
