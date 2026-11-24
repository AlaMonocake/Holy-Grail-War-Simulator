<script setup>
import { ref } from "vue";
import MasterForm from "../components/MasterForm.vue";
import { masters as defaultMasters } from "../data/masters.js";
import { useRouter } from "vue-router";
import { useSimulation, setParticipants } from "../services/useSimulation";
import { buildParticipants } from "../services/buildParticipants";

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
const savedLineups = ref([
  { name: "", masters: null },
  { name: "", masters: null },
  { name: "", masters: null },
]);

// Load previously saved slots.
const storedLineups = localStorage.getItem("savedLineups");

if (storedLineups) {
  const parsed = JSON.parse(storedLineups);

  savedLineups.value = parsed.map((slot, index) => {
    // Convert lineups saved using our previous format.
    if (Array.isArray(slot)) {
      return {
        name: `Lineup ${index + 1}`,
        masters: slot,
      };
    }

    return slot || { name: "", masters: null };
  });
} else {
  // Migrate the old single saved lineup into Slot 1.
  const oldLineup = localStorage.getItem("savedLineup");

  if (oldLineup) {
    savedLineups.value[0] = {
      name: "My first lineup",
      masters: JSON.parse(oldLineup),
    };
  }
}

// Save changes to slot names.
function saveLineupNames() {
  localStorage.setItem("savedLineups", JSON.stringify(savedLineups.value));
}

function saveLineup(index) {
  savedLineups.value[index].masters = JSON.parse(JSON.stringify(masters.value));

  if (!savedLineups.value[index].name.trim()) {
    savedLineups.value[index].name = `Lineup ${index + 1}`;
  }

  saveLineupNames();

  alert(`Lineup "${savedLineups.value[index].name}" saved!`);
}

function loadLineup(index) {
  const lineup = savedLineups.value[index];

  if (!lineup.masters) return;

  masters.value = JSON.parse(JSON.stringify(lineup.masters));

  alert(`Lineup "${lineup.name}" loaded!`);
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

  <div class="saved-lineups">
    <h2>Saved Lineups</h2>

    <div
      v-for="(lineup, index) in savedLineups"
      :key="index"
      class="lineup-slot">
      <h3>Slot {{ index + 1 }}</h3>

      <input
        v-model="lineup.name"
        class="input"
        placeholder="Name this lineup"
        @change="saveLineupNames" />

      <p>
        {{ lineup.masters ? "Lineup saved!" : "Empty slot" }}
      </p>

      <button class="button" @click="saveLineup(index)">Save</button>

      <button
        class="button"
        @click="loadLineup(index)"
        :disabled="!lineup.masters">
        Load
      </button>
    </div>
  </div>
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
  display: flex;
  flex-wrap: wrap; /*items to wrap to the next row*/
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px; /*space between containers*/
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
