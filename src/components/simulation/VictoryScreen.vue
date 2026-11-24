<script setup>
import { computed } from "vue";
import { useSimulation } from "../../services/useSimulation";

const props = defineProps({
  winner: Object,
});

const { participants } = useSimulation();

const winningServant = computed(() =>
  participants.value.find(
    (p) => p.type === "servant" && p.masterId === props.winner?.id,
  ),
);
</script>

<template>
  <div class="event-container">
    <h2>The Holy Grail War is Over</h2>

    <div class="winner-portraits">
      <div class="winner-member">
        <img :src="winner.picture" class="winner-portrait" />
        <h2>{{ winner.name }}</h2>
        <p>Master</p>
      </div>

      <div v-if="winningServant" class="winner-member">
        <img :src="winningServant.picture" class="winner-portrait" />
        <h2>{{ winningServant.name }}</h2>
        <p>Servant</p>
      </div>
    </div>

    <p>have claimed the Holy Grail and made their wish come true.</p>
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
.winner-portraits {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.winner-member {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.winner-portrait {
  width: 200px;
  height: 250px;
  object-fit: cover;
  border: 2px solid #ff4444;
  border-radius: 10px;
}
</style>
