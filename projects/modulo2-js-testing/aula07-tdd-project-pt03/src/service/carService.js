const BaseRepository = require('./../repository/base/baseRepository');
const Tax = require('./../entities/tax');
const Transaction = require('./../entities/transaction');

/** Repository responsável pela gestão dos carros */
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
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

  /** Calcula o preço final e retorna o valor formatado para moeda brasileira */
  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge.find(
      tax => age >= tax.from && age <= tax.to,
    );

    const finalPrice = tax * price * numberOfDays;
    const formattedPrice = this.currencyFormat.format(finalPrice);

    return formattedPrice;
  }

  /** Busca as informações e retorna uma transação com os requerimentos solicitados */
  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = await this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays,
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const dueDate = today.toLocaleDateString('pt-br', options);

    const transaction = new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice,
    });

    return transaction;
  }
}

module.exports = CarService;
