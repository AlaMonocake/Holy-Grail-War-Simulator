import { events } from "../data/events";

export function pickEvent(
  participants,
  currentDay,
  pastEvents = [],
  requiredParticipantId,
  time = "day",
) {
  const validEvents = events
    .filter((event) => {
      // Events without a time property are daytime events.
      const eventTime = event.time || "day";

      if (eventTime !== time) return false;

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
