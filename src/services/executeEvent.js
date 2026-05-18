import { getEventActors } from "./getEventActors";

export function executeEvent(definition, participants) {
  // Apply effects

  definition.effects?.(...Object.values(participants));

  // Extract visible actors
  // from event text

  const actors = getEventActors(definition.text);

  // Runtime event

  return {
    definition,

    participants,

    actors,
  };
}
