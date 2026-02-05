import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "./auth";

export type AuthedUser = {
  id: string;
  role: "admin" | "buddy";
  email: string;
};

export async function getAuthedUser(): Promise<AuthedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;

  try {
    const session = await verifySession(token);
    return {
      id: session.sub,
      role: session.role,
      email: session.email
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getAuthedUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
