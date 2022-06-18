/** Engine de testes */
const { describe, it } = require('mocha');

/** Aqui serve para realizar uma requisição e validar o teste */
const request = require('supertest');

const app = require('./api');
const assert = require('assert');

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async () => {
      const response = await request(app).get('/contact').expect(200);

      assert.deepStrictEqual(response.text, 'contact us page');
    });
  });

  describe('/hello', () => {
    it('request an inexistent route /hi and redirect to /hello', async () => {
      const response = await request(app).get('/hi').expect(200);

      assert.deepStrictEqual(response.text, 'Hello World!');
    });
  });

  describe('/login', () => {
    it('should login successfully on the login route and return HTTP Status', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Julio Lemos', password: '123' })
        .expect(200);

      assert.deepStrictEqual(response.text, 'Logging has succeeded!');
    });

    it('should unauthorize a request when rquesting it using wrong credentials and return HTTP Status 401', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Xuxa', password: '122' })
        .expect(401);

      assert.deepStrictEqual(response.text, 'Unauthorized');
      assert.ok(response.unauthorized);
    });
  });
});
