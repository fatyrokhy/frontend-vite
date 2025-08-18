import { getLoggedUser } from "../../utils/format/auth";

export function renderHeader() {
  const u =getLoggedUser();
  console.log(u);
  
  return `
<div class="header fixed top-2 left-68 right-2 z-50 flex items-center justify-between px-6 py-3 bg-white/90 rounded-md">
  <!-- Search bar -->
  <div class="flex items-center gap-3">
    <input type="text" id="search" placeholder="Search......"
      class="px-4 py-2 border rounded-lg focus:outline-none focus:border-[#233977] w-72">
  </div>

  <div class="flex items-center gap-6">
    <!-- Dark mode toggle -->
    <div class="flex items-center gap-2">
      <i class="ri-sun-line text-xl text-amber-500"></i>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer">
        <div
          class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all">
        </div>
      </label>
      <i class="ri-moon-line text-lg text-[#233977]"></i>
    </div>

    <!-- Profile -->
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="font-medium">${u ? u.prenom + " " + u.nom : "Invité"}</p>
        <p class="text-xs text-[#233977] font-semibold">${u ? u.role : ""}</p>
      </div>
      <img src="${u ? u.image :
         "https://www.google.com/imgres?q=image%20avatar%20noir&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffw800%2Fbackground%2F20220707%2Fpngtree-cheerful-black-male-character-in-3d-animated-cartoon-avatar-photo-image_47493022.jpg&imgrefurl=https%3A%2F%2Ffr.pngtree.com%2Ffreebackground%2Fcheerful-black-male-character-in-3d-animated-cartoon-avatar-photo_14130242.html&docid=Z7Eu4OOwpqkNSM&tbnid=1wTL96wvsoMDXM&vet=12ahUKEwjwu-mV05SPAxXgUaQEHT_MG_0QM3oECCEQAA..i&w=640&h=640&hcb=2&ved=2ahUKEwjwu-mV05SPAxXgUaQEHT_MG_0QM3oECCEQAA"}" 
      alt="Profile" class="w-10 h-10 rounded-full border">
    </div>
  </div>
</div>
  `;
}

