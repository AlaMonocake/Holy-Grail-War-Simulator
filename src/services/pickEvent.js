import { events } from "../data/events";

export function pickEvent(
  participants,
  currentDay,
  pastEvents = [],
  requiredParticipantId,
) {
  const validEvents = events
    .filter((event) => {
      if (event.days && !event.days.includes(currentDay)) {
        return false;
      }

      return true;
    })
    .map((event) => ({
      event,
      validSets: event
        .valid(participants, pastEvents)
        .filter((set) =>
          Object.values(set).some(
            (participant) => participant?.id === requiredParticipantId,
          ),
        ),
    }))
    .filter((entry) => entry.validSets.length > 0);

  if (!validEvents.length) return null;

  return validEvents[Math.floor(Math.random() * validEvents.length)];
}
