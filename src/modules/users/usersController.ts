import { Request, Response } from 'express';

export const getMe = (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
    });
}