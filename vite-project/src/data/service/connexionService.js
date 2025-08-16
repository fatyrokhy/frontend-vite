import { ApiClient } from '../api-client.js';

export class ConnexionServices {
  constructor(base = 'http://localhost:3000/auth/login') {
    this.api = new ApiClient(base);
  }

  async login(email,password){
    const user =await  this.api.post({
    "email": email,
    "pass": password
});
     console.log(user);
    if (!user) {
        throw new Error("IL semble que cet utilisateur n'existe pas");
    }

    // Sauvegarde l'utilisateur dans localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirection vers la page principale
    window.location.hash = '#dashboardAdmin';
    history.replaceState(null, null, '#dashboardAdmin'); // Bloque retour

    return user
  }

    logout() {
    localStorage.removeItem('user');
    window.location.hash = '#login';
  }

}
