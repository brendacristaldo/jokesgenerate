import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, FormControl } from '@mui/material';
import LanguageSelector from './LanguageSelector';

function JokeForm({ onSearch, language, setLanguage }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  // AGORA: Usamos os mesmos nomes que estão no banco de dados (Português)
  // Isso garante que o filtro 'Trocadilho' busque 'Trocadilho' no banco.
  const categories = [
    "Programação", 
    "Diversos", 
    "Humor Negro", 
    "Trocadilho", 
    "Assustador", 
    "Natalino"
  ];

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedCategories(prev => [...prev, name]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== name));
    }
  };

  const handleSubmit = () => {
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
              // O 'name' agora é o nome em português (ex: "Trocadilho")
              control={<Checkbox onChange={handleCheckboxChange} name={cat} />}
              label={cat} 
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