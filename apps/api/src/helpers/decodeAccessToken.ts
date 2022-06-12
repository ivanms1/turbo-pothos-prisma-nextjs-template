import jwt from 'jsonwebtoken';

const decodeAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export default decodeAccessToken;
