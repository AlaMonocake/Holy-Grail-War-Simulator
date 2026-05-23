import { ref, shallowRef } from "vue";

const teams = ref([]);

const participants = ref([]);

const currentEvents = shallowRef([]);

const pastEvents = ref([]);

const phase = ref("intro");

const currentDay = ref(1);

const screen = ref("intro");

function setTeams(newTeams) {
  teams.value = newTeams;
}

export function setParticipants(newParticipants) {
  participants.value = newParticipants;
}

function setEvents(events) {
  currentEvents.value = events;
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
  };
}
