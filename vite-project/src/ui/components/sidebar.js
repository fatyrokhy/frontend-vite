export function sidebar() {
    return`
    <!-- sidebar.html -->
<div class="sidebar w-64 fixed left-2 top-2 rounded-md p-4  bg-white/90 min-h-screen flex flex-col">
  <!-- Logo -->
  <div class="p-6 flex items-center gap-2">
          <img class="shadow-inner w-8 h-8 rounded-lg" src="../../../../public/images/NdimbalSanté.jpg" alt="" srcset="">
    <span class="text-xl font-semibold">IwoSan</span>
  </div>

  <!-- Menu -->
  <nav class="flex-1 px-4 space-y-4">
    <div>
      <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
        <span>🏠</span>
        Overview
      </a>
    </div>
    <div>
      <a href="#user" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
        <span>📅</span>
        Utilisateurs
      </a>
    </div>
    <div>
      <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
        <span>👨‍⚕️</span>
        Doctors
      </a>
    </div>
    <div>
      <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
        <span>🧪</span>
        Pathology Results
      </a>
    </div>
    <div>
      <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
        <span>💬</span>
        Chats
        <span class="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">10</span>
      </a>
    </div>
  </nav>

  <!-- Account section -->
  <div class="px-4 py-2 border-t">
    <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-blue-600">
      <span>⚙️</span>
      Settings
    </a>
    <a href="#" class="flex items-center gap-3 text-red-600 mt-3" id="logout">
      <span>🚪</span>
      Logout
    </a>
  </div>

  <!-- Emergency contact -->
  <div class="mt-auto p-4 bg-blue-50 text-sm text-blue-700">
    <p class="font-bold">Emergency Hotlines:</p>
    <p>+234 91 828 2039</p>
    <p>+234 90 623 2038</p>
  </div>
</div>
`
}