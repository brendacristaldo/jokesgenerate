import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Recebe o estado do idioma e a função para atualizá-lo
function LanguageSelector({ language, setLanguage }) {
  // Atualiza o estado no App.jsx sempre que uma nova opção é selecionada
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
      <InputLabel id="language-select-label">Idioma</InputLabel>
      <Select
        labelId="language-select-label"
        value={language}
        label="Idioma"
        onChange={handleChange}
      >
        <MenuItem value={"pt"}>Português</MenuItem>
        <MenuItem value={"en"}>Inglês</MenuItem>
        <MenuItem value={"es"}>Espanhol</MenuItem>
      </Select>
    </FormControl>
  );
}

export default LanguageSelector;