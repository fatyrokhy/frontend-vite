import { ApiClient } from '../api-client.js';
import { User }  from '../../domain/users/User.js';

export class UserServices  {
  constructor(base = 'http://localhost:3000/') {
    this.api = new ApiClient(base);
  }

  /* ---------- READ ---------- */
  async list(page = 1, limit = 10) {
    const { data, headers } = await this.api.get('admin/listeUser', {
      _page: page,
      _limit: limit,
    });
    console.log(data);
    
    return { data: data.map(User.fromDto), headers };
  }

  /* ---------- CREATE ---------- */

create(cat) {
  const user = cat instanceof User ? cat : new User(cat);
  const { id, password, ...body } = user.toDto();

  // ne pas envoyer specialiteId vide
  if (body.specialiteId === "" || body.specialiteId === undefined) {
    body.specialiteId = null;
  }

  // envoyer password seulement s’il est rempli
  if (password && password.trim() !== "") {
    body.pass = password;
  }

  return this.api.post('admin/create', body).then(User.fromDto);
}

  /* ---------- UPDATE ---------- */
    update(user) {
    if (user.id == null) throw new Error('id manquant pour update');
    return this.api.put(user.id, user.toDto()).then(User.fromDto);
  }

  /* ---------- SOFT-DELETE / RESTORE ---------- */
  trash(id)   { return this._toggle(id, true ); }
  restore(id) { return this._toggle(id, false); }
  

    async _toggle(id, del) {
    if (id == null) throw new Error('id manquant');
    // choisir la bonne route
    const endpoint = del 
      ? `admin/desactiver/${id}` 
      : `admin/restaurer/${id}`;

    return this.api.patch(endpoint).then(User.fromDto);
  }


  async get(id) {
    const data = await this.api.get(id);
    return User.fromDto(data);
  }

  async getByTel(tel, statut) {
    
    const data = await this.api.get(`admin/userByTel`, {
        telephone: tel,
        statut: statut
    
    });
    console.log(data.data);
  return data.data.map(User.fromDto);

}
  
}
