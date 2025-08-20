
export default class RvScreen {
  constructor(root) {
    this.root = root;
    // this.connexionServices = new ConnexionServices();
  }


  /* ----------- RENDER ----------- */
  async render() {
    this.root.innerHTML = `
  <div class="relative w-full max-w-md text-blue-700">
        Bienvenue docteur
    </div>
      `;
    return this;
  }}
