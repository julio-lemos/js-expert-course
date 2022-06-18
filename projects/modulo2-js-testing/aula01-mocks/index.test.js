const { error } = require('./src/constants');
const File = require('./src/file');
const { rejects, deepStrictEqual } = require('assert');
/** Closure - Funçao que se auto executa */
(async () => {
  /** Testa se de fato ocorre um erro ao receber um arquivo vazio */
  {
    const filePath = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    /** Espera que a rejeição esperada seja igual a [rejection] */
    await rejects(result, rejection);
  }
  /** Testa se de fato ocorre um erro ao receber um arquivo invalido */
  {
    const filePath = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    /** Espera que a rejeição esperada seja igual a [rejection] */
    await rejects(result, rejection);
  }
  /** Testa se o mock definido é igual ao retorno de nossa função */
  {
    const filePath = './mocks/threeItems-valid.csv';
    const result = await File.csvToJson(filePath);

    const expected = [
      {
        name: 'Julio Lemos',
        id: 123,
        profession: 'Developer',
        birthday: 1996,
      },
      {
        name: 'Xuxa da Silva',
        id: 321,
        profession: 'Analist',
        birthday: 1942,
      },
      {
        name: 'Joaozinho',
        id: 231,
        profession: 'Java Developer',
        birthday: 1992,
      },
    ];

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();

/**
 * Anotações
 *
 * O [rejects] espera o retorno de uma promise rejeitada
 * O [deepStrictEqual] verifica o valor e também a referencia
 */
