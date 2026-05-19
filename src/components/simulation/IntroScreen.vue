<script setup>
defineProps({
  teams: Array,
});
</script>

<template>
  <div class="event-container">
    <div v-for="team in teams" :key="team.id" class="event">
      <img :src="team.picture" class="portrait" />

      <p>
        <strong>
          {{ team.name }}
        </strong>

        summons

        <strong>
          {{ team.servant?.name || "an unknown servant" }} </strong
        >.
      </p>
    </div>
  </div>
</template>

<style scoped>
.event-container {
  width: 1000px;

  display: flex;

  flex-direction: column;

  margin-left: auto;
  margin-right: auto;

  background-color: rgb(51, 27, 27);

  padding: 10px;

  border: 1px solid #ff4444;

  border-radius: 10px;

  box-sizing: border-box;
}

.event {
  display: flex;

  align-items: center;

  gap: 1rem;

  margin-bottom: 1rem;
}
</style>
