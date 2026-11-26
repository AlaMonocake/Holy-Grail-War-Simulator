import {
  aliveMasters,
  aliveServants,
  masterPairs,
  masterWithServant,
  servantPairs,
  servantVsMaster,
  servantVsTeam,
  threeMastersVsTeam,
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

    effects(master, servant) {
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
      // No immediate effect.
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
      const mushroomEvents = pastEvents.filter(
        (event) => event.definition.id === "poison_mushroom",
      );

      return mushroomEvents
        .filter((event) => {
          const poisonedMaster = event.participants.master;

          return (
            poisonedMaster &&
            poisonedMaster.status === "alive" &&
            !pastEvents.some(
              (pastEvent) =>
                ["poison_death", "poison_heal"].includes(
                  pastEvent.definition.id,
                ) && pastEvent.participants.master.id === poisonedMaster.id,
            )
          );
        })
        .map((event) => ({
          master: event.participants.master,
          servant: event.participants.servant,
        }));
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
      const mushroomEvents = pastEvents.filter(
        (event) => event.definition.id === "poison_mushroom",
      );

      return mushroomEvents
        .filter((event) => {
          const poisonedMaster = event.participants.master;

          return (
            poisonedMaster &&
            poisonedMaster.status === "alive" &&
            !pastEvents.some(
              (pastEvent) =>
                ["poison_death", "poison_heal"].includes(
                  pastEvent.definition.id,
                ) && pastEvent.participants.master.id === poisonedMaster.id,
            )
          );
        })
        .map((event) => ({
          master: event.participants.master,
          servant: event.participants.servant,
        }));
    },
    effects(master, servant) {
      // might add healing effects here later
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
      // Retreat only.
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
      // Flavor only.
    },
  },

  // =========================================
  // CHURCH AMBUSH
  // =========================================

  {
    id: "event_church_ambush",
    text: "{master1} runs for the church, but {master2} and {servant} ambush and kill {master1}.",
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
      // Flavor only.
    },
  },

  // =========================================
  // FLOWER PICKING
  // =========================================

  {
    id: "event_flower_picking",
    text: "{master} picks flowers.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return masterWithServant(participants);
    },

    effects(master, servant) {
      // Flavor only.
    },
  },

  // =========================================
  // SERVANT RAMPAGE
  // =========================================

  {
    id: "event_rampage",
    text: "{servant} goes on a rampage.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(({ servant }) => servant);
    },

    effects(master, servant) {
      // Flavor only.
    },
  },

  // =========================================
  // SERVANT RAMPAGE (MASTER KILLED)
  // =========================================

  {
    id: "event_rampage_master_killed",
    text: "{servant} goes on a rampage, killing {master}.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(
        ({ master, servant }) => master && servant,
      );
    },

    effects(master, servant) {
      master.status = "dead";

      if (!servant.hasIndependentAction) {
        servant.status = "dead";
      }
    },
  },

  // =========================================
  // FAMILIAR SCOUTING
  // =========================================

  {
    id: "event_send_familiar",
    text: "{master} sends out a familiar.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return masterWithServant(participants);
    },

    effects(master, servant) {
      // Flavor only.
    },
  },

  // =========================================
  // FAMILIAR OBSERVATION
  // =========================================

  {
    id: "event_observe_familiar",
    text: "{master} observes the city through a familiar.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return masterWithServant(participants);
    },

    effects(master, servant) {
      // Flavor only.
    },
  },

  // =========================================
  // SERVANT BETRAYAL
  // =========================================

  {
    id: "event_betrayal_nonlethal",
    text: "{servant} decides to betray {master}, but spares their life.",
    days: [3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(
        ({ master, servant }) => master && servant,
      );
    },

    effects(master, servant) {
      // Flavor only.
    },
  },

  // =========================================
  // SERVANT BETRAYAL (MASTER KILLED)
  // =========================================

  {
    id: "event_betrayal_murder",
    text: "{servant} decides to betray {master}, killing them.",
    days: [3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(
        ({ master, servant }) => master && servant,
      );
    },

    effects(master, servant) {
      master.status = "dead";
    },
  },

  // =========================================
  // COMMAND SEAL SUICIDE
  // =========================================

  {
    id: "event_command_seal_success",
    text: "{master} forces {servant} to commit suicide.",
    days: [3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(({ servant }) => servant);
    },

    effects(master, servant) {
      servant.status = "dead";
    },
  },

  // =========================================
  // COMMAND SEAL FAILURE
  // =========================================

  {
    id: "event_command_seal_failure",
    text: "{master} attempts to force {servant} to commit suicide, but fails and is killed instead.",
    days: [3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return masterWithServant(participants).filter(
        ({ master, servant }) => master && servant,
      );
    },

    effects(master, servant) {
      master.status = "dead";

      if (!servant.hasIndependentAction) {
        servant.status = "dead";
      }
    },
  },

  // =========================================
  // SERVANT HUNT (MASTER SPARED)
  // =========================================

  {
    id: "event_servant_hunt",
    text: "{master1}, {master2}, and {master3} track down and kill {master4}'s servant, but spare {master4}.",
    days: [3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return threeMastersVsTeam(participants);
    },

    effects(master1, master2, master3, master4, servant) {
      servant.status = "dead";
    },
  },

  // =========================================
  // SERVANT HUNT (MASTER ALSO KILLED)
  // =========================================

  {
    id: "event_servant_hunt_execution",
    text: "{master1}, {master2}, and {master3} track down and kill {master4}'s servant and {master4}.",
    days: [3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return threeMastersVsTeam(participants);
    },

    effects(master1, master2, master3, master4, servant) {
      servant.status = "dead";
      master4.status = "dead";
    },
  },

  // =========================================
  // SERVANT HUNT FAILURE
  // =========================================

  {
    id: "event_servant_hunt_failure",
    text: "{master1}, {master2}, and {master3} attempt to kill {master4}'s servant, but fail and are killed instead.",
    days: [3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return threeMastersVsTeam(participants);
    },

    effects(master1, master2, master3) {
      master1.status = "dead";
      master2.status = "dead";
      master3.status = "dead";
    },
  },

  // =========================================
  // SERVANT EATS MASTER
  // =========================================

  {
    id: "event_eat_master",

    text: "{servant} eats {master}.",

    // Keep the remaining properties as they are.

    valid(participants) {
      return servantVsMaster(participants);
    },

    effects(servant, master) {
      master.status = "dead";
    },
  },

  // =========================================
  // SERVANT CHASE
  // =========================================

  {
    id: "event_chase",
    text: "{servant1} chases {master2} and {servant2}.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return servantVsTeam(participants);
    },

    effects(servant1, master2, servant2) {
      // Flavor only.
    },
  },

  // =========================================
  // POISONED DRINK
  // =========================================

  {
    id: "event_poison_drink",
    text: "{servant} poisons {master}'s drink, killing {master}.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return servantVsMaster(participants);
    },

    effects(servant, master) {
      master.status = "dead";
    },
  },

  // =========================================
  // FROZEN LAKE
  // =========================================

  {
    id: "event_frozen_lake",
    text: "{master2} throws {master1} onto a frozen lake. The ice breaks and {master1} drowns.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return masterPairs(participants);
    },

    effects(master1, master2) {
      master1.status = "dead";
    },
  },

  // =========================================
  // BURIED ALIVE
  // =========================================

  {
    id: "event_buried_alive",
    text: "{servant} buries {master} alive.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return servantVsMaster(participants);
    },

    effects(servant, master) {
      master.status = "dead";
    },
  },

  // =========================================
  // BODY CONTROL
  // =========================================

  {
    id: "event_body_control",
    text: "{servant} takes control of {master}'s body and forces them to commit suicide.",
    days: [3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return servantVsMaster(participants);
    },

    effects(servant, master) {
      master.status = "dead";
    },
  },
  // =========================================
  // SERVANT BEGS FOR DEATH (KILLED)
  // =========================================

  {
    id: "event_servant_mercy_kill",

    text: "{servant1} begs {master2} to kill them. {master2} grants the request.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 2,

    requires: [],

    valid(participants) {
      const pairs = servantPairs(participants);

      return pairs
        .filter(({ servant1, servant2 }) => {
          return servant1.masterId !== servant2.masterId;
        })
        .map(({ servant1, servant2 }) => ({
          servant1,
          servant2,
          master2: participants.find(
            (p) => p.id === servant2.masterId && p.type === "master",
          ),
        }))
        .filter(({ master2 }) => master2 && master2.status === "alive");
    },

    effects(servant1, servant2, master2) {
      servant1.status = "dead";
    },
  },

  // =========================================
  // SERVANT BEGS FOR DEATH (SPARED)
  // =========================================

  {
    id: "event_servant_spared",

    text: "{servant1} begs {master2} to kill them, but {master2} spares {servant1}'s life.",

    days: [2, 3, 4, 5, 6, 7],

    weight: 2,

    requires: [],

    valid(participants) {
      const pairs = servantPairs(participants);

      return pairs
        .filter(({ servant1, servant2 }) => {
          return servant1.masterId !== servant2.masterId;
        })
        .map(({ servant1, servant2 }) => ({
          servant1,
          servant2,
          master2: participants.find(
            (p) => p.id === servant2.masterId && p.type === "master",
          ),
        }))
        .filter(({ master2 }) => master2 && master2.status === "alive");
    },

    effects(servant1, servant2, master2) {
      // No status changes. The Servant is spared.
    },
  },
  {
    id: "event_master_kills_servant",
    text: "{master1} somehow manages to overpower and kill {servant2}.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      const masters = aliveMasters(participants);
      const servants = aliveServants(participants);

      const validSets = [];

      masters.forEach((master1) => {
        servants.forEach((servant2) => {
          if (servant2.masterId === master1.id) return;

          validSets.push({ master1, servant2 });
        });
      });

      return validSets;
    },

    effects(master1, servant2) {
      servant2.status = "dead";
    },
  },
  {
    id: "event_knife_caught",
    text: "{master1} throws a knife at {master2}, but {servant2} catches it just in time!",
    days: [2, 3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return masterPairs(participants).flatMap(({ master1, master2 }) => {
        const servant2 = participants.find(
          (p) =>
            p.type === "servant" &&
            p.masterId === master2.id &&
            p.status === "alive",
        );

        const servant1 = participants.find(
          (p) =>
            p.type === "servant" &&
            p.masterId === master1.id &&
            p.status === "alive",
        );

        const sets = [];

        if (servant2) sets.push({ master1, master2, servant2 });
        if (servant1)
          sets.push({ master1: master2, master2: master1, servant2: servant1 });

        return sets;
      });
    },

    effects() {
      // The knife is caught. Nobody is harmed.
    },
  },
  // =========================================
  // HOUSE FIRE (MASTER KILLED)
  // =========================================

  {
    id: "event_house_fire_success",
    text: "{master1} sets fire to {master2}'s house. {master2} dies in the blaze.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 1,
    requires: [],

    valid(participants) {
      return masterPairs(participants);
    },

    effects(master1, master2) {
      master2.status = "dead";
    },
  },

  // =========================================
  // HOUSE FIRE (MASTER SURVIVES)
  // =========================================

  {
    id: "event_house_fire_failure",
    text: "{master1} sets fire to {master2}'s house, but {master2} escapes unharmed.",
    days: [2, 3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return masterPairs(participants);
    },

    effects(master1, master2) {
      // Master 2 escapes. No status changes.
    },
  },

  // =========================================
  // SERVANT STALKING
  // =========================================

  {
    id: "event_servant_stalking",
    text: "{servant1} stalks {servant2} from the shadows.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 3,
    requires: [],

    valid(participants) {
      return servantPairs(participants).filter(
        ({ servant1, servant2 }) => servant1.masterId !== servant2.masterId,
      );
    },

    effects(servant1, servant2) {
      // Flavor only.
    },
  },

  // =========================================
  // SCREAMING FOR HELP
  // =========================================

  {
    id: "event_scream_for_help",
    text: "{master} screams for help!",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      return aliveMasters(participants).map((master) => ({
        master,
      }));
    },

    effects(master) {
      // Flavor only.
    },
  },

  // =========================================
  // TEAMWORK (SERVANT KILLED)
  // =========================================

  {
    id: "event_teamwork_servant_kill",
    text: "{master1} and {master2} work together to kill {master3}'s servant, {servant3}.",
    days: [3, 4, 5, 6, 7],
    weight: 2,
    requires: [],

    valid(participants) {
      const masters = aliveMasters(participants);
      const servants = aliveServants(participants);
      const combinations = [];

      for (let i = 0; i < masters.length; i++) {
        for (let j = i + 1; j < masters.length; j++) {
          const master1 = masters[i];
          const master2 = masters[j];

          masters.forEach((master3) => {
            if (master3.id === master1.id || master3.id === master2.id) {
              return;
            }

            const servant3 = servants.find(
              (servant) => servant.masterId === master3.id,
            );

            if (!servant3) return;

            combinations.push({
              master1,
              master2,
              master3,
              servant3,
            });
          });
        }
      }

      return combinations;
    },

    effects(master1, master2, master3, servant3) {
      servant3.status = "dead";
    },
  },
  // NIGHT EVENTS

  {
    id: "night_share_mana",
    time: "night",
    text: "{master} shares mana with {servant}.",
    weight: 2,
    valid(participants) {
      return masterWithServant(participants);
    },
    effects(master, servant) {},
  },

  {
    id: "night_talk",
    time: "night",
    text: "{master} and {servant} spend the night talking about their lives.",
    weight: 2,
    valid(participants) {
      return masterWithServant(participants);
    },
    effects(master, servant) {},
  },

  {
    id: "night_servant_memories",
    time: "night",
    text: "{master} goes to sleep and sees {servant}'s memories.",
    weight: 2,
    valid(participants) {
      return masterWithServant(participants);
    },
    effects(master, servant) {},
  },

  {
    id: "night_cry_alone",
    time: "night",
    text: "{master} cries to sleep.",
    weight: 2,
    valid(participants) {
      return aliveMasters(participants).map((master) => ({ master }));
    },
    effects(master) {},
  },

  {
    id: "night_servant_comforts_master",
    time: "night",
    text: "{master} cries to sleep, and {servant} tries to comfort him.",
    weight: 2,
    valid(participants) {
      return masterWithServant(participants);
    },
    effects(master, servant) {},
  },

  {
    id: "night_shelter_accepted",
    time: "night",
    text: "{master1} begs {master2} to take him in for safety. {master2} agrees.",
    weight: 2,
    valid(participants) {
      return masterPairs(participants);
    },
    effects(master1, master2) {},
  },

  {
    id: "night_shelter_betrayal",
    time: "night",
    text: "{master1} begs {master2} to take him in for safety, but {master2} uses this opportunity to kill him.",
    weight: 2,
    valid(participants) {
      return masterPairs(participants);
    },
    effects(master1, master2) {
      master1.status = "dead";
    },
  },
  {
    id: "nightmares",
    time: "night",
    text: "{master} is awoken by nightmares.",
    days: [1, 2, 3, 4, 5, 6, 7],
    weight: 2,

    valid(participants) {
      return aliveMasters(participants).map((master) => ({
        master,
      }));
    },

    effects(master) {
      // Nothing happens.
    },
  },
];

export { events };
