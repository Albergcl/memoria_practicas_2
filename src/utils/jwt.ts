import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};