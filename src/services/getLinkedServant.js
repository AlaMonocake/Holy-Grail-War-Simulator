export function getLinkedServant(participants, masterId) {
  console.log("LOOKING FOR:", masterId);

  console.log(
    "FOUND:",
    participants.find((p) => p.type === "servant" && p.masterId === masterId),
  );
  return participants.find(
    (p) => p.type === "servant" && p.masterId === masterId,
  );
}
