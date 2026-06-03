import { Db } from 'mongodb';
import { comparePassword, hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';

/*
    El service no sabe nada de Express.
    Solo recibe datos y devuelve resultados
*/

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (db: Db, data: RegisterData) => {
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = {
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  };
  const result = await usersCollection.insertOne(newUser);

  return { message: "User registered successfully"};
};

export const loginUser = async (db: Db, email: string, password: string) => {
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return { token };
}