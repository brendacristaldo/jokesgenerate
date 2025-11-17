import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Paper, Link } from '@mui/material';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login e Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Trata array de erros ou mensagem única
        const errorMsg = data.errors ? data.errors[0].msg : (data.msg || 'Erro na requisição');
        throw new Error(errorMsg);
      }

      if (isLogin) {
        onLogin(data.token);
      } else {
        setSuccess('Conta criada com sucesso! Faça login.');
        setIsLogin(true); // Volta para a tela de login
        setPassword('');  // Limpa a senha
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {isLogin ? '🔐 Login' : '📝 Nova Conta'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>

          <Box textAlign="center">
            <Link 
              component="button" 
              variant="body2" 
              type="button" // Importante para não submeter o form
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem conta? Faça Login"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;