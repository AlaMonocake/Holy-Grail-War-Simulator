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

  aliveMasters.forEach(() => {
    const eventDefinition = pickEvent(simulationParticipants, currentDay.value);

    console.log("Picked Event:", eventDefinition);

    if (!eventDefinition) return;

    const validSets = eventDefinition.valid(
      simulationParticipants,
      pastEvents.value,
    );

    console.log("Valid Sets:", validSets);

    if (!validSets.length) return;

    // RANDOM SET

    const selected = validSets[Math.floor(Math.random() * validSets.length)];

    // EXECUTE

    const runtimeEvent = executeEvent(eventDefinition, selected);

    // SAVE HISTORY

    pastEvents.value.push(eventDefinition.id);

    // STORE EVENT

    dayEvents.push(runtimeEvent);
  });

  // RENDER ALL EVENTS

  setEvents(dayEvents);

  console.log("FINAL DAY EVENTS:", dayEvents);
}

export function advanceSimulation() {
  const { screen, currentDay } = useSimulation();

  // ========================
  // INTRO -> DAY
  // ========================

  if (screen.value === "intro") {
    screen.value = "day";

    generateDayEvents();

    return;
  }

  // ========================
  // DAY -> GRAVEYARD
  // ========================

  if (screen.value === "day") {
    screen.value = "graveyard";

    return;
  }

  // ========================
  // GRAVEYARD -> NEXT DAY
  // ========================

  if (screen.value === "graveyard") {
    currentDay.value++;

    generateDayEvents();

    screen.value = "day";

    return;
  }
}
