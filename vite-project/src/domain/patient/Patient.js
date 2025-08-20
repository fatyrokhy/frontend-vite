export class Patient {
  constructor({
    id = null,
    prenom = "",
    nom = "",
    adresse = "",
    sexe = "",          // "homme" ou "femme"
    email = "",
    telephone = "",
    dateNaissance = null,
    dateCreation = null
  }) {
    this.id = id;
    this.prenom = prenom.trim();
    this.nom = nom.trim();
    this.adresse = adresse.trim();
    this.sexe = sexe;
    this.email = email.trim();
    this.telephone = telephone.trim();
    this.dateNaissance = dateNaissance ? new Date(dateNaissance) : null;
    this.dateCreation = dateCreation ? new Date(dateCreation) : null;
  }

  // ✅ Validation simple
  isValid() {
    return (
      this.prenom.length > 0 &&
      this.nom.length > 0 &&
      this.sexe.length > 0 &&
      this.telephone.length > 0
    );
  }

  // ✅ Conversion vers DTO (Data Transfer Object)
  toDto() {
    return {
      id: this.id,
      prenom: this.prenom,
      nom: this.nom,
      adresse: this.adresse,
      sexe: this.sexe,
      email: this.email,
      telephone: this.telephone,
      dateNaissance: this.dateNaissance
        ? this.dateNaissance.toISOString().split("T")[0] // format YYYY-MM-DD
        : null,
      dateCreation: this.dateCreation
        ? this.dateCreation.toISOString()
        : null,
    };
  }

  // ✅ Conversion depuis DTO (backend → front)
  static fromDto(dto) {
    return new Patient(dto);
  }
}
