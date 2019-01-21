import jwt from 'jsonwebtoken';

export const generateToken = userId =>
  jwt.sign({ userId }, process.env.AUTH_SECRET, { expiresIn: '2 weeks' });
