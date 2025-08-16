export class User {
  constructor({
    id = null,
    nom = "",
    prenom = "",
    adresse = "",
    telephone = "",
    image = "",
    email = "",
    password = "",
    specialiteId = null,
    role = "",
    isActive = true,
  }) {
    this.id = id;
    this.nom = nom.trim();
    this.prenom = prenom.trim();
    this.adresse = adresse.trim();
    this.telephone = telephone.trim();
    this.image = image.trim();
    this.email = email.trim();
    this.password = password.trim();
    this.specialiteId = specialiteId;
    this.role = role;
    this.isActive = !!isActive;
  }

  isValid() {
    return (
      this.nom.length > 0 &&
      this.prenom.length > 0 &&
      this.email.length > 0 &&
      this.telephone.length > 0
    );
  }

  toDto() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      adresse: this.adresse,
      telephone: this.telephone,
      image: this.image,
      email: this.email,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
    };
  }

  static fromDto(dto) {
    return new User(dto);
  }


estPersonnel() {
  return this.role == "personnel";
}

estAdmin() {
  return this.role == "admin";
}

estMedcin() {
  return this.role == "medecin";
}

  getNomComplet() {
    return `${this.prenom} ${this.nom}`;
  }
}
