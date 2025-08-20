import { ApiClient } from '../api-client.js';
import { Patient } from '../../domain/patient/Patient.js';

export class PatientServices {
  constructor(base = 'http://localhost:3000/') {
    this.api = new ApiClient(base);
  }

  /* ---------- READ (liste patients) ---------- */
  async list(page = 1, limit = 10) {
    const { data, headers } = await this.api.get('patient/liste', {
      _page: page,
      _limit: limit,
    });
    console.log("Liste patients:", data);
    return { data: data.map(Patient.fromDto), headers };
  }

  /* ---------- CREATE (ajout patient) ---------- */
  async create(p) {
    const patient = p instanceof Patient ? p : new Patient(p);
    const { id, ...body } = patient.toDto();

    // 🔑 On n'envoie pas id car généré côté backend
    delete body.id;

    return this.api.post('patient/create', body).then(Patient.fromDto);
  }

  /* ---------- GET STATS (statistiques patients) ---------- */
  async stats() {
    const { data } = await this.api.get('dashboardAdmin/statsPatient');
    console.log("Stats patients:", data);
    return data;
  }

  /* ---------- GET by ID (optionnel) ---------- */
  async get(id) {
    if (!id) throw new Error("id manquant pour get");
    const data = await this.api.get(`admin/patient/${id}`);
    return Patient.fromDto(data);
  }
}
