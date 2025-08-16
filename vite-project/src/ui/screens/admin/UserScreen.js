import { Modal } from "../../components/Modal.js";
import { UserService } from "../../../domain/users/user.service.js";
import { UserServices } from "../../../data/service/userService.js";
import { User } from "../../../domain/users/User.js";
import { uploadImageToCloudinary } from "../../../utils/cloudinary.js";

export default class UsersScreen {
  constructor(root) {
    this.root = root;
    this.userSvc = new UserService(new UserServices());
    this.state = {
      page: 1,
      perPage: 3,
      total: 0,
      view: 'active', // active | deleted
      display: 'cards', // cards | rows
      users: []
    };
  }

  async render() {
    this.root.innerHTML = `
      <div class="flex justify-between mb-4 bg-white p-2 rounded">
        <div class="flex gap-2">
          <button id="btn-add" class="bg-indigo-600 text-white px-4 py-2 rounded">+ Ajouter</button>
          <select id="display-mode" class="border px-2 rounded">
            <option value="cards" ${this.state.display === 'cards' ? 'selected' : ''}>Cartes</option>
            <option value="rows" ${this.state.display === 'rows' ? 'selected' : ''}>Lignes</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button data-v="active" class="tab px-3 py-1 rounded">Actifs</button>
          <button data-v="deleted" class="tab px-3 py-1 rounded">Corbeille</button>
        </div>
      </div>

      <div id="user-container" class="mt-4"></div>
      <div id="paginator" class="flex justify-center mt-4 gap-2"></div>
    `;

    await this._load();
    this._renderUsers();
    this._renderPager();
    this._bindEvents();
  }

  _bindEvents() {
    this.root.querySelector('#btn-add').onclick = () => this._form();
    this.root.querySelectorAll('[data-v]').forEach(btn => {
      btn.onclick = () => {
        this.state.view = btn.dataset.v;
        this.render();
      };
    });
    this.root.querySelector('#display-mode').onchange = (e) => {
      this.state.display = e.target.value;
      this._renderUsers();
    };
  }

  async _load() {
    const { data, headers } = await this.userSvc.list(this.state.page, this.state.perPage);
    const isActiveView = this.state.view === 'active';
    this.state.users = data.filter(u => u.isActive === isActiveView);
    this.state.total = +headers.get('X-Total-Count') || this.state.users.length;
  }

