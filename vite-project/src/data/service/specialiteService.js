import { Specialite } from '../../domain/specialite/Specialite.js';
import { ApiClient } from '../api-client.js';

export class SpecialiteServices  {
  constructor(base = 'http://localhost:3000/') {
    this.api = new ApiClient(base);
  }

  /* ---------- READ ---------- */
  async list(page = 1, limit = 10) {
    const { data, headers } = await this.api.get('specialite/liste', {
      _page: page,
      _limit: limit,
    });
    console.log(data);
    return { data: data.map(Specialite.fromDto), headers };
  }

  /* ---------- CREATE ---------- */
create(cat) {
  const spec = cat instanceof Specialite ? cat : new Specialite(cat);
  const { id, ...body } = spec.toDto();

  return this.api.post('specialite/create', body).then(Specialite.fromDto);
}

  /* ---------- UPDATE ---------- */
    update(spec) {
    if (spec.id == null) throw new Error('id manquant pour update');
    return this.api.put(spec.id, spec.toDto()).then(Specialite.fromDto);
  }

  async get(id) {
    const data = await this.api.get(id);
    return User.fromDto(data);
  }

//   async getByTel(tel, statut) {
    
//     const data = await this.api.get(`admin/userByTel`, {
//         telephone: tel,
//         statut: statut
    
//     });
//     console.log(data.data);
//   return data.data.map(User.fromDto);

// }
  
}
