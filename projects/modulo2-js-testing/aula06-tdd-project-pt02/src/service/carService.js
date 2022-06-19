const BaseRepository = require('./../repository/base/baseRepository');

/** Repository responsável pela gestão dos carros */
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
  }

  /** Retorna um indice randomico em um determinado array */
  getRandomPositionFromArray(list) {
    const listLength = list.length;
    return Math.floor(Math.random() * listLength);
  }

  /** Retorna um Id de um carro na categoria enviada */
  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }

  /** Retorna o carro disponível da categoria enviada */
  async getAvailableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory);
    const car = await this.carRepository.find(carId);

    return car;
  }
}

module.exports = CarService;
