import { useState } from 'react';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, FormControl, InputLabel, Select, MenuItem, 
  Alert 
} from '@mui/material';

function NewJokeModal({ open, onClose, token }) {
  // Travei o tipo em 'single' para simplificar
  const type = 'single'; 
  const [category, setCategory] = useState('');
  const [jokeText, setJokeText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    const jokeData = {
      type,
      category,
      joke: jokeText // Mando sempre como 'joke' simples
    };

    try {
      const response = await fetch('https://localhost:3001/api/jokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jokeData)
      });

      const data = await response.json();

      if (!response.ok) {
        if(data.errors) {
             throw new Error(data.errors.map(e => e.msg).join(', '));
        }
        throw new Error(data.msg || 'Erro ao salvar');
      }

      setSuccess('Piada cadastrada com sucesso!');
      setJokeText('');
      setCategory('');
      
      // Fecha o modal depois de salvar
      setTimeout(() => {
          setSuccess('');
          onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cadastrar Nova Piada</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoria</InputLabel>
          <Select 
            value={category} 
            label="Categoria" 
            onChange={(e) => setCategory(e.target.value)}
          >
            {/* Lista completa de categorias que eu disponibilizo no sistema */}
            <MenuItem value="Programação">Programação</MenuItem>
            <MenuItem value="Diversos">Diversos</MenuItem>
            <MenuItem value="Humor Negro">Humor Negro</MenuItem>
            <MenuItem value="Trocadilho">Trocadilho</MenuItem>
            <MenuItem value="Assustador">Assustador</MenuItem>
            <MenuItem value="Natalino">Natalino</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          label="A Piada"
          fullWidth
          required
          multiline
          rows={4}
          value={jokeText}
          onChange={(e) => setJokeText(e.target.value)}
          placeholder="Digite sua piada aqui..."
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewJokeModal;