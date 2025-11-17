const User = require('./models/User');

async function createTestUser() {
  console.log('Iniciando criação de usuário de teste...');
  
  try {
    // Defino credenciais padrão para facilitar nossos testes manuais
    const testEmail = 'admin@admin.com';
    const testPassword = 'admin123';

    // Antes de criar, verifico se já existe para evitar duplicidade
    const existingUser = await User.findByEmail(testEmail);
    if (existingUser) {
      console.log('Usuário de teste já existe.');
      process.exit(0); // Encerra o script com sucesso
      return;
    }

    // Crio a instância e salvo. A criptografia da senha acontece dentro do método .save() do Model
    const newUser = new User(testEmail, testPassword);
    await newUser.save();
    
    console.log('Usuário de teste criado com sucesso!');
    console.log(`Email: ${testEmail}`);
    console.log(`Senha: ${testPassword}`);

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  } finally {
    // Forço o encerramento do processo Node.js, senão o script ficaria rodando eternamente
    // por causa da conexão aberta com o banco.
    process.exit(0); 
  }
}

createTestUser();