// export function getToken() {
//   return localStorage.getItem('token') || null;
// }

// export function getRole() {
//   return localStorage.getItem('role') || null;
// }

// // Décodage JWT sans lib externe (base64url -> JSON)
// export function decodeJwt(token) {
//   try {
//     const payload = token.split('.')[1];
//     const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//     const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
//     const json = atob(base64 + pad);
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// // Retourne { id, prenom, nom, role } à partir du token
// export function getLoggedUser() {
//   const token = getToken();
//   if (!token) return null;

//   const claims = decodeJwt(token);
//   if (!claims) return null;

//   return {
//     id: claims.userId,
//     prenom: claims.prenom,
//     nom: claims.nom,
//     role: getRole()
//   };
// }
// auth.js
import {jwtDecode} from "jwt-decode";

/**
 * Récupère le token dans localStorage
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Construit le header Authorization avec le token JWT
 */
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Décode le token JWT et renvoie l’utilisateur connecté
 */
export function getLoggedUser() {
  const token = getToken();
//   const role = localStorage.getItem("role")
if (!token) return null;
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // Exemple de payload renvoyé :
    // { userId, prenom, nom, role, iat, exp }
    console.log(decoded);
    
    return decoded ;
  } catch (err) {
    console.error("Erreur décodage token :", err);
    return null;
  }
}

/**
 * Déconnexion de l’utilisateur
 */
// export function logout() {
//   localStorage.removeItem("token");
//   window.location.hash = "#login";
// }
