import { pickEvent } from "./pickEvent";
import { useSimulation } from "../services/useSimulation";
import { executeEvent } from "./executeEvent";

function generateEvents(time) {
  const { participants, setEvents, currentDay, pastEvents } = useSimulation();

  const simulationParticipants = participants.value;

  const phaseParticipants = simulationParticipants.filter(
    (p) => p.status === "alive",
  );

  const phaseEvents = [];
  const participantsWhoActed = new Set();

  for (const participant of phaseParticipants) {
    if (participantsWhoActed.has(participant.id)) {
      continue;
    }

    if (participant.status !== "alive") {
      continue;
    }

    const selectedEvent = pickEvent(
      simulationParticipants,
      currentDay.value,
      pastEvents.value,
      participant.id,
      time,
    );

    if (selectedEvent) {
      const { event: eventDefinition, validSets } = selectedEvent;

      const selected = validSets[Math.floor(Math.random() * validSets.length)];

      // everyone involved counts as having appeared
      Object.values(selected).forEach((p) => {
        if (p) participantsWhoActed.add(p.id);
      });

      const runtimeEvent = executeEvent(eventDefinition, selected);

      runtimeEvent.applyEffects();

      pastEvents.value.push(runtimeEvent);
      phaseEvents.push(runtimeEvent);

      // stop generating events if the war has ended
      const remainingMasters = simulationParticipants.filter(
        (p) => p.type === "master" && p.status === "alive",
      );

      if (remainingMasters.length <= 1) {
        break;
      }
    } else {
      // fallback activity for participants without a valid event
      const fallbackDefinition = {
        text:
          time === "day"
            ? participant.type === "master"
              ? "{master} spends the day preparing for the next battle."
              : "{servant} spends the day gathering information around the city."
            : participant.type === "master"
              ? "{master} spends the night resting."
              : "{servant} spends the night keeping watch.",
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
      phaseEvents.push(runtimeEvent);
    }
  }

  console.log(`${time.toUpperCase()}:`, currentDay.value);
  console.log("GENERATED EVENTS:", phaseEvents);

  setEvents(phaseEvents);
}

export function advanceSimulation() {
  const {
    screen,
    currentDay,
    participants,
    winner,
    saveHistory,
    future,
    goForward,
  } = useSimulation();

  // Replay an already-generated screen if one exists.
  if (future.value.length > 0) {
    goForward();
    return;
  }

  saveHistory();

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

  // INTRO -> DAY
  if (screen.value === "intro") {
    screen.value = "day";
    generateEvents("day");
    return;
  }

  // DAY -> NIGHT
  if (screen.value === "day") {
    screen.value = "night";
    generateEvents("night");
    return;
  }

  // NIGHT -> GRAVEYARD
  if (screen.value === "night") {
    screen.value = "graveyard";
    return;
  }

  // GRAVEYARD -> NEXT DAY (or END)
  if (screen.value === "graveyard") {
    if (checkVictory()) return;

    currentDay.value++;
    screen.value = "day";
    generateEvents("day");
    return;
  }
}
