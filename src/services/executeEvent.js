import { getEventActors } from "./getEventActors";

export function executeEvent(definition, participants) {
  const actors = getEventActors(definition.text);
  return {
    definition,
    participants,
    actors,
    applyEffects() {
      definition.effects?.(...Object.values(participants));
    },
  };
}
