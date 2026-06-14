export function getPronouns(character) {
  if (character.gender === "female") {
    return {
      subject: "she",
      object: "her",
      possessive: "her",
    };
  }

  return {
    subject: "he",
    object: "him",
    possessive: "his",
  };
}
