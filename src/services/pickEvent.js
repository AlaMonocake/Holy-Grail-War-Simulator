import { events } from "../data/events";
import { useSimulation } from "../services/useSimulation";

export function pickEvent(participants, currentDay, master = null) {
  const { pastEvents } = useSimulation();

  const validEvents = events.filter((event) => {
    // Day restriction

    if (event.days && !event.days.includes(currentDay)) {
      return false;
    }

    // Valid participants

    const validTargets = event.valid(participants, pastEvents.value);

    return validTargets.length > 0;
  });

  if (!validEvents.length) {
    return null;
  }

  return validEvents[Math.floor(Math.random() * validEvents.length)];
}
