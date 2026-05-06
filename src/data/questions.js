export const DAILY_QUESTIONS = [
  '¿Qué movimiento hizo hoy {nombre} que te pareció más expresivo?',
  '¿Qué cosas le generan más paz a {nombre} en este momento de su vida?',
  '¿Cómo describirías el ritmo de {nombre} hoy?',
  '¿Qué te comunicó {nombre} con su mirada hoy?',
  '¿Qué adaptaciones has notado que {nombre} hace naturalmente?',
  '¿Cómo te hizo sentir estar presente con {nombre} hoy?',
  '¿Qué alimentos o sabores disfrutó más {nombre} recientemente?',
  '¿Qué espacio de la casa prefiere {nombre} ahora?',
  '¿Cómo describes la calidad del sueño de {nombre} últimamente?',
  '¿Qué actividad compartida te trajo más conexión con {nombre}?',
  '¿Qué síntoma o cambio observaste hoy y cómo lo manejaste?',
  '¿Qué le alegró el día a {nombre} hoy?',
  '¿Cómo se relaciona {nombre} con las personas del hogar estos días?',
  '¿Qué aprendiste de {nombre} observándolo/a hoy?',
  '¿Qué momento del día fue más especial para los dos?',
  '¿Cómo reconfortas a {nombre} cuando parece incómodo/a?',
  '¿Qué cosa pequeña hiciste hoy por {nombre} que significó mucho?',
  '¿Qué sientes cuando miras a {nombre} a los ojos?',
  '¿Cómo describes la personalidad de {nombre} en esta etapa de su vida?',
  '¿Qué rutina de {nombre} más aprecias últimamente?',
  '¿Qué cosa te preocupa de {nombre} y cómo la estás manejando?',
  '¿Cuándo fue la última vez que reíste con {nombre}? ¿Qué pasó?',
  '¿Qué quisieras que la gente entendiera sobre cuidar a {nombre}?',
  '¿Qué te enseña {nombre} sobre vivir el presente?',
  '¿Cómo sería el día perfecto para {nombre}?',
  '¿Qué momento de hoy recordarás especialmente?',
  '¿Qué necesitas tú para cuidar mejor a {nombre}?',
  '¿Cómo describirías el amor que sientes por {nombre} con una sola imagen?',
  '¿Qué palabras usarías para describir a {nombre} a alguien que no lo/a conoce?',
  '¿Qué agradeces más de tener a {nombre} en tu vida?',
];

export function getTodayQuestion(petName = 'tu mascota') {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const q = DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
  return q.replace(/\{nombre\}/g, petName);
}
