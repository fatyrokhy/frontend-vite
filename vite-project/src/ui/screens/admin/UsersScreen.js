// import { Modal } from '../components/Modal.js';
// import { confirm } from '../components/Confirm.js';
// import { UserService } from '../../../domain/users/user.service.js';

import { UserServices } from "../../../data/service/userService.js";
import { User } from "../../../domain/users/User.js";
import { UserService } from "../../../domain/users/user.service.js";
import { Modal } from "../../components/Modal.js";

// import { UserServices } from '../../../data/service/userService.js';
export default class UsersScreen {
  constructor(root) {
    this.root = root;
    this.articleSvc = new UserService(new UserServices() );
    // this.categoryRepo = new CategorieServices();
    this.state = { 
      page: 1, 
      perPage: 12, 
      total: 0, 
      view: 'active', 
      articles: [],
    //   categories: [] // Pour stocker les catégories
    };
  }

  /* ----------- RENDER ----------- */
  async render() {
    this.root.innerHTML = `
      <div class="flex justify-between mb-4 bg-white/90 rounded-lg p-2">
        <button id="btn-add" class="bg-indigo-600 text-white px-4 py-2 rounded"
                ${this.state.view === 'deleted' ? 'disabled' : ''}>
          + Ajouter
        </button>
        <div class="flex gap-2">
          <button data-v="active" class="tab px-3 py-1 rounded bg-gray-200">Actifs</button>
          <button data-v="deleted" class="tab px-3 py-1 rounded bg-gray-200">Corbeille</button>
        </div>
      </div>
      <div class="flex  mb-4  bg-white/90 rounded-lg p-3">
      <div id="user-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>

        <table class="w-full bg-white shadow-sm rounded text-left">
      <thead>
        <tr class="border-b">
          <th class="p-2 w-12">#</th>
          <th class="p-2">Nom complet</th>
          <th class="p-2">Téléphone</th>
          <th class="p-2">Email</th>
          <th class="p-2 w-32"></th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>

      <div id="paginator" class="flex justify-center mt-6 gap-2"></div>`;

    await this._load();
    // await this._loadCategories(); // Charger les catégories
    this._rows();
    this._pager();
    this._tabs();
    this.setUpEventListeners();
    return this;
  }

  setUpEventListeners() {
    const btn = this.root.querySelector('#btn-add');
    if (btn) btn.onclick = () => this._form();
  }

  /* ----------- DATA ----------- */
  async _load() {
    const { data, headers } = await this.articleSvc.list(
      this.state.page,
      this.state.perPage
    );
    console.log(data);
    this.state.articles = data.filter(
      a => a.isActive === (this.state.view === true)
    );
    this.state.total = +headers.get('X-Total-Count') || this.state.articles.length;
  }

