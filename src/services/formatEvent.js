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

  return text;
}
