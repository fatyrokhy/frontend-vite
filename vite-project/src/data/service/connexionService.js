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
    // Redirection
    return res;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.hash = '#login';
  }
}
