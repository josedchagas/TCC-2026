import { verifyToken } from "../utils/jwt.js";

/**
 * Protege uma rota: exige um header "Authorization: Bearer <token>".
 * Se o token for válido, guarda os dados do usuário em req.user e deixa passar.
 * Se não, responde 401 sem nem chegar na rota de verdade.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization; // ex: "Bearer eyJhbGciOi..."

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não enviado." });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token); // { id, username, iat, exp }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}