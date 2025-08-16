import './style.css';
import { startRouter } from './app/router.js';
import { renderHeader } from './ui/components/header.js';
import { sidebar } from './ui/components/sidebar.js';
import { ConnexionServices } from './data/service/connexionService.js';

const root = document.getElementById('app');
startRouter(root, {
  '#login': () => import('./ui/screens/ConnexionScreen.js'),
  '#dashboardAdmin': () => import('./ui/screens/admin/DashboardScreen.js'),
  '#user': () => import('./ui/screens/admin/UserScreen.js'),
  '#dashboardPersonnel': () => import('./ui/screens/personnel/DashboardScreen.js'),
  '#medcin': () => import('./ui/screens/medcin/RvScreen.js')
  // '#articles': () => import('./ui/screens/ArticleScreen.js'),
  // '#articles/(\\w+)': () => import('./ui/screens/ArticleDetailScreen.js') ,// Nouvelle route
}, '#login');


const connexionServices = new ConnexionServices;

window.addEventListener('hashchange', renderLayoutIfNeeded);
renderLayoutIfNeeded();

// Appel de la protection au chargement et au changement de hash
// window.addEventListener('load', protectRoutes);
// window.addEventListener('hashchange', protectRoutes);

document.addEventListener('click', (e) => {
    if (e.target.closest('#logout')) {
        connexionServices.logout();
        history.replaceState(null, null, '#login'); // Bloquer retour après logout
    }
});

function renderLayoutIfNeeded() {
    // Supprimer l'ancien layout
    document.querySelector('.sidebar')?.remove();
    document.querySelector('.header')?.remove();

    // Ajouter si ce n'est pas la page login
    if (location.hash && location.hash !== '#login') {
        document.body.insertAdjacentHTML("afterbegin", renderHeader());
        document.body.insertAdjacentHTML("afterbegin", sidebar());
    }
}

// function protectRoutes() {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const currentHash = window.location.hash || '#login';

//     if (!user) {
//         // Si pas connecté, bloquer toutes les pages sauf login
//         if (!routes.public.includes(currentHash)) {
//             window.location.hash = '#login';
//         }
//     } else {
//         // Bloquer retour vers login si déjà connecté
//         if (currentHash === '#login') {
//             const role = user.role; // Assure-toi que 'role' est dans l'objet user
//             window.location.hash = routes[role][0]; // Redirige vers page principale du rôle
//         }

//         // Bloquer accès aux pages des autres rôles
//         const allowedPages = routes[user.role];
//         if (!allowedPages.includes(currentHash) && !routes.public.includes(currentHash)) {
//             window.location.hash = allowedPages[0]; // Redirige vers page principale du rôle
//         }
//     }
// }
// 🔁Quand on charge la page ou qu'on change de hash
// window.addEventListener('DOMContentLoaded', afficherMenusSelonRole);
// window.addEventListener('hashchange', afficherMenusSelonRole);

//  Gestion du bouton logout
// const btnLogout = document.querySelector('#logout');
// if (btnLogout) {
//   btnLogout.addEventListener('click', () => {
//     connexionServices.logout();
//   });
// }

//  Masquer/afficher les liens selon le rôle
// function afficherMenusSelonRole() {
//   const user = JSON.parse(localStorage.getItem('user'));


  // const menuAdmin = document.querySelectorAll('.menu-admin');
  // const menuMedcin = document.querySelectorAll('.menu-medcin');
  // const menuPersonnel = document.querySelectorAll('.menu-personnel');

//   // Masquer tous les menus d'abord
//   menuAdmin.forEach(el => (el.style.display = 'none'));
//   menuBoutiquier.forEach(el => (el.style.display = 'none'));

//   if (!user) return;

//   const role = user.id_role;

//   if (role == 1) {
//     menuAdmin.forEach(el => (el.style.display = 'inline-block'));
//   }

//   if (role == 2) {
//     menuBoutiquier.forEach(el => (el.style.display = 'inline-block'));
//   }
// }