  _renderUsers() {
    const container = this.root.querySelector('#user-container');
    container.innerHTML = '';
    if (this.state.display === 'cards') {
      container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      this.state.users.forEach(user => {
        const card = document.createElement('div');
        card.className = `bg-white rounded shadow p-4 ${user.deleted ? 'opacity-50' : ''}`;
        card.innerHTML = `
          <div class="h-40 bg-gray-200 mb-2 flex items-center justify-center">
            ${user.image ? `<img src="${user.image}" class="object-cover h-full w-full rounded">` : '<span class="text-gray-500">Aucune image</span>'}
          </div>
          <h3 class="font-bold">${user.nom} ${user.prenom}</h3>
          <p class="text-sm text-gray-500">${user.telephone}</p>
          <p>${user.email}</p>
          <div class="flex justify-between mt-2">
            <button class="btn-edit bg-amber-500 text-white px-2 py-1 rounded">Edit</button>
            ${!user.deleted
              ? `<button class="btn-delete bg-red-600 text-white px-2 py-1 rounded">Del</button>`
              : `<button class="btn-restore bg-green-600 text-white px-2 py-1 rounded">Restaurer</button>`}
          </div>
        `;
        card.querySelector('.btn-edit').onclick = () => this._form(user);
        if (!user.deleted) {
          card.querySelector('.btn-delete').onclick = async () => {
            await this.userSvc.trash(user.id);
            this.render();
          };
        } else {
          card.querySelector('.btn-restore').onclick = async () => {
            await this.userSvc.restore(user.id);
            this.render();
          };
        }
        container.appendChild(card);
      });
    } else {
      container.className = '';
      const table = document.createElement('table');
      table.className = 'w-full bg-white rounded shadow';
      table.innerHTML = `
        <thead>
            <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
          ${this.state.users.map((u, i) => `
            <tr class="${u.deleted ? 'opacity-50' : ''}">
              <td>${i+1}</td>
              <td>${u.getNomComplet()}</td>
              <td>${u.telephone}</td>
              <td>${u.email}</td>
              <td>
                <button class="btn-edit bg-amber-500 text-white px-2 py-1 rounded">Edit</button>
                ${!u.deleted
                  ? `<button class="btn-delete bg-red-600 text-white px-2 py-1 rounded">Del</button>`
                  : `<button class="btn-restore bg-green-600 text-white px-2 py-1 rounded">Restaurer</button>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      `;
      container.appendChild(table);
      container.querySelectorAll('.btn-edit').forEach((btn, idx) => btn.onclick = () => this._form(this.state.users[idx]));
      container.querySelectorAll('.btn-delete').forEach((btn, idx) => btn.onclick = async () => {
        await this.userSvc.trash(this.state.users[idx].id);
        this.render();
      });
      container.querySelectorAll('.btn-restore').forEach((btn, idx) => btn.onclick = async () => {
        await this.userSvc.restore(this.state.users[idx].id);
        this.render();
      });
    }
  }

  _renderPager() {
    const pag = this.root.querySelector('#paginator');
    pag.innerHTML = '';
    const n = Math.ceil(this.state.total / this.state.perPage);
    for (let i = 1; i <= n; i++) {
      const b = document.createElement('button');
      b.textContent = i;
      b.className = `px-3 py-1 rounded ${i === this.state.page ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`;
      b.onclick = () => { this.state.page = i; this.render(); };
      pag.appendChild(b);
    }
  }

_form(user) {
  user = user ? new User(user) : new User({});
  const f = document.createElement('form');
  f.className = 'grid gap-2';

  f.innerHTML = `
    <input name="prenom" placeholder="Prénom" value="${user.prenom || ''}" class="border p-1 rounded">
    <input name="nom" placeholder="Nom" value="${user.nom || ''}" class="border p-1 rounded">
    <input name="adresse" placeholder="Adresse" value="${user.adresse || ''}" class="border p-1 rounded">
    <input name="telephone" placeholder="Téléphone" value="${user.telephone || ''}" class="border p-1 rounded">
    <input name="email" placeholder="Email" value="${user.email || ''}" class="border p-1 rounded">
    <input name="password" placeholder="Mot de passe" type="password" class="border p-1 rounded">
    <select name="role" class="border p-1 rounded">
      <option value="">Sélectionner un rôle</option>
      <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Patient</option>
      <option value="medecin" ${user.role === 'medecin' ? 'selected' : ''}>Médecin</option>
      <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
    </select>
    <select name="specialite" class="border p-1 rounded" style="display:${user.role === 'medecin' ? 'block' : 'none'}">
      <option value="">Choisir spécialité</option>
      <option value="cardiologie" ${user.specialite === 'cardiologie' ? 'selected' : ''}>Cardiologie</option>
      <option value="dermatologie" ${user.specialite === 'dermatologie' ? 'selected' : ''}>Dermatologie</option>
    </select>
    <input name="image" type="file" class="border p-1 rounded" accept="image/*">
    <div class="flex justify-end mt-4">
      <button class="bg-indigo-600 text-white px-4 py-2 rounded">Enregistrer</button>
    </div>
  `;

  const roleSelect = f.role;
  const specSelect = f.specialite;
  roleSelect.onchange = () => {
    specSelect.style.display = roleSelect.value === 'medecin' ? 'block' : 'none';
  };

  const dlg = new Modal(user.id ? 'Modifier Utilisateur' : 'Nouveau Utilisateur', f);
  dlg.open();

  f.onsubmit = async (e) => {
    e.preventDefault();
    const file = f.image.files[0];
    let imageUrl = user.image || '';

    if (file) {
      try {
        imageUrl = await uploadImageToCloudinary(file);
      } catch (err) {
        alert('Erreur upload image : ' + err.message);
        return;
      }
    }

    const payload = {
      id: user.id,
      nom: f.nom.value.trim(),
      prenom: f.prenom.value.trim(),
      adresse: f.adresse.value.trim(),
      telephone: f.telephone.value.trim(),
      email: f.email.value.trim(),
      password: f.password.value.trim() || undefined, // ne pas écraser si vide
      role: f.role.value,
      specialiteId: f.role.value === 'medecin' ? (f.specialite.value || null) : null,
      image: imageUrl,
      isActive: user.isActive
    };

    try {
      if (user.id) {
        await this.userSvc.update(payload);
      } else {
        await this.userSvc.create(payload);
      }
      dlg.close();
      this.render();
    } catch (err) {
      alert('Erreur lors de l\'enregistrement : ' + err.message);
    }
  };
}

}
