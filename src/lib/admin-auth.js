import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bh_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters.");
  return value;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expires);
  return { token: `${payload}.${sign(payload)}`, expires };
}

export function verifyAdminSession(token) {
  if (!token || typeof token !== "string") return false;
  const [expiresText, signature, extra] = token.split(".");
  if (!expiresText || !signature || extra) return false;
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expiresText);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifyAdminSession(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminRequest())) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

export const adminCookieName = COOKIE_NAME;
export const adminSessionMaxAge = SESSION_TTL_SECONDS;
