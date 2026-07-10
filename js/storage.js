window.KompasStorage = {
  getLog() {
    return localStorage.getItem("kompas-logbook") || "";
  },
  setLog(value) {
    localStorage.setItem("kompas-logbook", value || "");
  }
};
