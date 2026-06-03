import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};