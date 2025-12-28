/**
 * Simple authentication utility for admin dashboard
 * Uses password stored in environment variable
 */

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  return password === adminPassword;
}

export function createSessionToken(): string {
  // Simple session token (in production, use proper JWT or session management)
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

