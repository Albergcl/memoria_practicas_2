import { Request, Response } from "express";;
import { loginUser, registerUser } from "./authService";
import { getDB } from "../../database/mongo"

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUser(getDB(), { username, email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await loginUser(getDB(), email, password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
