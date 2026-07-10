window.KompasRegistry = {
  title({ qualification, observation, object, location }) {
    return `${qualification} - ${observation} - ${object} - ${location}`;
  },

  description({ observationId, observationName, objectName, type, part, location }) {
    const typeLower = type.toLowerCase();
    const locationLower = location.toLowerCase();

    if (observationId === "manco") {
      return `${part} ontbreekt aan de ${typeLower} in ${locationLower}.`;
    }
    if (observationId === "niet_compleet") {
      return `${part} van de ${typeLower} in ${locationLower} is niet compleet.`;
    }
    if (observationId === "niet_afgemonteerd") {
      return `${objectName} in ${locationLower} is niet afgemonteerd.`;
    }
    if (observationId === "sluit_niet_aan") {
      return part === "Ventiel"
        ? `Ventiel sluit niet aan op het plafond in ${locationLower}.`
        : `${part} sluit niet aan in ${locationLower}.`;
    }
    return `${observationName} waargenomen op ${part.toLowerCase()} van de ${typeLower} in ${locationLower}.`;
  },

  warning({ observationId, part }) {
    const invalidForLak = ["Scharnier","Deurbeslag","Slot","Cilinder","Rubber","Beglazing"];
    if (observationId === "lakbeschadiging" && invalidForLak.includes(part)) {
      return "Gebruik hier waarschijnlijk ‘Beschadiging’ in plaats van ‘Lakbeschadiging’.";
    }
    return "";
  }
};
