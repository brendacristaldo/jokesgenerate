import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, FormControl } from '@mui/material';

// Removemos 'language' e 'setLanguage' das props, pois não precisamos mais deles aqui
function JokeForm({ onSearch }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

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
      {/* O seletor de idiomas foi removido daqui */}
    
      <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
        <FormLabel component="legend">Escolha as categorias da piada</FormLabel>
        <FormGroup>
          {categories.map(cat => (
            <FormControlLabel
              key={cat}
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