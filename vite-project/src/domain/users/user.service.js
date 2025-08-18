import { User } from './User.js';

export class UserService {
  constructor(service) {
    this.service = service; // service doit avoir les méthodes .list, .create, etc.
  }

  async list(page = 1, limit = 10) {
    return this.service.list(page, limit);
  }

  async create(user) {
    if (!(user instanceof User)) {
      user = new User(user);
    }
    if (!user.isValid()) {
      throw new Error('Utilisateur invalide');
    }
    return this.service.create(user.toDto());
  }

  async update(user) {
    if (!(user instanceof User)) {
      user = new User(user);
    }
    if (!user.id) {
      throw new Error('ID manquant pour la mise à jour');
    }
    if (!user.isValid()) {
      throw new Error('Utilisateur invalide');
    }
    return this.service.update(user.toDto());
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
    return new User(dto);
  }
  async getByTel(tel) {
  if (!tel) throw new Error('telephone inexistant');
  const data = await this.service.getByTel(tel);
  console.log(data);
  
  return data; // inutile de refaire new User(dto)
}

  // async getByTel(tel) {
  //   if (!tel) throw new Error('telephone inexistant');
  //   const dto = await this.service.getByTel(tel);
  //   return new User(dto);
  // }

  // async listBoutiquiers() {
  //   const allUsers = await this.service.list(); // suppose que `list()` retourne tous les utilisateurs
  //   return allUsers
  //     .map(u => new User(u))
  //     .filter(u => u.estBoutiquier());
  // }

  // async listClients() {
  //   const allUsers = await this.service.list(); 
  //   return allUsers
  //     .map(u => new User(u))
  //     .filter(u => u.estClient());
  // }
}
