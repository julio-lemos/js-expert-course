const { readFile } = require('fs/promises');

/** Repositório base que será herdado pelos demais repositórios */
class BaseRepository {
  constructor({ file }) {
    this.file = file;
  }

  /** Retorna um dado do database
   * @param itemId Id único do item a ser buscado
   */
  async find(itemId) {
    /** Lê o conteudo do arquivo enviado via construtor */
    const content = JSON.parse(await readFile(this.file));

    /** Caso nenhum id seja enviado irá retornar todo o conteúdo */
    if (!itemId) return content;

    /** Busca pelo id e retorna o dado */
    return content.find(({ id }) => id === itemId);
  }
}

module.exports = BaseRepository;
