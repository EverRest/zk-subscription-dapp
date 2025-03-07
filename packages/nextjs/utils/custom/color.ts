export function getRandomFlatColor(): string {
  const min = 50;
  const max = 180;
  const randomChannel = () => Math.floor(Math.random() * (max - min) + min);
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
