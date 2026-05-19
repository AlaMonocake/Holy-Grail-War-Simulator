<script setup>
defineProps({
  deadParticipants: Array,
});
</script>

<template>
  <div class="event-container">
    <div class="graveyard">
      <h2 class="graveyard-title">The church bell rings in the distance</h2>
      <h3>Let's pray for the fallen</h3>
      <div class="graveyard-list">
        <div
          v-for="participant in deadParticipants"
          :key="participant.id"
          class="dead-participant">
          <img :src="participant.picture" class="portrait dead" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.graveyard {
  text-align: center;

  padding: 2rem;
}

.graveyard-title {
  margin-bottom: 2rem;

  font-size: 2rem;
}

.graveyard-list {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 2rem;
}

.dead-participant {
  display: flex;

  flex-direction: column;

  align-items: center;
}

.dead {
  filter: grayscale(100%);

  opacity: 0.65;

  transition: 0.3s ease;
}

.dead:hover {
  filter: grayscale(0%);

  opacity: 1;

  transform: scale(1.05);
}
</style>
