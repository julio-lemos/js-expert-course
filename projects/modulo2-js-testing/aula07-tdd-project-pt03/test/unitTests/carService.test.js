const sinon = require('sinon');
const { join } = require('path');
const { expect } = require('chai');
const { describe, it, before, beforeEach, afterEach } = require('mocha');

const CarService = require('./../../src/service/carService');
const Transaction = require('./../../src/entities/transaction');

/** Guarda na variável carsDatabase o caminho para leitura do arquivo */
const carsDatabase = join(__dirname, './../../database', 'cars.json');

/** Define mocks para seus respectivos arquivos */
const mocks = {
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCar: require('./../mocks/valid-car.json'),
  validCustomer: require('./../mocks/valid-customer.json'),
};

describe('CarService Suite Tests', () => {
  let carService = {};
  let sandbox = {};

  /** Cria uma nova instancia de car service e envia para ele via construtor
   * o caminho para o database de carros
   */
  before(() => {
    carService = new CarService({ cars: carsDatabase });
  });

  /** Cria uma sandbox do sinon antes de cada teste */
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  /** Reinicia a sandbox no fim de cada teste */
  afterEach(() => {
    sandbox.restore();
  });

  it('should retrieve a random position from an array', () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);

    /** Espera receber um numero menor ou igual ao data.length
     * e maior ou igual a 0
     */
    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it('should choose the first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    /** Cria um stub da funcao getRandomPositionFromArray para evitar buscas randomicas no database */
    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex);

    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    /** Verifica se a funcao getRandomPositionFromArray foi chamada pelo menos uma vez */
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    /** Verifica se o resultado é igual ao esperado */
    expect(result).to.be.equal(expected);
  });

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    /** Stub da função find do carRepository para retornar nosso carro mockado */
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    /** Cria spy sobre funcao chooseRandomCar */
    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    /** verifica se chooseRandomCar foi chamada pelo menos uma vez */
    expect(carService.chooseRandomCar.calledOnce).to.be.ok;

    /** Verifica se a funcao find foi chamada exatamente com o car.id */
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;

    /** Verifica se o resultado é igual ao experado */
    expect(result).to.be.deep.equal(expected);
  });

  it('given a carCategory, customer and numberOfDays it should calculate final amount in real', () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    /**
     * age: 50 | tax: 1.3 | categoryPrice: 37.6
     * 37.6 * 1.3 = 48,88 * 5 = 244,40
     */

    /** Stub do get taxesBasedOnAge pois aqui estamos testando o comportamento da funcao,
     * e não a regra de negocio caso as taxas mudem
     */
    sandbox
      .stub(carService, 'taxesBasedOnAge')
      .get(() => [{ from: 40, to: 50, then: 1.3 }]);

    const expected = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays,
    );

    /** Verifica se o valor final é retornado no formato pt-br como solicitado no story */
    expect(result).to.be.deep.equal(expected);
  });

  it('given a customer and a car category it should return a transaction receipt', async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    };

    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;

    const numberOfDays = 5;
    const dueDate = '10 de novembro de 2020';

    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());

    /** Stub da funcao find para evitar conexao com o banco de dados */
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    const expectedAmount = carService.currencyFormat.format(206.8);
    const result = await carService.rent(customer, carCategory, numberOfDays);

    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).to.be.deep.equal(expected);
  });
});
