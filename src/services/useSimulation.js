import { ref, shallowRef } from "vue";

const teams = ref([]);

const participants = ref([]);

const currentEvents = shallowRef([]);

const pastEvents = ref([]);

const history = ref([]);

const future = ref([]);

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

function captureSnapshot() {
  return {
    screen: screen.value,
    currentDay: currentDay.value,
    phase: phase.value,
    participants: JSON.parse(JSON.stringify(participants.value)),
    currentEvents: currentEvents.value.slice(),
    pastEvents: pastEvents.value.slice(),
    winnerId: winner.value?.id ?? null,
  };
}

function restoreSnapshot(snapshot) {
  participants.value.forEach((participant) => {
    const saved = snapshot.participants.find((p) => p.id === participant.id);

    if (saved) Object.assign(participant, saved);
  });

  currentDay.value = snapshot.currentDay;
  phase.value = snapshot.phase;
  screen.value = snapshot.screen;
  currentEvents.value = snapshot.currentEvents;
  pastEvents.value = snapshot.pastEvents.slice();

  winner.value =
    participants.value.find((p) => p.id === snapshot.winnerId) ?? null;
}

function saveHistory() {
  history.value.push(captureSnapshot());
}

function goBack() {
  if (history.value.length === 0) return;

  future.value.push(captureSnapshot());

  const previous = history.value.pop();
  restoreSnapshot(previous);
}

function goForward() {
  if (future.value.length === 0) return;

  history.value.push(captureSnapshot());

  const next = future.value.pop();
  restoreSnapshot(next);
}

export function restartSimulation() {
  history.value = [];
  future.value = [];
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
    history,
    saveHistory,
    goBack,
    future,
    goForward,
  };
}
