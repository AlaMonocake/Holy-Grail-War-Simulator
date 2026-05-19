<script setup>
import { computed } from "vue";

import { useSimulation } from "../services/useSimulation";

import { advanceSimulation } from "../services/advanceSimulation";

import IntroScreen from "../components/simulation/IntroScreen.vue";

import DayScreen from "../components/simulation/DayScreen.vue";

import GraveyardScreen from "../components/simulation/GraveyardScreen.vue";

const { teams, currentEvents, screen, currentDay, participants } =
  useSimulation();

const deadParticipants = computed(() =>
  participants.value.filter((p) => p.status === "dead"),
);
</script>

<template>
  <header>
    <h1 class="title header">HOLY GRAIL WAR SIMULATOR</h1>

    <h2 class="header" id="day-counter">Day {{ currentDay }}</h2>
  </header>

  <!-- INTRO -->

  <IntroScreen v-if="screen === 'intro'" :teams="teams" />

  <!-- DAY -->

  <DayScreen v-else-if="screen === 'day'" :events="currentEvents" />

  <!-- GRAVEYARD -->

  <GraveyardScreen
    v-else-if="screen === 'graveyard'"
    :deadParticipants="deadParticipants" />

  <button class="button" id="next-day" @click="advanceSimulation">
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
</style>
