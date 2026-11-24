export function getEventActors(text) {
  const matches = text.match(/\{(.*?)\}/g) || [];

  return [...new Set(matches.map((match) => match.replace(/[{}]/g, "")))];
}
