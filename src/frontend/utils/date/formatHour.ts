const formatter = new Intl.NumberFormat('pt-BR');

const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_MINUTES = 60;

export function formatDuration(seconds: number) {
  if (seconds < ONE_MINUTE_IN_SECONDS) {
    return `${formatter.format(seconds)}s`;
  }

  const minutos = Math.floor(seconds / ONE_MINUTE_IN_SECONDS);
  const segundosRestantes = seconds % ONE_MINUTE_IN_SECONDS;

  if (minutos < ONE_HOUR_IN_MINUTES) {
    return segundosRestantes > 0
      ? `${formatter.format(minutos)} minutos e ${formatter.format(segundosRestantes)} segundos`
      : `${formatter.format(minutos)} minutos`;
  }

  const horas = Math.floor(minutos / ONE_HOUR_IN_MINUTES);
  const minutosRestantes = minutos % ONE_HOUR_IN_MINUTES;

  if (horas < 1000) {
    return minutosRestantes > 0
      ? `${formatter.format(horas)} horas e ${formatter.format(minutosRestantes)} minutos`
      : `${formatter.format(horas)} horas`;
  }

  return `${formatter.format(horas)} mil horas`;
}
