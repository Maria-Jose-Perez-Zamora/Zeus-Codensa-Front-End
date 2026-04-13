const AUTH_TOKEN_KEY = "techcup.auth.token";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
