export function renderHeader() {
  return `
<div class="header fixed top-2 left-68 right-2 z-50 flex items-center justify-between px-6 py-3 bg-white/90 rounded-md">
  <!-- Search bar -->
  <div class="flex items-center gap-3">
    <input type="text" placeholder="Search pathology results..."
      class="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-72">
  </div>

  <!-- Right side -->
  <div class="flex items-center gap-6">
    <!-- Dark mode toggle -->
    <div class="flex items-center gap-2">
      <span>☀️</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer">
        <div
          class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all">
        </div>
      </label>
      <span>🌙</span>
    </div>

    <!-- Profile -->
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="font-medium">Ola Boluwatife</p>
        <p class="text-xs text-blue-500 font-semibold">PATIENT</p>
      </div>
      <img src="avatar.png" alt="Profile" class="w-10 h-10 rounded-full border">
    </div>
  </div>
</div>
  `;
}

/* <header class="bg-gray-100 text-gray-800 shadow-md flex justify-between items-center px-8 py-3 fixed top-0 w-full z-50">
  <div class="flex items-center gap-3">
    <img src="./assets/images/téléchargement (3).jpg" class="w-12 h-12 rounded-full object-cover" alt="logo">
    <h1 class="text-xl font-semibold">Ma Boutique</h1>
  </div>
  
  <nav id="mainMenu" class="flex gap-6 items-center  text-sm font-medium">
    <a href="#categories" class=" text-lg menu-boutiquier  hover:text-green-600 transition">Catégories</a>
    <a href="#articles" class="menu-boutiquier hover:text-green-600 transition">Articles</a>
    <a href="#boutiquier" class="menu-admin hover:text-green-600 transition">Boutiquiers</a>
    <a href="#client" class="menu-boutiquier hover:text-green-600 transition">Clients</a>
    <button id="logout" class="bg-red-100 text-red-500 hover:bg-red-200 px-3 py-1 rounded transition">Se déconnecter</button>
  </nav>
</header>
 */
