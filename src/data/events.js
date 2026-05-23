import {
  aliveMasters,
  masterPairs,
  masterWithServant,
  servantPairs,
} from "../services/eventHelpers";

// Contains all event definitions
// for the simulation

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
      return servantPairs(participants);
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
        ({ master, servant }) => master && servant,
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
      // healed
    },
  },

  // =========================================
  // LAYLINE DISPUTE
  // =========================================

  {
    id: "event_layline_dispute",

    text: "{master1} and {master2} fight over ownership of a layline. {master2} has the disadvantage and retreats.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 5,

    requires: [],

    valid(participants) {
      return masterPairs(participants);
    },

    effects(master1, master2) {
      // retreat only
    },
  },

  // =========================================
  // PROJECTION
  // =========================================

  {
    id: "event_projection",

    text: "{master} projects some weapons.",

    days: [1, 2, 3, 4, 5, 6, 7],

    weight: 4,

    requires: [],

    valid(participants) {
      return aliveMasters(participants).map((master) => ({
        master,
      }));
    },

    effects(master) {
      // flavor only
    },
  },

  // =========================================
  // CHURCH AMBUSH
  // =========================================

  {
    id: "event_church_ambush",

    text: "{master1} runs for the church, but {master2} and {servant} ambush and kill them.",

    days: [3, 4, 5, 6, 7],

    weight: 3,

    requires: [],

    valid(participants) {
      const eventSets = [];

      const teams = masterWithServant(participants);

      teams.forEach(({ master: master1 }) => {
        teams.forEach(({ master: master2, servant }) => {
          if (master1.id === master2.id) return;
          if (!servant) return;

          eventSets.push({ master1, master2, servant });
        });
      });

      return eventSets;
    },

    effects(master1) {
      master1.status = "dead";
    },
  },

  // =========================================
  // SANITY
  // =========================================

  {
    id: "event_sanity",

    text: "{master} questions their sanity.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 2,

    requires: [],

    valid(participants) {
      return aliveMasters(participants).map((master) => ({
        master,
      }));
    },

    effects(master) {
      // flavor only
    },
  },
];

export { events };
