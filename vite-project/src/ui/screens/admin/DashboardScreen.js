import { UserService } from "../../../domain/users/user.service.js";
import { UserServices } from "../../../data/service/userService.js";
import { PatientService } from "../../../domain/patient/patient.service.js";
import { PatientServices } from "../../../data/service/PatientService.js";
import Chart from "chart.js/auto";

export default class DashboardScreen {
  constructor(root) {
    this.root = root;
    this.userSvc = new UserService(new UserServices());
    this.patientSvc = new PatientService(new PatientServices);
    this.state = {
      patients: [],
      stats: {}
    };
  }

  async render() {
    this.root.innerHTML = `
      <div class="bg-white p-6 rounded-2xl shadow-md">
        <h2 class="text-xl font-semibold mb-4">📊 Statistiques Patients</h2>
        <div id="stats-container" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-white p-4 rounded-xl shadow">
            <h3 class="mb-2 font-semibold">Répartition H/F</h3>
            <canvas id="patientsChart"></canvas>
          </div>
          <div class="bg-white p-4 rounded-xl shadow">
            <h3 class="mb-2 font-semibold">Actifs vs Inactifs</h3>
            <canvas id="bar-chart"></canvas>
          </div>
        </div>
      </div>
    `;

    await this._load();
    this._renderStats();
    this._renderCharts();
  }

  async _load() {
  this.state.stats = await this.patientSvc.stats();
  console.log(this.state.stats);
  
}

//   async _load() {
//     const { data } = await this.userSvc.list(1, 1000); // on charge tout
//     this.state.patients = data.filter(u => u.role === "patient");

//     // Calcul des stats simples
//     const total = this.state.patients.length;
//     const actifs = this.state.patients.filter(p => p.isActive).length;
//     const inactifs = total - actifs;

//     const hommes = this.state.patients.filter(p => p.sexe === "H").length;
//     const femmes = total - hommes;

//     this.state.stats = { total, actifs, inactifs, hommes, femmes };
//   }

  _renderStats() {
    const c = this.root.querySelector("#stats-container");
    const { totalPatients, sexeCount } = this.state.stats;

    c.innerHTML = `
      <div class="p-4 bg-indigo-50 rounded-lg text-center">
        <h3 class="text-lg font-bold">${totalPatients}</h3>
        <p class="text-gray-600">Patients total</p>
      </div>
      <div class="p-4 bg-red-50 rounded-lg text-center">
        <h3 class="text-lg font-bold">${sexeCount.femme}</h3>
        <p class="text-gray-600">Femmes</p>
      </div>
      <div class="p-4 bg-green-50 rounded-lg text-center">
        <h3 class="text-lg font-bold">${sexeCount.homme}</h3>
        <p class="text-gray-600">Hommes</p>
      </div>
    `;
  }

  _renderCharts() {
    const {totalPatients, sexeCount } = this.state.stats;
    console.log({ sexeCount });
    

    // Pie chart H/F
    const pieCtx = this.root.querySelector("#patientsChart").getContext("2d");
    new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["Hommes", "Femmes"],
        datasets: [{
          data: [sexeCount.homme, sexeCount.femme],
          backgroundColor: ["#4F46E5", "#EC4899"],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // Bar chart Actifs/Inactifs
    const barCtx = this.root.querySelector("#bar-chart").getContext("2d");
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Actifs", "Inactifs"],
        datasets: [{
          label: "Nombre de patients",
          data: [totalPatients],
          backgroundColor: ["#10B981", "#EF4444"]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision:0
          }
        }
      }
    });
  }
}

