import { useState, useEffect } from 'react';
import { Container, Typography, CssBaseline, Button, AppBar, Toolbar } from '@mui/material';
import JokeForm from './components/JokeForm';
import JokeDisplay from './components/JokeDisplay';
import Login from './components/Login';
import NewJokeModal from './components/NewJokeModal';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [joke, setJoke] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Idioma fixo em 'pt'
  const language = 'pt'; 

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dicionário para traduzir as categorias para o inglês da API externa
  const categoryTranslation = {
    "Programação": "Programming",
    "Diversos": "Misc",
    "Humor Negro": "Dark",
    "Trocadilho": "Pun",
    "Assustador": "Spooky",
    "Natalino": "Christmas"
  };

  // Garante que o token fique salvo se eu der refresh na página
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

  const fetchJoke = async (categories) => {
    setIsLoading(true);
    setError(null);
    setJoke(null);

    try {
      // --- 1. TENTATIVA LOCAL: Busca no meu banco de dados ---
      const localResponse = await fetch('http://localhost:3001/api/jokes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      let foundLocal = false;
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        
        // Filtra as piadas que vieram do banco pelas categorias que o usuário escolheu
        const filteredLocal = localData.filter(j => 
          categories.includes(j.category) || categories.length === 0
        );

        // Se achou alguma coisa no banco, sorteia uma e mostra:
        if (filteredLocal.length > 0) {
           const randomJoke = filteredLocal[Math.floor(Math.random() * filteredLocal.length)];
           setJoke(randomJoke);
           foundLocal = true;
        }
      }

      // --- 2. TENTATIVA EXTERNA: Fallback para a JokeAPI ---
      if (!foundLocal) {
        // Trava de segurança: só busco fora se estiver em Português na api externa.
        if (language !== 'pt') {
          throw new Error("Piada não encontrada no banco de dados. A busca externa só está disponível em Português.");
        }

        console.log("Buscando na API Externa...");

        // Traduzo as categorias para inglês antes de chamar a API
        const englishCategories = categories.map(cat => categoryTranslation[cat] || cat);
        const categoryString = englishCategories.join(',') || "Any";

        // Forço a busca em pt na URL externa
        const externalUrl = `https://v2.jokeapi.dev/joke/${categoryString}?lang=pt`;

        const extResponse = await fetch(externalUrl);
        const extData = await extResponse.json();

        // Se nem a API externa tiver piada, mostro essa mensagem personalizada:
        if (extData.error) {
          throw new Error("TE PEGUEI ! Sem piadinhas no banco local ou na API externa dessa vez. Cadastre uma ou escolha outra categoria :D");
        }

        setJoke(extData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Se não tiver token, mostra a tela de Login/Cadastro
  if (!token) {
    return (
      <>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Se estiver logado, mostra o Gerador de Piadas
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
        
        <JokeForm onSearch={fetchJoke} />

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