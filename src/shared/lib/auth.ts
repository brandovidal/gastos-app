export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function getCurrentUser(): AuthUser | null {
  return null;
}

export function isAuthenticated(): boolean {
  return false;
}
