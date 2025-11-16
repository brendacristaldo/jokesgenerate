const User = require('./models/User');

async function createTestUser() {
  console.log('Iniciando criação de usuário de teste...');
  
  try {
    // Você pode trocar este email e senha
    const testEmail = 'admin@admin.com';
    const testPassword = 'admin123';

    // Verifica se o usuário já existe
    const existingUser = await User.findByEmail(testEmail);
    if (existingUser) {
      console.log('Usuário de teste já existe.');
      process.exit(0);
      return;
    }

    // Cria e salva o novo usuário
    const newUser = new User(testEmail, testPassword);
    await newUser.save();
    
    console.log('Usuário de teste criado com sucesso!');
    console.log(`Email: ${testEmail}`);
    console.log(`Senha: ${testPassword}`);

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  } finally {
    // Importante: precisamos de uma forma de fechar a conexão,
    // mas por enquanto o script vai "travar" após executar.
    // Pressione Ctrl+C para sair.
    process.exit(0); 
  }
}

createTestUser();