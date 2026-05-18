export function formatEvent(event) {
  let text = event.definition.text;

  Object.entries(event.participants).forEach(([key, participant]) => {
    text = text.replaceAll(`{${key}}`, participant.name);
  });

  return text;
}
