import { Patient } from './Patient.js';

export class PatientService {
  constructor(service) {
    this.service = service; // service = instance de PatientServices (API)
  }

  /* ---------- LISTER ---------- */
  async list(page = 1, limit = 10) {
    return this.service.list(page, limit);
  }

  /* ---------- CREER ---------- */
  async create(patient) {
    if (!(patient instanceof Patient)) {
      patient = new Patient(patient);
    }
    if (!patient.isValid()) {
      throw new Error('Patient invalide');
    }
    return this.service.create(patient.toDto());
  }

  /* ---------- METTRE À JOUR ---------- */
  async update(patient) {
    if (!(patient instanceof Patient)) {
      patient = new Patient(patient);
    }
    if (!patient.id) {
      throw new Error('ID manquant pour la mise à jour');
    }
    if (!patient.isValid()) {
      throw new Error('Patient invalide');
    }
    return this.service.update(patient.toDto());
  }

  /* ---------- RECUPERER UN PATIENT ---------- */
  async get(id) {
    if (!id) throw new Error('ID manquant');
    const dto = await this.service.get(id);
    return new Patient(dto);
  }

  /* ---------- STATISTIQUES ---------- */
  async stats() {
    return this.service.stats(); // pas besoin de transformer
  }
}
