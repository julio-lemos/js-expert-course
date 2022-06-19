const Base = require('./base/base');

/** Classe referente a categoria do carro */
class CarCategory extends Base {
  constructor({ id, name, carIds, price }) {
    super({ id, name });

    this.carIds = carIds;
    this.price = price;
  }
}

module.exports = CarCategory;
