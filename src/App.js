// src/App.jsx

import { useReducer } from 'react'; // Trocamos o useState pelo useReducer
import { Container, Typography, CssBaseline } from '@mui/material';
import JokeForm from './components/JokeForm';
import JokeDisplay from './components/JokeDisplay';

// 1. Definimos o estado inicial da nossa aplicação em um só lugar
const initialState = {
  joke: null,
  isLoading: false,
  error: null,
  language: 'pt',
};

// 2. Criamos a função "reducer", que centraliza TODA a lógica de atualização de estado
// Ela recebe o estado atual e uma "action" (uma ordem para mudar o estado)
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null, joke: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, joke: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      throw new Error();
  }
}

function App() {
  // 3. Trocamos os vários useState por um único useReducer
  // Ele nos dá o "state" atual e uma função "dispatch" para enviar as "actions"
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // A função de busca agora usa "dispatch" para comunicar as mudanças de estado
  const fetchJoke = async (categories) => {
    if (categories.length === 0) {
      // Envia a action de erro se nenhuma categoria for selecionada
      dispatch({ type: 'FETCH_ERROR', payload: "Por favor, selecione pelo menos uma categoria." });
      return;
    }

    // Dispara a action que inicia a busca (mostra o loading, limpa erros)
    dispatch({ type: 'FETCH_START' });

    try {
      const categoryString = categories.join(',');
      // Usamos o state.language que agora vem do nosso reducer
      const url = `https://v2.jokeapi.dev/joke/${categoryString}?lang=${state.language}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error === true) {
        throw new Error("TE PEGUEI!! Sem piadinhas dessa vez. Escolha outro idioma ou outra categoria! ");
      }
      
      // Se a busca deu certo, dispara a action de sucesso com a piada
      dispatch({ type: 'FETCH_SUCCESS', payload: data });

    } catch (err) {
      // Dispara a action de erro com a mensagem apropriada
      const errorMessage = err.message.startsWith("TE PEGUEI!!")
        ? err.message
        : "Ops! O servidor de piadas não está respondendo. Tente mais tarde.";
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };
  
  // Função para mudar o idioma, que agora também usa o dispatch
  const setLanguage = (lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };
  
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🃏 Gerador de Piadas
        </Typography>
        
        {/* Passamos os valores do estado e as funções para os componentes filhos */}
        <JokeForm 
          onSearch={fetchJoke} 
          language={state.language} 
          setLanguage={setLanguage} 
        />
        <JokeDisplay 
          joke={state.joke} 
          isLoading={state.isLoading} 
          error={state.error} 
        />
      </Container>
    </>
  );
}

export default App;