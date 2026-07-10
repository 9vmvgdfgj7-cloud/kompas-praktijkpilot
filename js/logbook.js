window.KompasLogbook = {
  add(entry) {
    const current = KompasStorage.getLog();
    const block = [
      "",
      "---",
      `Datum: ${new Date().toLocaleString("nl-NL")}`,
      `Waarneming: ${entry.observation}`,
      `Object: ${entry.object}`,
      `Type: ${entry.type}`,
      `Onderdeel: ${entry.part}`,
      `Locatie: ${entry.location}`,
      `Opmerking: ${entry.note}`,
      ""
    ].join("\n");

    const updated = current + block;
    KompasStorage.setLog(updated);
    return updated;
  },

  download(value) {
    const blob = new Blob([value || ""], {type:"text/plain;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "KOMPAS_logboek.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }
};
