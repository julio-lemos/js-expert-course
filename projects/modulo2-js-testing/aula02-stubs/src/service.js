/** Módulo nativo do node para requisições */
const https = require('https');

class Service {
  /** Realiza uma requisição */
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, response => {
        /** Caso nao envolva em um JSON.parse irá retornar um buffer */
        response.on('data', data => resolve(JSON.parse(data)));
        response.on('error', reject);
      });
    });
  }

  /** Retorna o objeto da requisição formatado */
  async getPlanets(url) {
    const result = await this.makeRequest(url);

    return {
      name: result.name,
      surfaceWater: result.surface_water,
      appearedIn: result.films.length,
    };
  }
}

module.exports = Service;