  /* ----------- TABS ----------- */
  _tabs() {
    const view = this.state.view;
    this.root.querySelectorAll('[data-v]').forEach(btn => {
      const active = btn.dataset.v === view;
      btn.classList.toggle('bg-indigo-600', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-gray-200', !active);
      btn.onclick = () => { 
      this.state.view = btn.dataset.v; 
      this.state.page = 1;
      this.render(); 
      };
    });
  }

  /* ----------- CARDS RENDERING ----------- */
//   _renderCard() {
//     const container = this.root.querySelector('#user-grid');
//     container.innerHTML = '';
//     const start = (this.state.page - 1) * this.state.perPage;

//     this.state.articles.forEach((article, idx) => {
//       console.log(article);
      
//     //   const category = this.state.categories.find(c => c.id === article.categoryId);
//     //   const categoryName = category ? category.libelle : 'Inconnue';

//       const card = document.createElement('div');
//       card.className = `bg-white rounded-lg shadow-md overflow-hidden ${
//         article.deleted ? 'opacity-50' : ''
//       }`;
//       card.innerHTML = `
//         <div class="h-48 bg-gray-200 flex items-center justify-center">
//           ${article.image 
//             ? `<img src="${article.image}" alt="${article.nom}" class="object-cover h-full w-full">` 
//             : '<span class="text-gray-500">Aucune image</span>'
//           }

//         </div>
//         <div class="p-4">
//           <h3 class="font-bold text-lg truncate">${article.nom}  ${article.prenom}</h3>
//           <p class="text-gray-500 text-sm">${article.telephone}</p>
//           <p class="font-bold mt-2">${article.email}</p>
          
//           <div class="flex justify-between mt-4">
//             <button class="btn-detail bg-indigo-600 text-white px-3 py-1 rounded text-sm">
//               Voir détail
//             </button>
//             <div class="flex gap-2">
//               ${!article.deleted ? `
//                 <button class="btn-edit bg-amber-500 text-white px-2 py-1 rounded text-sm">Edit</button>
//                 <button class="btn-delete bg-red-600 text-white px-2 py-1 rounded text-sm">Del</button>
//               ` : `
//                 <button class="btn-restore bg-green-600 text-white px-2 py-1 rounded text-sm">Restaurer</button>
//               `}
//             </div>
//           </div>
//         </div>`;

//       // Bouton Voir détail
// card.querySelector('.btn-detail').onclick = () => {
//   window.location.hash = `#articles/${article.id}`;
// };      
//     // Boutons d'actions
//       if (!article.deleted) {
//         card.querySelector('.btn-edit').onclick = () => this._form(article);
//         card.querySelector('.btn-delete').onclick = async () => {
//           if (await confirm('Mettre à la corbeille ?')) {
//             await this.articleSvc.trash(article.id);
//             this.render();
//           }
//         };
//       } else {
//         card.querySelector('.btn-restore').onclick = async () => {
//           await this.articleSvc.restore(article.id);
//           this.render();
//         };
//       }

//       container.appendChild(card);
//     });
//   }
  _renderCards() {
    const container = this.root.querySelector('#user-grid');
    container.innerHTML = '';
    const start = (this.state.page - 1) * this.state.perPage;

    this.state.articles.forEach((article, idx) => {
      console.log(article);
      
      const card = document.createElement('div');
      card.className = `bg-white rounded-lg shadow-md overflow-hidden p-4 ${
        article.deleted ? 'opacity-50' : ''
      }`;
      card.innerHTML = `
        <div class="flex flex-col items-center">
          <!-- Photo/avatar placeholder -->
          <div class="h-24 w-24   bg-gray-100 rounded-full mb-4 flex items-center justify-center">
            ${article.image 
              ? `<img src="${article.image}" alt="${article.nom}" class="object-cover h-full w-full rounded-full">` 
              : '<span class="text-gray-500">Photo</span>'
            }
          </div>
          
          <!-- Nom et titre -->
          <h3 class="font-bold text-lg">Dr. ${article.nom} ${article.prenom}</h3>
          <p class="text-gray-500 text-sm mb-4">${article.specialite || 'Family Doctor'}</p>
          
          <!-- Boutons -->
          <div class="flex gap-4 w-full justify-center">
            <button class="btn-chat bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              CHAT
            </button>
            <button class="btn-book bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              BOOK
            </button>
          </div>
        </div>`;

      // Bouton CHAT
      card.querySelector('.btn-chat').onclick = () => {
        // Action pour le chat
        console.log('Chat with', article.id);
      };
      
      // Bouton BOOK
      card.querySelector('.btn-book').onclick = () => {
        // Action pour booker
        console.log('Book with', article.id);
      };

      container.appendChild(card);
    });
  }

    _rows() {
    const tbody = this.root.querySelector('#tbody');
    tbody.innerHTML = '';
    const start = (this.state.page - 1) * this.state.perPage;

    this.state.list.forEach((c, idx) => {
      const tr = document.createElement('tr');
    //   tr.className = `border-b hover:bg-gray-50 ${c.isActive ? 'opacity-50 line-through' : ''}`;
      tr.innerHTML = `
        <td class="p-2">${start + idx + 1}</td>
        <td class="p-2">
          <img src="${c.image}" alt="image client" class="w-10 h-10 rounded-full object-cover" />
        </td> 
        <td class="p-2">${c.getNomComplet()}</td>
        <td class="p-2">${c.telephone}</td>
        <td class="p-2">${c.email}</td>
        <td class="p-2 flex gap-2"></td>`;
      const cell = tr.lastElementChild;

      if (!c.isActive) {
        cell.innerHTML = `
          <button class="bg-amber-500 text-white px-2 py-1 rounded">Edit</button>
          <button class="bg-red-600 text-white px-2 py-1 rounded">Del</button>`;
        cell.children[0].onclick = () => this._form(c);
        cell.children[1].onclick = async () => {
          if (await confirm('Mettre à la corbeille ?')) {
            await this.clientSvc.trash(c.id_client);
            this.render();
          }
        };
      } else {
        const btn = document.createElement('button');
        btn.textContent = 'Restaurer';
        btn.className = 'bg-green-600 text-white px-2 py-1 rounded';
        btn.onclick = () => this.clientSvc.restore(c.id_client).then(() => this.render());
        cell.append(btn);
      }

      tbody.append(tr);
    });
  }
  /* ----------- DETAIL MODAL ----------- */
  _showDetail(article, categoryName) {
    const content = document.createElement('div');
    content.className = 'grid gap-4';
    content.innerHTML = `
      <div class="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        ${article.image 
          ? `<img src="${article.image}" alt="${article.nom}" class="object-cover h-full w-full rounded-lg">` 
          : '<span class="text-gray-500">Aucune image</span>'
        }
      </div>
      <div>
        <h3 class="font-bold text-xl">${article.nom}</h3>
        <p class="text-gray-600 mt-2">${article.description || 'Pas de description'}</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="font-bold">Catégorie</p>
          <p>${categoryName}</p>
        </div>
        <div>
          <p class="font-bold">Prix</p>
          <p>${article.prix.toFixed(2)} €</p>
        </div>
      </div>`;

    const modal = new Modal(`Détail: ${article.libelle}`, content);
    modal.open();
  }

  /* ----------- PAGINATION ----------- */
  _pager() {
    const n = Math.ceil(this.state.total / this.state.perPage);
    const pag = this.root.querySelector('#paginator');
    pag.innerHTML = '';

    for (let i = 1; i <= n; i++) {
      const b = document.createElement('button');
      b.textContent = i;
      b.className = `px-3 py-1 rounded ${
        i === this.state.page ? 'bg-indigo-600 text-white' : 'bg-gray-200'
      }`;
      b.onclick = () => { 
        this.state.page = i; 
        this.render(); 
      };
      pag.append(b);
    }
  }

  /* ----------- FORM MODAL ----------- */
  _form(user = new User()) {
    const f = document.createElement('form');
    f.className = 'grid gap-2';

    f.innerHTML = `
      <input name="prenom"     class="border px-2 py-1 rounded" placeholder="Prénom" value="${user.prenom}">
      <input name="nom"        class="border px-2 py-1 rounded" placeholder="Nom" value="${user.nom}">
      <input name="adresse"    class="border px-2 py-1 rounded" placeholder="Adresse" value="${user.adresse}">
      <input name="telephone"  class="border px-2 py-1 rounded" placeholder="Téléphone" value="${user.telephone}">
      <input name="email"      class="border px-2 py-1 rounded" placeholder="Email" value="${user.email}">
      <input name="password"   class="border px-2 py-1 rounded" placeholder="Mot de passe" value="${user.password}">
      <input name="image"  type="file"      class="border px-2 py-1 rounded" accept="image/*" required value="${user.image}">

      <div class="flex justify-end mt-4">
        <button class="bg-indigo-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </div>`;

    const dlg = new Modal(user.id ? 'Modifier User' : 'Nouveau User', f);
    dlg.open();

f.onsubmit = async (e) => {
  e.preventDefault();

  const file = f.image.files[0];
  let imageUrl = client.image;

  if (file) {
    try {
      imageUrl = await uploadImageToCloudinary(file);
      console.log('URL image Cloudinary :', imageUrl);
    } catch (err) {
      alert('Erreur upload image : ' + err.message);
      return;
    }
  }

  Object.assign(client, {
    nom:        f.nom.value.trim(),
    prenom:     f.prenom.value.trim(),
    adresse:    f.adresse.value.trim(),
    telephone:  f.telephone.value.trim(),
    email:      f.email.value.trim(),
    password:   f.password.value.trim(),
    image:      imageUrl, // URL Cloudinary
    role:    3
  });

  if (!client.isValid()) {
    alert('Champs invalides');
    return;
  }

  if (client.id_client) {
    await this.clientSvc.update(client);
  } else {
    const created = await this.clientSvc.create(client);
    client.id_client = created.id_client;
  }

  dlg.close();
  this.render();
};

  }
}