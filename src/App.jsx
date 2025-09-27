import { useState } from 'react';
import { Container, Typography, CssBaseline } from '@mui/material';
import JokeForm from './components/JokeForm';
import JokeDisplay from './components/JokeDisplay';

function App() {
  // Estado para armazenar a piada recebida da API
  const [joke, setJoke] = useState(null);
  // Estado para controlar a exibição do loading spinner
  const [isLoading, setIsLoading] = useState(false);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para o idioma selecionado, com 'pt' como padrão
  const [language, setLanguage] = useState('pt');

  // Função assíncrona para buscar uma piada na JokeAPI
  const fetchJoke = async (categories) => {
    // Valida se pelo menos uma categoria foi selecionada
    if (categories.length === 0) {
      setError("Por favor, selecione pelo menos uma categoria.");
      setJoke(null); // Limpa a piada anterior, se houver
      return;
    }

    // Reseta os estados antes de cada nova busca
    setIsLoading(true);
    setError(null);
    setJoke(null);

    try {
      const categoryString = categories.join(',');
      const url = `https://v2.jokeapi.dev/joke/${categoryString}?lang=${language}`;
      
      const response = await fetch(url);
      const data = await response.json();

      // A API retorna `error: true` quando não encontra piadas para os filtros
      if (data.error === true) {
        // Lança um erro com a mensagem personalizada para ser capturado pelo catch
        throw new Error("TE PEGUEI!! Sem piadinhas nessa categoria ou idioma. Tente novamente :-)");
      }

      // Se tudo deu certo, armazena a piada no estado
      setJoke(data);

    } catch (err) {
      // Diferencia o erro personalizado dos erros de rede/servidor
      if (err.message.startsWith("TE PEGUEI!!")) {
        setError(err.message);
      } else {
        // Para qualquer outra falha (sem internet, API fora do ar, etc.)
        setError("Ops! O servidor de piadas não está respondendo. Tente mais tarde.");
      }
    } finally {
      // Garante que o loading seja desativado ao final da requisição (com sucesso ou erro)
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🃏 Gerador de Piadas
        </Typography>
        
        {/* O formulário recebe a função de busca e os estados de idioma */}
        <JokeForm 
          onSearch={fetchJoke} 
          language={language} 
          setLanguage={setLanguage} 
        />

        {/* O display recebe os dados da piada, loading e erro para renderizar */}
        <JokeDisplay joke={joke} isLoading={isLoading} error={error} />
      </Container>
    </>
  );
}

export default App;