/** Classe base que será herdada pelas demais entidades */
class Base {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}

module.exports = Base;
