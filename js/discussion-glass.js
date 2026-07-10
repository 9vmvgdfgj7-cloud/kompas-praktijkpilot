window.KompasGlass = {
  normInfo(zone, lengthMm) {
    const len = Number(lengthMm || 0);
    if (zone === "R") {
      return {
        limit: null,
        over: false,
        text: "Voor zone R geldt voor lijnvormige fouten geen beperking in deze samenvatting."
      };
    }
    const limit = zone === "E" ? 30 : 15;
    const over = len > limit;
    return {
      limit,
      over,
      text: `Gemeten lengte: ${len} mm. Grens voor een individuele lijnvormige fout in zone ${zone}: ${limit} mm. De beschadiging is ${over ? "groter" : "kleiner of gelijk aan"} de grens voor deze zone.`
    };
  },

  qualification({ zone, lengthMm, distance, weather }) {
    if (weather !== "Diffuus daglicht / bewolkt") return "Constatering";
    if (distance === "Nee") return "Constatering";
    if (zone === "R") return "Constatering";
    return this.normInfo(zone, lengthMm).over ? "Opleverpunt" : "Constatering";
  },

  description({ type, location, side, zone, lengthMm, distance, weather }) {
    const norm = this.normInfo(zone, lengthMm);
    const visibility = distance === "Ja"
      ? "zichtbaar vanaf minimaal 3 meter"
      : "niet zichtbaar vanaf minimaal 3 meter";

    return [
      `Beschadiging waargenomen aan de beglazing van de ${type.toLowerCase()} in ${location.toLowerCase()}.`,
      `De beschadiging bevindt zich aan de ${side.toLowerCase()}, in zone ${zone}, is ${visibility} en is geconstateerd bij ${weather.toLowerCase()}.`,
      `De gemeten lengte bedraagt ${Number(lengthMm || 0)} mm.`,
      norm.text
    ].join(" ");
  },

  reasoning({ zone, lengthMm, distance, weather }) {
    const norm = this.normInfo(zone, lengthMm);
    const lines = [
      "Toetsingskader: beoordeling van meerbladig isolatieglas bij oplevering.",
      "Beoordeling op doorzicht, zonder vooraf markeren, vanaf minimaal 3 meter, zo loodrecht mogelijk en bij diffuus daglicht.",
      norm.text
    ];

    if (weather !== "Diffuus daglicht / bewolkt") {
      lines.push("De lichtomstandigheden wijken af van de beoordelingsmethode. De waarneming blijft geldig, maar KOMPAS adviseert daarom kwalificatie als constatering.");
    }
    if (distance === "Nee") {
      lines.push("De beschadiging is niet zichtbaar vanaf de minimale beoordelingsafstand. KOMPAS adviseert kwalificatie als constatering.");
    }
    if (zone === "R") {
      lines.push("De beschadiging ligt in zone R. In de gebruikte samenvatting geldt daar voor lijnvormige fouten geen beperking.");
    }
    if (weather === "Diffuus daglicht / bewolkt" && distance === "Ja" && zone !== "R") {
      lines.push(norm.over
        ? "De gemeten lengte overschrijdt de grens voor deze zone."
        : "De gemeten lengte blijft binnen de grens voor deze zone."
      );
    }
    return lines.join("\n");
  }
};
