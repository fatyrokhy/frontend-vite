export function sidebar() {
    return`
    <!-- sidebar.html -->
<div class="sidebar w-64 fixed left-2 top-2 rounded-md p-4  bg-white/90 min-h-screen flex flex-col gap-12">
  <!-- Logo -->
  <div class="px-4 py-6 flex items-center gap-4">
          <img class="shadow-inner w-12 h-12 rounded-lg" src="../../../../public/images/NdimbalSanté .jpg" alt="" srcset="">
    <span class="text-xl font-semibold">Clinico</span>
  </div>

  <!-- Menu -->
  <nav class="flex-1 px-4 space-y-6">
    <div class="admin">
      <a href="#dashboardAdmin" class="flex items-center gap-4 text-gray-700 hover:text-blue-600">
        <i class="ri-dashboard-line text-lg"></i>
        <span>Dashboard</span>
      </a>
    </div>
    <div class="admin">
      <a href="#user" class="flex items-center gap-4 text-gray-700 hover:text-blue-600">
      <i class="ri-list-view text-lg"></i>
        <span>Utilisateurs</span>
      </a>
    </div>
    <div class="personnel">
      <a href="#dasboardPersonnel" class="flex items-center gap-4 text-gray-700 hover:text-blue-600">
        <i class="ri-dashboard-line text-lg"></i>
        <span>Dashboard</span>
      </a>
    </div>
    <div class="medcin">
      <a href="#medcin" class="flex items-center gap-4 text-gray-700 hover:text-blue-600">
      <i class="ri-list-view text-lg"></i>
        <span>Mes Rendez-vous</span>
      </a>
    </div>
    <div class="medcin">
      <a href="#mesPresciptions" class="flex items-center gap-4 text-gray-700 hover:text-blue-600">
      <i class="ri-list-view text-lg"></i>
        <span>Mes prescriptions</span>
      </a>
    </div>
  </nav>

  <!-- Account section -->
  <div class="px-4 py-2 border-t">
    <a href="#" class="flex items-center gap-3 text-red-600 mt-3" id="logout">
        <i class="ri-logout-box-line"></i> 
        <span> Logout </span>
    </a>
  </div>

  <div class="mt-auto p-4 bg-blue-50 text-sm text-blue-700">
    <p class="font-bold">Emergency Hotlines:</p>
    <p>+234 91 828 2039</p>
    <p>+234 90 623 2038</p>
  </div>
</div>
`
}