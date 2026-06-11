import { pickEvent } from "./pickEvent";
import { useSimulation } from "../services/useSimulation";
import { executeEvent } from "./executeEvent";

function generateDayEvents() {
  const { participants, setEvents, currentDay, pastEvents } = useSimulation();

  const simulationParticipants = participants.value;

  const aliveMasters = simulationParticipants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

  const dayEvents = [];

  for (const master of aliveMasters) {
    if (master.status !== "alive") {
      continue;
    }

    const eventDefinition = pickEvent(simulationParticipants, currentDay.value);

    if (!eventDefinition) {
      continue;
    }

    const validSets = eventDefinition.valid(
      simulationParticipants,
      pastEvents.value,
    );

    if (!validSets.length) {
      continue;
    }

    const selected = validSets[Math.floor(Math.random() * validSets.length)];

    const runtimeEvent = executeEvent(eventDefinition, selected);

    // APPLY IMMEDIATELY
    runtimeEvent.applyEffects();

    pastEvents.value.push(eventDefinition.id);

    dayEvents.push(runtimeEvent);
  }

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
    const aliveMasters = participants.value.filter(
      (p) => p.type === "master" && p.status === "alive",
    );

    if (aliveMasters.length === 1) {
      winner.value = aliveMasters[0];

      screen.value = "victory";

      return;
    }

    screen.value = "graveyard";

    return;
  }

  // GRAVEYARD -> NEXT DAY

  if (screen.value === "graveyard") {
    currentDay.value++;

    generateDayEvents();

    const aliveMasters = participants.value.filter(
      (p) => p.type === "master" && p.status === "alive",
    );

    if (aliveMasters.length === 1) {
      winner.value = aliveMasters[0];

      screen.value = "victory";

      return;
    }

    screen.value = "day";

    return;
  }
}
