import { pickEvent } from "./pickEvent";
import { useSimulation } from "../services/useSimulation";
import { executeEvent } from "./executeEvent";

function generateDayEvents() {
  const { participants, setEvents, currentDay, pastEvents } = useSimulation();

  const simulationParticipants = participants.value;

  // Everyone alive at the beginning of the day.
  const dailyParticipants = simulationParticipants.filter(
    (p) => p.status === "alive",
  );

  const dayEvents = [];
  const participantsWhoActed = new Set();

  for (const participant of dailyParticipants) {
    // Someone else may already have included them in an event.
    if (participantsWhoActed.has(participant.id)) {
      continue;
    }

    // They may have died during an earlier event.
    if (participant.status !== "alive") {
      continue;
    }

    const selectedEvent = pickEvent(
      simulationParticipants,
      currentDay.value,
      pastEvents.value,
      participant.id,
    );

    if (selectedEvent) {
      const { event: eventDefinition, validSets } = selectedEvent;

      const selected = validSets[Math.floor(Math.random() * validSets.length)];

      // Everyone involved counts as having appeared.
      Object.values(selected).forEach((p) => {
        if (p) participantsWhoActed.add(p.id);
      });

      const runtimeEvent = executeEvent(eventDefinition, selected);

      runtimeEvent.applyEffects();

      // Save the event regardless of how many Masters remain.
      pastEvents.value.push(runtimeEvent);
      dayEvents.push(runtimeEvent);

      // Check how many Masters are still alive.
      const remainingMasters = simulationParticipants.filter(
        (p) => p.type === "master" && p.status === "alive",
      );

      // Stop generating events if the war has ended.
      if (remainingMasters.length <= 1) {
        break;
      }
    } else {
      // Fallback activity for participants without a valid event.
      const fallbackDefinition = {
        text:
          participant.type === "master"
            ? "{master} spends the day preparing for the next battle."
            : "{servant} spends the day gathering info around the city.",
      };

      const fallbackParticipants = {
        [participant.type]: participant,
      };

      const runtimeEvent = executeEvent(
        fallbackDefinition,
        fallbackParticipants,
      );

      participantsWhoActed.add(participant.id);

      pastEvents.value.push(runtimeEvent);
      dayEvents.push(runtimeEvent);
    }
  }
  console.log("DAY:", currentDay.value);
  console.log("PARTICIPANTS:", dailyParticipants);
  console.log("GENERATED EVENTS:", dayEvents);
  console.log("EVENT COUNT:", dayEvents.length);
  setEvents(dayEvents);
}

export function advanceSimulation() {
  const { screen, currentDay, participants, winner } = useSimulation();
  // INTRO -> DAY 1
  if (screen.value === "intro") {
    screen.value = "day";
    generateDayEvents();
    return;
  }

  // DAY -> GRAVEYARD
  if (screen.value === "day") {
    screen.value = "graveyard";
    return;
  }

  // GRAVEYARD -> NEXT DAY (or END)
  if (screen.value === "graveyard") {
    if (checkVictory()) return;

    currentDay.value++;
    generateDayEvents();

    screen.value = "day";
    return;
  }

  function checkVictory() {
    const aliveMasters = participants.value.filter(
      (p) => p.type === "master" && p.status === "alive",
    );

    if (aliveMasters.length === 1) {
      winner.value = aliveMasters[0];
      screen.value = "victory";
      return true;
    }

    if (aliveMasters.length === 0) {
      winner.value = null;
      screen.value = "draw";
      return true;
    }

    return false;
  }

  // INTRO -> DAY 1
  if (screen.value === "intro") {
    screen.value = "day";
    generateDayEvents();
    checkVictory();
    return;
  }

  // DAY -> GRAVEYARD
  if (screen.value === "day") {
    screen.value = "graveyard";
    return;
  }

  // GRAVEYARD -> NEXT DAY
  if (screen.value === "graveyard") {
    currentDay.value++;
    generateDayEvents();

    if (checkVictory()) {
      return;
    }

    screen.value = "day";
    return;
  }
}
