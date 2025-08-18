// import { ApiClient } from '../api-client.js';

// export class ConnexionServices {
//   constructor(base = 'http://localhost:3000/auth/login') {
//     this.api = new ApiClient(base);
//   }

//   async login(email,password){
//     const user =await  this.api.post({
//     "email": email,
//     "pass": password
// });
//      console.log(user);
//     if (!user) {
//         throw new Error("IL semble que cet utilisateur n'existe pas");
//     }

//     // Sauvegarde l'utilisateur dans localStorage
//     localStorage.setItem('user', JSON.stringify(user));

//     // Redirection vers la page principale
//     window.location.hash = '#dashboardAdmin';
//     history.replaceState(null, null, '#dashboardAdmin'); // Bloque retour

//     return user
//   }

//     logout() {
//     localStorage.removeItem('user');
//     window.location.hash = '#login';
//   }

// }
// ConnexionServices.js
import { ApiClient } from '../api-client.js';

export class ConnexionServices {
  constructor(base = 'http://localhost:3000/') {
    this.api = new ApiClient(base);
  }

  async login(email, password) {
    const res = await this.api.post("auth/login",{ email , pass: password });
    console.log(res);
    
    // res = { token, role }

    if (!res?.token) throw new Error("Identifiants invalides");

    const token = res.token;

    // Sauvegarde dans localStorage
    localStorage.setItem("token", token);
    // localStorage.setItem("role", role);
    // Redirection
    window.location.hash = '#dashboardAdmin';
    history.replaceState(null, null, '#dashboardAdmin');
    return res;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.hash = '#login';
  }
}
