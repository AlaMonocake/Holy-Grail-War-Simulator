<script setup>
import EventCard from "./EventCard.vue";

defineProps({
  events: Array,
});
</script>

<template>
  <div class="event-container">
    <EventCard v-for="(event, index) in events" :key="index" :event="event" />
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
</style>
