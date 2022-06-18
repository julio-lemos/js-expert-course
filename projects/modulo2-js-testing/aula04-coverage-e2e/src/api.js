/** Módulo nativo do node para criação de servers */
const http = require('http');

/** Mock de um usuário criado para didática */
const DEFAULT_USER = { username: 'Julio Lemos', password: '123' };

/** Rotas definidas */
const routes = {
  '/contact:get': (request, response) => {
    response.write('contact us page');
    return response.end();
  },

  '/login:post': async (request, response) => {
    /** Response é um Iterator! */
    for await (const data of request) {
      const user = JSON.parse(data);
      if (
        user.username !== DEFAULT_USER.username ||
        user.password !== DEFAULT_USER.password
      ) {
        response.writeHead(401);
        response.write('Unauthorized');
        return response.end();
      }

      response.write('Logging has succeeded!');
      return response.end();
    }
  },

  default: (request, response) => {
    response.write('Hello World!');
    return response.end();
  },
};

/** Função auxiliar para construção da API */
const handler = function (request, response) {
  const { url, method } = request;
  const routeKey = `${url}:${method.toLowerCase()}`;

  /** Verifica se a rota definida existe, caso nao define a rota default */
  const chosen = routes[routeKey] || routes.default;
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });

  return chosen(request, response);
};

/** Cria o server na porta 3000 */
const app = http
  .createServer(handler)
  .listen(3000, () => console.log('app running at', 3000));

module.exports = app;
