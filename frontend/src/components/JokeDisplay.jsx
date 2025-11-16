import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

// Componente de UI "puro", apenas recebe os dados e os exibe na tela
function JokeDisplay({ joke, isLoading, error }) {
  // Se estiver carregando, mostra o spinner
  if (isLoading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  // Se houver um erro, mostra o alerta
  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  // Se não tiver piada (estado inicial), mostra uma mensagem padrão
  if (!joke) {
    return <Typography sx={{ mt: 4 }}>Sua piada aparecerá aqui!</Typography>;
  }

  // Renderiza a piada, tratando os dois formatos possíveis da API
  return (
    <Card sx={{ mt: 4, minWidth: 275 }}>
      <CardContent>
        {/* Renderização condicional: piada de uma parte ('single') ou duas ('twopart') */}
        {joke.type === 'single' ? (
          <Typography variant="h6">{joke.joke}</Typography>
        ) : (
          <>
            <Typography variant="h6">{joke.setup}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {joke.delivery}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default JokeDisplay;