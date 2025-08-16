
export default class DashboardScreen {
  constructor(root) {
    this.root = root;
    // this.connexionServices = new ConnexionServices();
  }


  /* ----------- RENDER ----------- */
  async render() {
    this.root.innerHTML = `
  <div class=" w-full max-w-md text-amber-900 bg-white/90">
        Bienvenue personnel
    </div>
      `;
    this.setUpEventListeners();

    this.setUpEventListeners();
// ré-attache après chaque render
    // return this;
    
  }}
