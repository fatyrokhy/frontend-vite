// * Mini-routeur hash avec support de paramètres
//  * routes: { 
//  *   '#categories': () => import('../ui/screens/CategoryScreen.js'),
//  *   '#articles': () => import('../ui/screens/ArticleScreen.js'),
//  *   '#articles/(\\w+)': () => import('../ui/screens/ArticleDetailScreen.js')
//  * }
//  */
export function startRouter(root, routes, fallback = '#categories') {
  async function load() {
    const hash = location.hash || fallback;
    let matchedRoute = null;
    let params = {};

    // Chercher si une route correspond
    for (const [pattern, loader] of Object.entries(routes)) {
      const regex = new RegExp(`^${pattern}$`);
      const match = hash.match(regex);
      if (match) {
        matchedRoute = loader;
        // Extraire les paramètres
        params = { id: match[1] };
        break;
      }
    }

    if (!matchedRoute) {
      // Essayer la fallback
      matchedRoute = routes[fallback];
      if (!matchedRoute) {
        root.textContent = '404';
        return;
      }
    }

    const mod = await matchedRoute?.();
    if (!mod) { root.textContent = '404'; return; }

    root.innerHTML = '';

    const Screen = mod.default;
    const screen = new Screen(root, params); // Passer les paramètres
    await screen.render();
    screen.setUpEventListeners?.();
  }

  window.addEventListener('hashchange', load);
  load();
}
// /**
//  * Mini-routeur hash.
//  * routes: { '#categories': () => import('../ui/screens/CategoryScreen.js') }
//  */
// export function startRouter(root, routes, fallback = '#categories') {
//   async function load() {
//     const hash = location.hash || fallback;
//     const mod  = await routes[hash]?.();
//     if (!mod) { root.textContent = '404'; return; }

//     root.innerHTML = '';                

//     const Screen = mod.default;
//     const screen = new Screen(root);    
//     await screen.render();              
//     screen.setUpEventListeners?.();    
//   }

//   window.addEventListener('hashchange', load);
//   load();
// }
// import { startRouter } from './app/router.js';

// const root = document.getElementById('app');

// startRouter(root, {
//   '#categories': () => import('./ui/screens/CategoryScreen.js'),
//   '#articles': () => import('./ui/screens/ArticleScreen.js'), // Nouvelle route
// }, '#categories');

