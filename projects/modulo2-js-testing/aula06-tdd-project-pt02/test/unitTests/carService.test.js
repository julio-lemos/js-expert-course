const sinon = require('sinon');
const { join } = require('path');
const { expect } = require('chai');
const { describe, it, before, beforeEach, afterEach } = require('mocha');

/** Importa CarService */
const CarService = require('./../../src/service/carService');

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
});
