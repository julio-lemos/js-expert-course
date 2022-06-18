const Service = require('./service');

/** Lib para realização de stubs */
const sinon = require('sinon');

/** Módulo nativo do node para asserts */
const { deepStrictEqual } = require('assert');

const BASE_URL_1 = 'https://swapi.dev/api/planets/1/';
const BASE_URL_2 = 'https://swapi.dev/api/planets/2/';

/** Mocks das requisições */
const mocks = {
  tatooine: require('./mocks/tatooine.json'),
  alderaan: require('./mocks/alderaan.json'),
};

(async () => {
  // {
  //   /** Este teste comentado realiza uma requisição HTTP (O que é errado) */
  //   const service = new Service()
  //   const withoutStub = await service.makeRequest(BASE_URL_2)
  //   console.log(JSON.stringify(withoutStub))
  // }
  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  /** Sempre que o serviço for chamado com estes argumentos ele irá devolver o
   * resolve de uma promise com o mock tatooine
   */
  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine);

  /** Sempre que o serviço for chamado com estes argumentos ele irá devolver o
   * resolve de uma promise com o mock alderaan
   */
  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan);

  {
    const expected = {
      name: 'Tatooine',
      surfaceWater: '1',
      appearedIn: 5,
    };
    const results = await service.getPlanets(BASE_URL_1);
    deepStrictEqual(results, expected);
  }
  {
    const expected = {
      name: 'Alderaan',
      surfaceWater: '40',
      appearedIn: 2,
    };
    const results = await service.getPlanets(BASE_URL_2);
    console.log('results', results);
    deepStrictEqual(results, expected);
  }
})();
