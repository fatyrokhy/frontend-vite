export class Specialite {
  constructor({
    id = null,
    libelle = "",
  }) {
    this.id = id;
    this.libelle = libelle.trim();
  }

  isValid() {
    return this.libelle.length > 0 
  }

  toDto() {
    return {
      id: this.id,
      libelle: this.libelle,
    };
  }

  static fromDto(dto) {
    return new Specialite(dto);
  }
}