const { readFile } = require('fs/promises');
const User = require('./user');
const { error } = require('./constants');

/** Opçoes padroes */
const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age'],
};

/** Classe responsável por gestao de arquivos */
class File {
  /** Converte um csv para um Json */
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);

    if (!validation.valid) throw new Error(validation.error);

    const users = File.parseCSVToJson(content);
    return users;
  }

  /** Retorna o conteúdo de um arquivo recebido pelo path */
  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString('utf-8');
  }

  /** Verifica se o arquivo cumpre os requisitos */
  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split('\n');
    const isHeaderValid = header === options.fields.join(',');

    /** Caso cabeçalho esteja invalido */
    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    /** Caso o conteúdo nao cumpra os requisitos */
    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }

  /** Converte a string referente ao CSV para um JSON */
  static parseCSVToJson(csvString) {
    /** Transforma a string recebida em um array
     *
     * Ex.:
     * csvString =  'id,name,profession,age\n' +
     * '123,Julio Lemos,Developer,26
     *
     * lines = [
     *  'id,name,profession,age',
     *  '123,Julio Lemos,Developer,26'
     * ]
     */
    const lines = csvString.split('\n');

    /** Remove a primeira linha do array e atribui a variável
     *
     * Ex.:
     * firstLine = 'id,name,profession,age'
     * lines = '123,Julio Lemos,Developer,26'
     */
    const firstLine = lines.shift();

    /** Transforma o cabeçalho em um array separado por virgula
     *
     * Ex.:
     * header = ['id','name','profession','age']
     */
    const header = firstLine.split(',');

    /** Realiza um map nas linhas */
    const users = lines.map(line => {
      /** Separa os dados da coluna em um array separado por virgula
       *
       * Ex.:
       * colums = ['123','Julio Lemos','Developer','26']
       */
      const columns = line.split(',');

      /** Cria um objeto vazio referente a user */
      let user = {};

      /** Realiza um for baseado nas colunas */
      for (const index in columns) {
        /**
         * Ex.:
         * index = 0
         * user[header[index]] = 'id'
         * columns[index] = '123'
         *
         * user = {
         *  'id': '123'
         * }
         */
        user[header[index]] = columns[index];
      }

      return new User(user);
    });
    return users;
  }
}

module.exports = File;
