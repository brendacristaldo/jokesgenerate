const { connectToDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  // Método para salvar o usuário no banco, já com senha criptografada
  async save() {
    const { db } = await connectToDatabase();
    
    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    const result = await db.collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      createdAt: this.createdAt,
    });
    
    return result;
  }

  // Método estático para encontrar um usuário pelo email
  static async findByEmail(email) {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: email });
    return user;
  }

  // Método para comparar a senha fornecida com a senha no banco
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

module.exports = User;