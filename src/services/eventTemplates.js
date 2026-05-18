import { getLinkedServant } from "./getLinkedServant";

export function masterWithServant(participants) {
  return participants
    .filter((p) => p.type === "master" && p.status === "alive")
    .map((master) => {
      const servant = getLinkedServant(participants, master.id);

      if (!servant) return null;

      return {
        master,
        servant,
      };
    })
    .filter(Boolean);
}
