
export default class DashboardScreen {
  constructor(root) {
    this.root = root;
    // this.connexionServices = new ConnexionServices();
  }


  /* ----------- RENDER ----------- */
  async render() {
    this.root.innerHTML = `
  <div class="relative w-full max-w-md bg-amber-900 text-amber-50">
        Bienvenue M. l'admin
    </div>
  <button type="button id="logout" class="p-2.5 rounded-2xl max-w-md bg-amber-900 text-amber-50">
        Déconnexion
    </button>
      `;
    this.setUpEventListeners();

    this.setUpEventListeners();
// ré-attache après chaque render
    // return this;
    
  }}
