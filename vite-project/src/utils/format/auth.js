import {jwtDecode} from "jwt-decode";


export function getToken() {
  return localStorage.getItem("token");
}


 // Construit le header Authorization avec le token JWT
 
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


 //Décode le token JWT et renvoie l’utilisateur connecté
export function getLoggedUser() {
  const token = getToken();

if (!token) return null;
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    console.log(decoded);
    
    return decoded ;
  } catch (err) {
    console.error("Erreur décodage token :", err);
    return null;
  }
}

