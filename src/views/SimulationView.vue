<script setup>
import { computed } from "vue";

import { useSimulation, restartSimulation } from "../services/useSimulation";

import { advanceSimulation } from "../services/advanceSimulation";

import IntroScreen from "../components/simulation/IntroScreen.vue";

import DayScreen from "../components/simulation/DayScreen.vue";

import GraveyardScreen from "../components/simulation/GraveyardScreen.vue";
import VictoryScreen from "../components/simulation/VictoryScreen.vue";
import DrawScreen from "@/components/simulation/DrawScreen.vue";
import NightScreen from "../components/simulation/NightScreen.vue";

const {
  teams,
  currentEvents,
  screen,
  currentDay,
  participants,
  winner,
  goBack,
  history,
} = useSimulation();

const deadParticipants = computed(() =>
  participants.value.filter((p) => p.status === "dead"),
);
</script>

<template>
  <header>
    <h1 class="title header">HOLY GRAIL WAR SIMULATOR</h1>

    <h2 class="header" id="day-counter">
      {{ screen === "night" ? "Night" : "Day" }} {{ currentDay }}
    </h2>
  </header>

  <!-- INTRO -->

  <IntroScreen v-if="screen === 'intro'" :teams="teams" />

  <!-- DAY -->

  <DayScreen v-else-if="screen === 'day'" :events="currentEvents" />

  <!-- NIGHT -->
  <NightScreen v-else-if="screen === 'night'" :events="currentEvents" />

  <!-- GRAVEYARD -->

  <GraveyardScreen
    v-else-if="screen === 'graveyard'"
    :deadParticipants="deadParticipants" />

  <VictoryScreen v-else-if="screen === 'victory'" :winner="winner" />

  <DrawScreen v-else-if="screen === 'draw'" />

  <button class="button" v-if="history.length > 0" @click="goBack">
    Previous
  </button>

  <button
    v-if="screen === 'victory' || screen === 'draw'"
    class="button"
    @click="restartSimulation">
    Restart the Grail War
  </button>

  <button
    class="button"
    id="next-day"
    v-if="screen !== 'victory' && screen !== 'draw'"
    @click="advanceSimulation">
    Proceed
  </button>
</template>

<style>
img {
  max-width: 120px;
  max-height: 100px;
}

.header {
  padding-bottom: 5px;
  margin: 5px 0 0 0;
  text-align: center;
}
.participants {
  display: flex;

  gap: 0.5rem;

  align-items: center;
}
</style>
