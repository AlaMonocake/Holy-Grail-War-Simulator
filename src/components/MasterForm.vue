<script setup>
import { ref, onMounted } from "vue";
import { loadServants, getRandomServant } from "../services/servantService";

const props = defineProps({
  master: Object,
});

const servants = ref([]);

onMounted(async () => {
  servants.value = await loadServants();
});

function randomizeServant() {
  if (!servants.value.length) return;

  props.master.servant = getRandomServant();
}
const imageUrl = ref("");

function updatePicture() {
  if (imageUrl.value.trim()) {
    props.master.picture = imageUrl.value;
  }
}

function uploadImage(event) {
  const file = event.target.files[0];

  if (!file) return;

  props.master.picture = URL.createObjectURL(file);

  imageUrl.value = "";
}
</script>

<template>
  <div class="master-form">
    <h3>Team {{ master.id }}:</h3>
    <h3>The Master</h3>
    <div v-if="master">
      <img :src="master.picture" />
      <p>Name:</p>
      <input v-model="master.name" class="input" />
      <p>Choose a gender:</p>
      <select v-model="master.gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <p>Replace picture:</p>
      <input
        v-model="imageUrl"
        class="input"
        placeholder="Paste your image link here"
        @input="updatePicture" />

      <p>Or upload an image:</p>

      <input type="file" accept="image/*" @change="uploadImage" />
      <h3>The Servant:</h3>
      <button class="button" @click="randomizeServant">Randomize</button>
      <select v-model="master.servant" class="input">
        <option :value="null">Choose a Servant</option>
        <option v-for="servant in servants" :key="servant.id" :value="servant">
          {{ servant.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.master-form {
  width: 13%; /* Fixed width for each container, at 13% all masters show on one row rn */
  display: flex;
  flex-direction: column; /*Master and Servant stack vertically */
  background-color: rgb(51, 27, 27);
  padding: 5px 10px 5px 10px;
  border: 1px solid #ff4444;
  border-radius: 10px;
  box-sizing: border-box;
}

input,
select,
button {
  padding: 0.5rem;
}
</style>
