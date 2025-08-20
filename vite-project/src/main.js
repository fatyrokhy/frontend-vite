import './style.css';
import { guardRoute, startRouter } from './app/router.js';
import { renderHeader } from './ui/components/header.js';
import { sidebar } from './ui/components/sidebar.js';
import { ConnexionServices } from './data/service/connexionService.js';
import { getLoggedUser } from './utils/format/auth.js';

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

window.addEventListener('DOMContentLoaded', afficherMenusSelonRole);
window.addEventListener('hashchange', afficherMenusSelonRole);

//  Masquer/afficher les liens selon le rôle
function afficherMenusSelonRole() {

  const user = getLoggedUser();

  const menuAdmin = document.querySelectorAll('.admin');
  const menuMedcin = document.querySelectorAll('.medcin');
  const menuPersonnel = document.querySelectorAll('.personnel');

  // Masquer tous les menus d'abord
  menuAdmin.forEach(el => (el.style.display = 'none'));
  menuMedcin.forEach(el => (el.style.display = 'none'));
  menuPersonnel.forEach(el => (el.style.display = 'none'));

  if (!user) return;

  const role = user.role;

  if (role == "admin") {
    menuAdmin.forEach(el => (el.style.display = 'inline-block'));
  }

  if (role == "personnel") {
    menuPersonnel.forEach(el => (el.style.display = 'inline-block'));
  }

  if (role == "medecin") {
    menuMedcin.forEach(el => (el.style.display = 'inline-block'));
  }
}


window.addEventListener("hashchange", () => {
  guardRoute(window.location.hash);
});

// au premier chargement
guardRoute(window.location.hash || "#login");