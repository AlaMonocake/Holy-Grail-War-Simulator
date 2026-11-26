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
  background-color: rgb(35, 27, 51);
  padding: 10px;
  border: 1px solid #9966cc;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>
