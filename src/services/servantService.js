export async function fetchServantData() {
  const url = "https://api.atlasacademy.io/export/NA/basic_servant.json";

  try {
    console.log("Fetching Servant List...");

    const response = await fetch(url);

    const servantsList = await response.json();

    if (!Array.isArray(servantsList)) {
      console.error("Invalid response:", servantsList);

      return [];
    }

    return servantsList.map((servant) => ({
      id: servant.id,
      name: servant.name,
      picture: servant.face,
      hasIndependentAction: servant.hasIndependentAction || false,
    }));
  } catch (error) {
    console.error("Error fetching servant data:", error);

    return [];
  }
}
