import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, FormControl } from '@mui/material';
import LanguageSelector from './LanguageSelector';

// Recebe as props do App.jsx para gerenciar o estado global
function JokeForm({ onSearch, language, setLanguage }) {
  // Estado local para controlar apenas as categorias selecionadas neste componente
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Nomes das categorias que a API espera receber (em inglês)
  const categories = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Christmas"];
  
  // Mapeamento para exibir os nomes das categorias em português na tela
  const categoryLabels = {
    Programming: "Programação",
    Misc: "Diversos",
    Dark: "Humor Negro",
    Pun: "Trocadilho",
    Spooky: "Assustador",
    Christmas: "Natalino",
  };

  // Atualiza a lista de categorias selecionadas quando um checkbox muda
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      // Adiciona a categoria à lista se marcada
      setSelectedCategories(prev => [...prev, name]);
    } else {
      // Remove a categoria da lista se desmarcada
      setSelectedCategories(prev => prev.filter(cat => cat !== name));
    }
  };

  // Chamado quando o botão "Gerar Piada" é clicado
  const handleSubmit = () => {
    // Executa a função de busca que foi passada pelo App.jsx
    onSearch(selectedCategories);
  };

  return (
    <>
      <LanguageSelector language={language} setLanguage={setLanguage} />
    
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Escolha as categorias da piada</FormLabel>
        <FormGroup>
          {categories.map(cat => (
            <FormControlLabel
              key={cat}
              control={<Checkbox onChange={handleCheckboxChange} name={cat} />}
              label={categoryLabels[cat]} // Mostra o nome em português
            />
          ))}
        </FormGroup>
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Gerar Piada
        </Button>
      </FormControl>
    </>
  );
}

export default JokeForm;