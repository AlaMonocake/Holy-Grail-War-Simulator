import { masterWithServant } from "../services/eventTemplates";

// Contains all event definitions for the simulation

const events = [
  // =========================================
  // LANDMINE
  // =========================================

  {
    id: "event_landmine",

    text: "{master} walks into a landmine and dies.",

    days: [1, 2, 3, 4, 5, 6, 7],

    weight: 5,

    requires: [],

    valid(participants) {
      return masterWithServant(participants);
    },

    effects(master, servant) {
      master.status = "dead";

      if (servant && !servant.hasIndependentAction) {
        servant.status = "dead";
      }
    },
  },

  // =========================================
  // DUEL
  // =========================================

  {
    id: "event_duel",

    text: "{servant1} fights with {servant2} to the death.",

    days: [1, 2, 3, 4, 5, 6, 7],

    weight: 10,

    requires: [],

    valid(participants) {
      const aliveServants = participants.filter(
        (p) => p.type === "servant" && p.status === "alive",
      );

      if (aliveServants.length < 2) return [];

      const pairs = [];

      for (let i = 0; i < aliveServants.length; i++) {
        for (let j = i + 1; j < aliveServants.length; j++) {
          pairs.push({
            servant1: aliveServants[i],
            servant2: aliveServants[j],
          });
        }
      }

      return pairs;
    },

    effects(servant1, servant2) {
      const loser = Math.random() < 0.5 ? servant1 : servant2;

      loser.status = "dead";
    },
  },

  // =========================================
  // BETRAYAL
  // =========================================

  {
    id: "event_betrayal",

    text: "{servant} betrays {master}. The master is left defenseless and killed.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 3,

    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(
        ({ master, servant }) =>
          master &&
          servant &&
          master.status === "alive" &&
          servant.status === "alive",
      );
    },

    effects(servant, master) {
      master.status = "dead";
    },
  },

  // =========================================
  // POISON MUSHROOM
  // =========================================

  {
    id: "poison_mushroom",

    text: "{master} eats a poisonous mushroom!",

    days: [1, 2, 3, 4, 5, 6, 7],

    weight: 4,

    requires: [],

    valid(participants) {
      return masterWithServant(participants);
    },

    effects(master, servant) {
      // no immediate effect
    },
  },

  // =========================================
  // POISON DEATH
  // =========================================

  {
    id: "poison_death",

    text: "{master} succumbs to the poison and dies.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 2,

    requires: ["poison_mushroom"],

    valid(participants, pastEvents = []) {
      if (!pastEvents.includes("poison_mushroom")) {
        return [];
      }

      return masterWithServant(participants);
    },

    effects(master, servant) {
      master.status = "dead";

      if (servant && !servant.hasIndependentAction) {
        servant.status = "dead";
      }
    },
  },

  // =========================================
  // POISON HEAL
  // =========================================

  {
    id: "poison_heal",

    text: "{master} miraculously recovers from the poison!",

    days: [2, 3, 4, 5, 6, 7],

    weight: 2,

    requires: ["poison_mushroom"],

    valid(participants, pastEvents = []) {
      if (!pastEvents.includes("poison_mushroom")) {
        return [];
      }

      return masterWithServant(participants);
    },

    effects(master, servant) {
      // healed, no effect
    },
  },
];

export { events };
