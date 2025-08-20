import { Specialite } from './Specialite.js';

export class SpecialiteService {
  constructor(service) {
    this.service = service; // service doit avoir les méthodes .list, .create, etc.
  }

  async list(page = 1, limit = 10) {
    return this.service.list(page, limit);
  }

  async create(spec) {
    if (!(spec instanceof Specialite)) {
      spec = new Specialite(spec);
    }
    if (!spec.isValid()) {
      throw new Error('Utilisateur invalide');
    }
    return this.service.create(spec.toDto());
  }

  async update(spec) {
    if (!(spec instanceof Specialite)) {
      spec = new Specialite(spec);
    }
    if (!spec.id) {
      throw new Error('ID manquant pour la mise à jour');
    }
    if (!spec.isValid()) {
      throw new Error('Utilisateur invalide');
    }
    return this.service.update(spec.toDto());
  }

  async trash(id) {
    if (!id) throw new Error('ID manquant');
    return this.service.trash(id);
  }

  async restore(id) {
    if (!id) throw new Error('ID manquant');
    return this.service.restore(id);
  }

  async get(id) {
    if (!id) throw new Error('ID manquant');
    const dto = await this.service.get(id);
    return new Specialite(dto);
  }
//   async getByTel(tel, status) {
//   if (!tel) throw new Error('telephone inexistant');
//   const data = await this.service.getByTel(tel, status);
//   console.log(data);
  
//   return data; // inutile de refaire new User(dto)
// }
  
}
