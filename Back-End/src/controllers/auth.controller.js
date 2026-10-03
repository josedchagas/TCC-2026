import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { signToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

// POST /auth/register
export async function register(req, res) {
  const { username, email, password } = req.body;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)));

  if (existing.length > 0) {
    return res.status(409).json({ error: "Username ou email já cadastrado." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db
    .insert(users)
    .values({ username, email, passwordHash })
    .returning({ id: users.id, username: users.username, email: users.email });

  const token = signToken({ id: user.id, username: user.username });

  res.status(201).json({ user, token });
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const token = signToken({ id: user.id, username: user.username });

  res.json({
    user: { id: user.id, username: user.username, email: user.email },
    token,
  });
}

// GET /auth/me  (rota protegida — precisa do token)
export async function me(req, res) {
  const [user] = await db
    .select({ id: users.id, username: users.username, email: users.email, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  res.json({ user });
}