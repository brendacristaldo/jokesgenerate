import { useState } from 'react';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, FormControl, InputLabel, Select, MenuItem, 
  Alert, RadioGroup, FormControlLabel, Radio, FormLabel 
} from '@mui/material';

function NewJokeModal({ open, onClose, token }) {
  const [type, setType] = useState('single');
  const [category, setCategory] = useState('');
  const [jokePart1, setJokePart1] = useState(''); // Serve para 'joke' ou 'setup'
  const [jokePart2, setJokePart2] = useState(''); // Serve para 'delivery'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Monta o objeto baseado no tipo
    const jokeData = {
      type,
      category,
    };

    if (type === 'single') {
      jokeData.joke = jokePart1;
    } else {
      jokeData.setup = jokePart1;
      jokeData.delivery = jokePart2;
    }

    try {
      const response = await fetch('http://localhost:3001/api/jokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jokeData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Se houver erros de validação do express-validator
        if(data.errors) {
             throw new Error(data.errors.map(e => e.msg).join(', '));
        }
        throw new Error(data.msg || 'Erro ao salvar');
      }

      setSuccess('Piada cadastrada com sucesso!');
      // Limpa o form após sucesso
      setJokePart1('');
      setJokePart2('');
      setCategory('');
      
      // Fecha o modal após 1.5s
      setTimeout(() => {
          setSuccess('');
          onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cadastrar Nova Piada</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Tipo</FormLabel>
          <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
            <FormControlLabel value="single" control={<Radio />} label="Única" />
            <FormControlLabel value="twopart" control={<Radio />} label="Duas Partes" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Categoria</InputLabel>
          <Select value={category} label="Categoria" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="Programação">Programação</MenuItem>
            <MenuItem value="Trocadilho">Trocadilho</MenuItem>
            <MenuItem value="Diversos">Diversos</MenuItem>
          </Select>
        </FormControl>

        {type === 'single' ? (
           <TextField
             margin="normal"
             label="A Piada"
             fullWidth
             multiline
             rows={3}
             value={jokePart1}
             onChange={(e) => setJokePart1(e.target.value)}
           />
        ) : (
          <>
            <TextField
             margin="normal"
             label="Pergunta (Setup)"
             fullWidth
             value={jokePart1}
             onChange={(e) => setJokePart1(e.target.value)}
           />
           <TextField
             margin="normal"
             label="Resposta (Delivery)"
             fullWidth
             value={jokePart2}
             onChange={(e) => setJokePart2(e.target.value)}
           />
          </>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewJokeModal;