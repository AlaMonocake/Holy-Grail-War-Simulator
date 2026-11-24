import { ref, shallowRef } from "vue";

const teams = ref([]);

const participants = ref([]);

const currentEvents = shallowRef([]);

const pastEvents = ref([]);

const phase = ref("intro");

const currentDay = ref(1);

const screen = ref("intro");
const winner = ref(null);

function setTeams(newTeams) {
  teams.value = newTeams;
}

export function setParticipants(newParticipants) {
  participants.value = newParticipants;
}

function setEvents(events) {
  currentEvents.value = events;
}

export function restartSimulation() {
  participants.value = participants.value.map((participant) => ({
    ...participant,
    status: "alive",
  }));

  currentEvents.value = [];
  pastEvents.value = [];
  currentDay.value = 1;
  phase.value = "intro";
  screen.value = "intro";
  winner.value = null;
}

export function useSimulation() {
  return {
    teams,
    participants,
    currentEvents,
    pastEvents,
    phase,
    currentDay,
    screen,
    setTeams,
    setParticipants,
    setEvents,
    winner,
    restartSimulation,
  };
}
