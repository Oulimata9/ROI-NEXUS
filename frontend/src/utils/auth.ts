interface AuthResponseLike {
  access_token?: string;
  user_name?: string;
  id_user?: number | string;
  id_entreprise?: number | string;
  role?: string;
}

interface JwtPayload {
  sub?: string;
  id_user?: number | string;
  id_entreprise?: number | string;
  role?: string;
}

const AUTH_NOTICE_KEY = 'auth_notice';

export const AUTH_INVALIDATED_EVENT = 'nexus-auth-invalidated';

function decodeJwtPayload(token: string): JwtPayload {
  try {
    const payloadBase64 = token.split('.')[1];
    const normalizedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return {};
  }
}

export function persistAuthSession(token: string, authResponse?: AuthResponseLike) {
  const decodedPayload = decodeJwtPayload(token);
  const userName = authResponse?.user_name || decodedPayload.sub || '';
  const idUser = authResponse?.id_user ?? decodedPayload.id_user;
  const idEntreprise = authResponse?.id_entreprise ?? decodedPayload.id_entreprise;
  const role = authResponse?.role ?? decodedPayload.role ?? '';

  localStorage.setItem('token', token);
  localStorage.setItem('user_name', String(userName));

  if (idUser !== undefined && idUser !== null) {
    localStorage.setItem('id_user', String(idUser));
  }

  if (idEntreprise !== undefined && idEntreprise !== null) {
    localStorage.setItem('id_entreprise', String(idEntreprise));
  }

  if (role) {
    localStorage.setItem('user_role', String(role));
  }
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_name');
  localStorage.removeItem('id_user');
  localStorage.removeItem('id_entreprise');
  localStorage.removeItem('user_role');
}

export function setAuthNotice(message: string) {
  sessionStorage.setItem(AUTH_NOTICE_KEY, message);
}

export function consumeAuthNotice() {
  const notice = sessionStorage.getItem(AUTH_NOTICE_KEY);
  if (notice) {
    sessionStorage.removeItem(AUTH_NOTICE_KEY);
  }
  return notice;
}
