/** Lib para gerar dados randomicos */
const faker = require('faker');

const Car = require('./../src/entities/car');
const Customer = require('./../src/entities/customer');
const CarCategory = require('./../src/entities/carCategory');

const { join } = require('path');
const { writeFile } = require('fs/promises');

const seederBaseFolder = join(__dirname, '../', 'database');
const ITEMS_AMOUNT = 2;

/** Instancia o CarCategory */
const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
});

/** Inicializa um array vazio de carros e de customers */
const cars = [];
const customers = [];

for (let index = 0; index <= ITEMS_AMOUNT; index++) {
  /** Cria uma instancia de Car */
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear(),
  });

  /** Adiciona o id do carro na lista de carIds do CarCategory */
  carCategory.carIds.push(car.id);

  /** Adiciona carro no array de carros */
  cars.push(car);

  /** Cria instancia de Customer */
  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({ min: 18, max: 50 }),
  });

  /** Adiciona instancia no array */
  customers.push(customer);
}

/** Cria um arquivo na pasta database */
const write = async (filename, data) =>
  writeFile(join(seederBaseFolder, filename), JSON.stringify(data));

/** Closure responsável por gerar dados aleatórios na pasta database */
(async () => {
  await write('cars.json', cars);
  await write('customer.json', customers);
  await write('carCategories.json', [carCategory]);

  console.log('cars', cars);
  console.log('carCategory', carCategory);
})();
