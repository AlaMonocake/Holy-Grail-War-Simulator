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
