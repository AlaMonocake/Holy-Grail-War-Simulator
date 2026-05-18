<script setup>
import { ref } from "vue";
import MasterForm from "../components/MasterForm.vue";
import { masters as defaultMasters } from "../data/masters.js";
import { useRouter } from "vue-router";
import { useSimulation, setParticipants } from "../services/useSimulation";
import { buildParticipants } from "@/services/buildParticipants";

const masters = ref([...defaultMasters]);
const router = useRouter();

const { setTeams } = useSimulation();

function startSimulation() {
  console.log("start sim clicked");

  setTeams(masters.value);
  const builtParticipants = buildParticipants(masters.value);

  setParticipants(builtParticipants);
  router.push("/simulation");
}
</script>

<template>
  <h1 class="header">Holy Grail War Simulator</h1>
  <h2 class="header">The Cast</h2>
  <div class="master-list">
    <MasterForm
      :master="master"
      v-for="master in masters"
      :key="master.id"
      :name="master.name"
      :servants="servants" />
  </div>
  <button id="simulation" class="button" @click="startSimulation">
    Start Simulation
  </button>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: rgb(12, 12, 12);
  color: #ffffff;
  margin: 0;
  padding: 0;
}
img {
  max-width: 150px;
  max-height: 200px;
}
.master-list {
  display: flex; /* Enables flexbox layout */
  flex-wrap: wrap; /* Allows items to wrap to the next row */
  justify-content: flex-start; /* Aligns items to the left */
  align-items: flex-start; /* Aligns items to the top */
  gap: 20px; /* Adds space between containers */
  margin: 0;
  padding: 0;
}
h1 {
  font-family: "Times New Roman", Times, serif;
}
h3 {
  padding: 0;
  margin: 2px 0 4px 0;
}
.header {
  padding-bottom: 3px;
  margin: 0px;
  text-align: center;
}
.input {
  width: 80%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(23, 5, 5);
  color: #ffffff;
}
.button {
  background-color: rgb(49, 14, 14);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
.button:hover {
  background-color: #45a049;
}
#simulation,
#next-day {
  position: absolute;
  left: 45%;
  margin-top: 10px;
  border: 1px solid white;
  background-color: rgb(49, 14, 14);
}
</style>
