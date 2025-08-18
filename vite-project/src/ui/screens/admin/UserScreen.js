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
          <button id="btn-add" class="bg-[#233977] text-white px-4 py-2 rounded">+ Ajouter</button>
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

      <div id="" class=" bg-white/75 rounded-md p-4 shadow-2xs flex flex-col gap-4">
      <div id="" class="  flex  gap-12">
        <h2>Liste des utilisateurs</h2>
        <select id="display-mode" class="border px-2 rounded w-40">
            <option value="" >Filtrer par role </option>
            <option value="admin" ${this.state.display === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="personnel" ${this.state.display === 'personnel' ? 'selected' : ''}>Personnel</option>
        </select>
        </div>
      <div id="user-container" class="mt-4"></div>
      </div>
      <div id="paginator" class="flex justify-center mt-4 gap-2"></div>
    `;

    await this._load();
    this._renderUsers();
    this._renderPager();
    this._bindEvents();
    this._init();

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

  if (this.state.users.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500">Aucun utilisateur trouvé</p>`;
    return;
  }

  if (this.state.display === 'cards') {
    container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    this.state.users.forEach(user => {
      const card = document.createElement('div');
      card.className = `bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 relative border text-center 
        ${user.isActive ?  'border-gray-200': 'opacity-50 border-red-300'}`;
      
      card.innerHTML = `
         <div class="flex justify-end gap-2 mb-4">
              <button class="btn-edit bg-[#88bce7] hover:bg-amber-600 text-white px-2 py-1 rounded-lg text-sm">
                <i class="ri-edit-line"></i>
              </button>
        ${user.isActive
            ? `<button class="btn-delete bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-sm">
                <i class="ri-delete-bin-3-line"></i>
            </button>`
            : `<button class="btn-restore bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                <i class="ri-restart-line"></i>
            </button>`}
        </div>
        <div class="h-32 w-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-4 mx-auto">
          ${user.image 
            ? `<img src="${user.image}" class="object-cover h-full w-full ">`
            : '<span class="text-gray-400 italic">Pas d\'image</span>'}
        </div>
        <h3 class="font-semibold text-lg">${user.nom} ${user.prenom}</h3>
        <p class="text-sm text-gray-600">${user.telephone}</p>
        <p class="text-sm text-gray-500 mb-4">${user.email}</p>
      `;

      // Events
      card.querySelector('.btn-edit').onclick = () => this._form(user);
      console.log(user);
      
      if (user.isActive) {
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
    // Vue table
    container.className = '';
    const table = document.createElement('table');
    table.className = 'w-full bg-white rounded-2xl shadow overflow-hidden';
    table.innerHTML = `
      <thead class="bg-[#00a13a] text-white">
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Nom</th>
          <th class="px-4 py-2">Téléphone</th>²
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${this.state.users.map((u, i) => `
          <tr class="border-b ${u.isActive ? 'hover:bg-gray-50' :  'opacity-50 bg-red-50'}">
            <td class="px-4 py-2">${i+1}</td>
            <td class="px-4 py-2 font-medium">${u.getNomComplet()}</td>
            <td class="px-4 py-2">${u.telephone}</td>
            <td class="px-4 py-2">${u.email}</td>
            <td class="px-4 py-2 space-x-2">
              <button class="btn-edit bg-[#88bce7] hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm">
                <i class="ri-edit-line"></i>
              </button>
              ${u.isActive
                ? `<button class="btn-delete bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">🗑️</button>`
                : `<button class="btn-restore bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">♻️</button>`}
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

//  async _load() {
//     const { data, headers } = await this.userSvc.list(this.state.page, this.state.perPage);

//     const isisActiveView = this.state.view === 'deleted';
//     this.state.users = data.filter(u => !u.deleted === isDeletedView);

//     this._renderUsers();
//   }

  /* ---------- RENDU LISTE UTILISATEURS ---------- */
//   _renderUsers() {
//     const container = document.querySelector("#user-container");
//     container.innerHTML = "";

//     this.state.users.forEach(user => {
//       const card = document.createElement("div");
//       card.className = "p-4 border rounded shadow-sm bg-white flex justify-between items-center";

//       card.innerHTML = `
//         <div>
//           <h3 class="font-semibold">${user.nom} ${user.prenom}</h3>
//           <p class="text-sm text-gray-600">${user.email} - ${user.telephone}</p>
//         </div>
//         <div class="flex gap-2">
//           ${
//             !user.deleted
//               ? `<button class="btn-delete bg-red-500 text-white px-2 py-1 rounded">🗑️ Supprimer</button>`
//               : `<button class="btn-restore bg-green-500 text-white px-2 py-1 rounded">♻️ Restaurer</button>`
//           }
//         </div>
//       `;

//       // Événements
//       if (!user.deleted) {
//         card.querySelector(".btn-delete").onclick = async () => {
//           await this.userSvc.trash(user.id);
//           this._load(); // recharger après suppression
//         };
//       } else {
//         card.querySelector(".btn-restore").onclick = async () => {
//           await this.userSvc.restore(user.id);
//           this._load(); // recharger après restauration
//         };
//       }

//       container.appendChild(card);
//     });
//   }

  /* ---------- SWITCH ONGLET ---------- */
  async switchView(view) {
    this.state.view = view;
    await this._load();
  }

async _init() {
  await this._load();   // charge la liste initiale
  this._renderUsers();

  // écouter la recherche en temps réel
  const searchInput = document.querySelector('#search');
  searchInput.addEventListener('input', async (e) => {
    console.log("bonjour");
    
    const tel = e.target.value.trim();

    if (tel.length === 0) {
      // Si le champ est vide => on recharge tous les users
      await this._load();
      this._renderUsers();
      return;
    }

    try {
    if (tel.length > 3) {
        
      const user = await this.userSvc.getByTel(tel);
      console.log(user);
      
      this.state.users = user ; // affiche seulement le user trouvé
      this._renderUsers();}
    } catch (err) {
      console.error("Erreur recherche tel:", err);
      this.state.users = [];
      this._renderUsers();
    }
  });
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
