export function aliveMasters(participants) {
  return participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );
}

export function aliveServants(participants) {
  return participants.filter(
    (p) => p.type === "servant" && p.status === "alive",
  );
}

export function masterWithServant(participants) {
  return aliveMasters(participants).map((master) => {
    const servant =
      participants.find(
        (p) =>
          p.type === "servant" &&
          p.masterId === master.id &&
          p.status === "alive",
      ) || null;

    return {
      master,
      servant,
    };
  });
}

export function masterPairs(participants) {
  const masters = aliveMasters(participants);
  const pairs = [];

  for (let i = 0; i < masters.length; i++) {
    for (let j = i + 1; j < masters.length; j++) {
      pairs.push({
        master1: masters[i],
        master2: masters[j],
      });
    }
  }

  return pairs;
}

export function servantPairs(participants) {
  const servants = aliveServants(participants);
  const pairs = [];

  for (let i = 0; i < servants.length; i++) {
    for (let j = i + 1; j < servants.length; j++) {
      pairs.push({
        servant1: servants[i],
        servant2: servants[j],
      });
    }
  }

  return pairs;
}

// =========================================
// SERVANT VS ENEMY MASTER
// =========================================

export function servantVsMaster(participants) {
  const servants = aliveServants(participants);
  const masters = aliveMasters(participants);
  const combinations = [];

  servants.forEach((servant) => {
    masters.forEach((master) => {
      // A servant cannot target their own master.
      if (servant.masterId === master.id) return;

      combinations.push({
        servant,
        master,
      });
    });
  });

  return combinations;
}

// =========================================
// SERVANT VS ENEMY TEAM
// =========================================

export function servantVsTeam(participants) {
  const servants = aliveServants(participants);
  const masters = aliveMasters(participants);
  const combinations = [];

  servants.forEach((servant1) => {
    masters.forEach((master2) => {
      if (servant1.masterId === master2.id) return;

      const servant2 = servants.find((p) => p.masterId === master2.id);

      if (!servant2) return;

      combinations.push({
        servant1,
        master2,
        servant2,
      });
    });
  });

  return combinations;
}

// =========================================
// THREE MASTERS VS AN ENEMY TEAM
// =========================================

export function threeMastersVsTeam(participants) {
  const masters = aliveMasters(participants);
  const combinations = [];

  for (let i = 0; i < masters.length; i++) {
    for (let j = i + 1; j < masters.length; j++) {
      for (let k = j + 1; k < masters.length; k++) {
        const master1 = masters[i];
        const master2 = masters[j];
        const master3 = masters[k];

        masters.forEach((master4) => {
          // All four masters must be different.
          if (
            master4.id === master1.id ||
            master4.id === master2.id ||
            master4.id === master3.id
          ) {
            return;
          }

          const servant = aliveServants(participants).find(
            (p) => p.masterId === master4.id,
          );

          if (!servant) return;

          combinations.push({
            master1,
            master2,
            master3,
            master4,
            servant,
          });
        });
      }
    }
  }

  return combinations;
}
