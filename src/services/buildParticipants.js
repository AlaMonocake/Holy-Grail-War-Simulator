export function buildParticipants(teams) {
  const participants = [];

  teams.forEach((team) => {
    // =========================
    // MASTER
    // =========================

    participants.push({
      id: team.id,

      name: team.name,

      picture: team.picture,

      type: "master",

      status: "alive",
    });

    // =========================
    // SERVANT
    // =========================

    if (team.servant) {
      participants.push({
        id: team.servant.id,

        name: team.servant.name,

        // Handles BOTH possible schemas
        picture: team.servant.picture || team.servant.image,

        type: "servant",

        status: "alive",

        masterId: team.id,

        hasIndependentAction: team.servant.hasIndependentAction,
      });
    }
  });

  return participants;
}
