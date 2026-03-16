import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "@ecommerce/shared";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export async function registerUser(data: RegisterInput) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (existing.length > 0) {
    throw new Error("El email ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  const user = result[0];
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

export async function loginUser(data: LoginInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
