import { ConnexionServices } from "../../data/service/connexionService";
import { getLoggedUser } from "../../utils/format/auth";

export default class ConnexionScreen {
  constructor(root) {
    this.root = root;
    this.connexionServices = new ConnexionServices();
  }


  /* ----------- RENDER ----------- */
  async render() {
    this.root.innerHTML = `
  <div class="relative w-full max-w-md">
    <div class="absolute -top-32 -right-20 h-80 w-80 rounded-full blur-3xl bg-[#233977]/20"></div>
    <div class="absolute -bottom-32 -left-20 h-80 w-80 rounded-full blur-3xl bg-[#88bce7]/40"></div>

    <div class="relative backdrop-blur-xl w-96 bg-white/70 shadow-2xl rounded-2xl border border-white/40 p-8">
          <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-12 rounded-xl ">
          <img class="shadow-inner rounded-lg" src="../../../../public/images/NdimbalSanté.jpg" alt="" srcset="">
        </div>
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-gray-900">Connexion</h1>
          <p class="text-sm text-gray-600">Heureux de vous revoir 👋</p>
        </div>
      </div>

      <!-- Formulaire -->
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-800">Email</label>
          <div class="relative">
            <input type="email" id="email" name="email" required placeholder="vous@exemple.com"
              class="w-full pl-3 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-800">Mot de passe</label>
          <div class="relative">
            <input type="password"  id="pass" name="password" required placeholder="••••••••"
              class="w-full pl-3 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300">
          </div>
          <div class="flex items-center justify-between mt-2 text-sm">
            <label class="flex items-center gap-2 text-gray-600">
              <input type="checkbox" class="rounded border-gray-300"> Se souvenir de moi
            </label>
            <a href="#" class="text-rose-600 hover:underline">Mot de passe oublié ?</a>
          </div>
        </div>

        <div id="errorMsg" class="hidden text-sm p-2 rounded-lg bg-rose-100 border border-rose-200 text-rose-700">
          Identifiants incorrects.
        </div>

        <!-- Bouton -->
        <button type="submit"
          class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#88bce7] to-[#233977] text-white font-medium shadow-lg hover:opacity-90">
          Se connecter
        </button>
      </form>
    </div>
      `;
    this.setUpEventListeners();

    this.setUpEventListeners();
  }

    

  setUpEventListeners() {
    const form=this.root.querySelector("#loginForm");
    if (!form) {
       return; 
    }

    form.onsubmit = async (e)=>{
        
        e.preventDefault();
        const formData = new FormData(form);
        const mail=formData.get("email");
        const pass=formData.get("password");

        try {

            const users = await this.connexionServices.login(mail,pass);
            console.log(users);

            if (users !=null) {
             
              const user= getLoggedUser();

            switch (user.role) {
              case "admin":
                  window.location.hash = '#dashboardAdmin';
                  break;
                case "personnel":
                    window.location.hash = '#dashboardPersonnel';
                    break;
                case "medecin":
                    window.location.hash = '#medcin';
                    break;
                default:
                    alert("Rôle inconnu ou non autorisé.")
                    break;
            }
          }
            
        } catch (error) {
               console.error("Erreur de connexion :", error);
                alert("Une erreur est survenue."); 
        }

        console.log(mail);
        console.log(pass);
    }
        
  }

}
