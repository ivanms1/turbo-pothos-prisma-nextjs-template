import jwt from 'jsonwebtoken';

const decodeAccessToken = (token: string) => {
  if (process.env.JWT_SECRET) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  return '';
};

export default decodeAccessToken;
