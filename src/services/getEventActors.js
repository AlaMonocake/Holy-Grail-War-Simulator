export function getEventActors(text) {
  const matches = text.match(/\{(.*?)\}/g) || [];

  return matches.map((match) => match.replace(/[{}]/g, ""));
}
