// =========================================
// BASIC TEAM
// =========================================

export function masterWithServant(participants) {
  const aliveMasters = participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

  return aliveMasters
    .map((master) => {
      const servant = participants.find(
        (p) =>
          p.type === "servant" &&
          p.masterId === master.id &&
          p.status === "alive",
      );

      if (!servant) return null;

      return { master, servant };
    })
    .filter(Boolean);
}

// =========================================
// MASTER VS MASTER
// =========================================

export function masterVsMaster(participants) {
  const masters = participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

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

// =========================================
// SERVANT VS MASTER (DIFFERENT TEAMS)
// =========================================

export function servantVsMaster(participants) {
  const servants = participants.filter(
    (p) => p.type === "servant" && p.status === "alive",
  );

  const masters = participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

  const combinations = [];

  servants.forEach((servant) => {
    masters.forEach((master) => {
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
// SERVANT VS OPPOSING TEAM
// =========================================

export function servantVsTeam(participants) {
  const servants = participants.filter(
    (p) => p.type === "servant" && p.status === "alive",
  );

  const masters = participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

  const combinations = [];

  servants.forEach((servant1) => {
    masters.forEach((master2) => {
      if (servant1.masterId === master2.id) return;

      const servant2 = participants.find(
        (p) =>
          p.type === "servant" &&
          p.masterId === master2.id &&
          p.status === "alive",
      );

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
// THREE MASTERS VS ANOTHER TEAM
// =========================================

export function threeMastersVsTeam(participants) {
  const masters = participants.filter(
    (p) => p.type === "master" && p.status === "alive",
  );

  const combinations = [];

  for (let i = 0; i < masters.length; i++) {
    for (let j = i + 1; j < masters.length; j++) {
      for (let k = j + 1; k < masters.length; k++) {
        const master1 = masters[i];
        const master2 = masters[j];
        const master3 = masters[k];

        masters.forEach((master4) => {
          // The target must be a different master.
          if (
            master4.id === master1.id ||
            master4.id === master2.id ||
            master4.id === master3.id
          ) {
            return;
          }

          const servant = participants.find(
            (p) =>
              p.type === "servant" &&
              p.masterId === master4.id &&
              p.status === "alive",
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
