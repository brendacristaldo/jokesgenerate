import { useState, useEffect } from 'react';
import { Container, Typography, CssBaseline, Button, AppBar, Toolbar, Box } from '@mui/material';
import JokeForm from './components/JokeForm';
import JokeDisplay from './components/JokeDisplay';
import Login from './components/Login';
import NewJokeModal from './components/NewJokeModal';

function App() {
  // Estado para armazenar o token JWT
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const [joke, setJoke] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para persistir o token se a página for recarregada
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setJoke(null);
  };

 // ... (imports e estados continuam iguais)

  const fetchJoke = async (categories) => {
    setIsLoading(true);
    setError(null);
    setJoke(null);

    try {
      // Agora chamamos o SEU backend!
      // Nota: No backend, implementamos uma busca simples que retorna TODAS as piadas.
      // Para filtrar por categoria no backend, precisaríamos ajustar a rota GET lá.
      // Por enquanto, vamos buscar todas e filtrar aqui no front (ou apenas exibir).
      
      const response = await fetch('http://localhost:3001/api/jokes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // IMPORTANTE: Envia o token no cabeçalho
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Erro ao buscar piadas');
      }

      // O backend retorna um ARRAY de piadas.
      // O componente JokeDisplay espera UMA piada.
      // Vamos pegar uma aleatória da lista que veio do banco.
      if (data.length > 0) {
        // Filtra localmente pelas categorias selecionadas (opcional, mas bom para testar)
        const filteredJokes = data.filter(j => categories.includes(j.category) || categories.length === 0);
        
        if (filteredJokes.length > 0) {
           const randomJoke = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
           setJoke(randomJoke);
        } else {
           throw new Error("Nenhuma piada encontrada para estas categorias no banco.");
        }
      } else {
        throw new Error("O banco de piadas está vazio! Cadastre uma piada.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização Condicional: Se não tem token, mostra Login
  if (!token) {
    return (
      <>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Se tem token, mostra o App principal
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGJow: 1 }}>
            Fullstack Jokes
          </Typography>
          <Button color="inherit" onClick={() => setIsModalOpen(true)}>Nova Piada</Button>
          <Button color="inherit" onClick={handleLogout}>Sair</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🃏 Gerador de Piadas
        </Typography>
        
        <JokeForm 
          onSearch={fetchJoke} 
          language={language} 
          setLanguage={setLanguage} 
        />

        <JokeDisplay joke={joke} isLoading={isLoading} error={error} />
      </Container>
      <NewJokeModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        token={token} 
      />
    </>
  );
}

export default App;