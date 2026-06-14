import { getPronouns } from "./pronouns";

export function formatEvent(event) {
  console.log("event:", event);
  console.log("event.definition:", event.definition);

  if (!event?.definition?.text) {
    return "INVALID EVENT";
  }

  let text = event.definition.text;

  Object.entries(event.participants).forEach(([key, participant]) => {
    if (!participant) return;

    text = text.replaceAll(`{${key}}`, participant.name);
  });

  const master = event.participants.master || event.participants.master1;

  if (master) {
    const pronouns = getPronouns(master);

    text = text.replaceAll("{heShe}", pronouns.subject);

    text = text.replaceAll("{himHer}", pronouns.object);

    text = text.replaceAll("{hisHer}", pronouns.possessive);
  }

  return text;
}
