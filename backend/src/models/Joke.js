const { connectToDatabase } = require('../config/database');

class Joke {
  // O construtor reflete os campos da piada (tipo, piada, etc.)
  // Adicionamos 'userId' para saber quem cadastrou
  constructor(type, setup, delivery, joke, category, userId) {
    this.type = type; // 'single' ou 'twopart'
    this.category = category;
    this.userId = userId; // ID do usuário logado
    this.createdAt = new Date();
    
    // Define os campos baseado no tipo
    if (type === 'single') {
      this.joke = joke;
    } else {
      this.setup = setup;
      this.delivery = delivery;
    }
  }

  // Método para salvar a piada no banco
  async save() {
    const { db } = await connectToDatabase();
    
    // Constrói o objeto da piada para inserir
    const jokeDocument = {
      type: this.type,
      category: this.category,
      userId: this.userId, // Referência ao usuário
      createdAt: this.createdAt,
    };
    
    if (this.type === 'single') {
      jokeDocument.joke = this.joke;
    } else {
      jokeDocument.setup = this.setup;
      jokeDocument.delivery = this.delivery;
    }

    const result = await db.collection('jokes').insertOne(jokeDocument);
    return result;
  }

  // Método estático para buscar piadas
  static async find(query = {}) {
    const { db } = await connectToDatabase();
    // O .toArray() executa a busca e retorna os documentos
    const jokes = await db.collection('jokes').find(query).toArray();
    return jokes;
  }
}

module.exports = Joke;