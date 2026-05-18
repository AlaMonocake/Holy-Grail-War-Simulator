<script setup>
import { useSimulation } from "../services/useSimulation";
import { advanceSimulation } from "../services/advanceSimulation";
import { formatEvent } from "../services/formatEvent";
const { teams, currentEvents, phase } = useSimulation();
</script>

<template>
  <header>
    <h1 class="title header">HOLY GRAIL WAR SIMULATOR</h1>
    <h2 class="header" id="day-counter">Day 1</h2>
  </header>

  <div id="event-log" class="event-container">
    <!-- Initial summon lines -->
    <template v-if="phase === 'intro'">
      <div v-for="team in teams" :key="team.id" class="event">
        <img :src="team.picture" class="portrait" />

        <p>
          <strong>{{ team.name }}</strong>

          summons

          <strong> {{ team.servant?.name || "an unknown servant" }} </strong>.
        </p>
      </div>
    </template>
    <!-- Event log -->
    <template v-else>
      <div v-for="(event, index) in currentEvents" :key="index" class="event">
        <!-- Participants -->

        <div class="participants">
          <div v-for="key in event.actors" :key="key">
            <img :src="event.participants[key]?.picture" class="portrait" />
          </div>
        </div>

        <p>
          {{ formatEvent(event) }}
        </p>
      </div>
    </template>
  </div>
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
.event-container {
  width: 1000px; /* Fixed width*/
  display: flex;
  flex-direction: column; /* Master and Servant stacking*/
  margin-left: auto;
  margin-right: auto;
  background-color: rgb(51, 27, 27); /* Background color */
  padding: 10px;
  border: 1px solid #ff4444; /* Border around each container */
  border-radius: 10px;
  box-sizing: border-box; /* Ensures padding is included in width */
}
.event {
  display: flex;
  align-items: center;
  gap: 1rem;

  margin-bottom: 1rem;
}
</style>
