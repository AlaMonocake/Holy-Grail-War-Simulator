const servantCache = [];

let loaded = false;

// LOAD ONCE

export async function loadServants() {
  if (loaded) {
    return servantCache;
  }

  console.log("Fetching Servant List...");

  const response = await fetch(
    "https://api.atlasacademy.io/export/NA/basic_servant.json",
  );

  const data = await response.json();

  // FILTER INVALID ENTRIES

  const filtered = data.filter(
    (servant) => servant.name && servant.face && servant.className,
  );

  // NORMALIZE DATA

  const normalized = filtered.map((servant) => ({
    id: servant.id,

    name: servant.name,

    picture: servant.face,

    servantClass: servant.className,

    hasIndependentAction: false,
  }));

  servantCache.push(...normalized);

  loaded = true;

  console.log("Servants cached:", servantCache.length);

  return servantCache;
}

// GET RANDOM SERVANT

export function getRandomServant() {
  if (!loaded) {
    throw new Error("Servants not loaded yet.");
  }

  const randomIndex = Math.floor(Math.random() * servantCache.length);

  return servantCache[randomIndex];
}

// ACCESS ENTIRE CACHE

export function getServants() {
  return servantCache;
}
