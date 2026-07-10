let DATA = {
  meta: null,
  observations: [],
  objects: [],
  locations: [],
  development: []
};
let currentObs = null;
const $ = id => document.getElementById(id);

async function loadJson(path) {
  const response = await fetch(path, {cache:"no-store"});
  if (!response.ok) throw new Error(`${path} kon niet worden geladen`);
  return response.json();
}

async function init() {
  try {
    const [meta, observations, objects, locations, development] = await Promise.all([
      loadJson("data/meta.json"),
      loadJson("data/observations.json"),
      loadJson("data/objects.json"),
      loadJson("data/locations.json"),
      loadJson("data/development.json")
    ]);

    DATA = {meta, observations, objects, locations, development};
    $("versionTitle").textContent = meta.version;
    $("versionSubtitle").textContent = meta.subtitle;
    $("logText").value = KompasStorage.getLog();

    bindEvents();
    renderObservations();
    KompasDevelopment.render($("developmentRows"), DATA.development);
  } catch (error) {
    console.error(error);
    showSection("error");
    $("errorText").textContent = error.message;
  }
}

function bindEvents() {
  $("navStart").onclick = () => showSection("start");
  $("navDevelopment").onclick = () => showSection("development");
  $("navLog").onclick = () => showSection("log");
  $("navNew").onclick = resetAll;
  $("backToStart").onclick = () => showSection("start");
  $("otherObservation").onclick = () => showSection("start");
  $("backStart").onclick = () => showSection("start");
  $("search").oninput = renderObservations;

  $("object").onchange = objectChanged;
  $("type").onchange = typeChanged;

  ["part","location","glassSide","glassZone","glassDistance","glassWeather"]
    .forEach(id => $(id).onchange = renderOutput);

  ["glassLength","extra"].forEach(id => $(id).oninput = renderOutput);

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.onclick = () => copyText(button.dataset.copy);
  });

  $("quickLog").onclick = quickLog;
  $("downloadLog").onclick = () => KompasLogbook.download($("logText").value);
  $("clearLog").onclick = () => {
    if (confirm("Logboek wissen?")) {
      $("logText").value = "";
      KompasStorage.setLog("");
    }
  };
  $("logText").oninput = () => KompasStorage.setLog($("logText").value);
}

function showSection(id) {
  ["start","form","development","log","error"]
    .forEach(section => $(section).classList.toggle("hidden", section !== id));
  if (id === "start") renderObservations();
}

function resetAll() {
  currentObs = null;
  $("search").value = "";
  $("extra").value = "";
  showSection("start");
}

function renderObservations() {
  const query = $("search").value.trim().toLowerCase();
  let html = "";

  [...new Set(DATA.observations.map(o => o.category))].forEach(category => {
    const items = DATA.observations.filter(item =>
      item.category === category && item.name.toLowerCase().includes(query)
    );
    if (!items.length) return;

    html += `<div class="group-title">${category}</div>`;
    items.forEach(item => {
      html += `
        <button data-observation="${item.id}">
          ${item.name}
          <span class="small">${item.cardType === "discussion" ? "Discussiekaart" : "Registratiekaart"}</span>
        </button>`;
    });
  });

  $("obsList").innerHTML = html || "<p>Geen waarneming gevonden.</p>";
  document.querySelectorAll("[data-observation]").forEach(button => {
    button.onclick = () => selectObservation(button.dataset.observation);
  });
}

function selectObservation(id) {
  currentObs = DATA.observations.find(item => item.id === id);
  $("obsTitle").textContent = currentObs.name;
  $("cardType").textContent = currentObs.cardType === "discussion"
    ? "Discussiekaart"
    : "Registratiekaart";

  $("object").innerHTML = DATA.objects.map(object =>
    `<option value="${object.id}">${object.name}</option>`
  ).join("");

  if (id === "beglazing_beschadigd") {
    $("object").value = "beglazing";
  }

  objectChanged();
  $("glassBlock").classList.toggle("hidden", id !== "beglazing_beschadigd");
  showSection("form");
  renderOutput();
}

function getObject() {
  return DATA.objects.find(object => object.id === $("object").value);
}

function objectChanged() {
  const object = getObject();
  $("type").innerHTML = object.types.map(type => `<option>${type}</option>`).join("");
  typeChanged();
}

function typeChanged() {
  const object = getObject();
  const type = $("type").value;
  const parts = object.partsByType ? object.partsByType[type] : (object.parts || []);

  $("part").innerHTML = parts.map(part => `<option>${part}</option>`).join("");
  $("location").innerHTML = DATA.locations.map(location => `<option>${location}</option>`).join("");

  if (currentObs && currentObs.id === "beglazing_beschadigd") {
    $("part").value = "Beglazing";
  }
  renderOutput();
}

function glassInput() {
  return {
    zone: $("glassZone").value,
    lengthMm: $("glassLength").value,
    distance: $("glassDistance").value,
    weather: $("glassWeather").value,
    side: $("glassSide").value,
    type: $("type").value,
    location: $("location").value
  };
}

function qualification() {
  if (!currentObs) return "";
  if (currentObs.id !== "beglazing_beschadigd") {
    return currentObs.defaultAdvice;
  }
  return KompasGlass.qualification(glassInput());
}

function description() {
  if (currentObs.id === "beglazing_beschadigd") {
    return KompasGlass.description(glassInput());
  }

  return KompasRegistry.description({
    observationId: currentObs.id,
    observationName: currentObs.name,
    objectName: getObject().name,
    type: $("type").value,
    part: $("part").value,
    location: $("location").value
  });
}

function renderOutput() {
  if (!currentObs) return;

  const title = KompasRegistry.title({
    qualification: qualification(),
    observation: currentObs.name,
    object: getObject().name,
    location: $("location").value
  });

  let descriptionText = description();
  const extra = $("extra").value.trim();
  if (extra) {
    descriptionText += `\nAanvullende toelichting inspecteur: ${extra}`;
  }

  $("titleOut").textContent = title;
  $("descOut").textContent = descriptionText;
  $("adviceOut").textContent = `KOMPAS-advies: ${qualification()}.`;

  const warning = KompasRegistry.warning({
    observationId: currentObs.id,
    part: $("part").value
  });
  $("warning").classList.toggle("hidden", !warning);
  $("warning").textContent = warning;

  if (currentObs.id === "beglazing_beschadigd") {
    const input = glassInput();
    const norm = KompasGlass.normInfo(input.zone, input.lengthMm);
    $("normResult").className = `notice ${norm.over ? "bad" : "ok"}`;
    $("normResult").textContent = norm.text;

    $("reasonWrap").classList.remove("hidden");
    $("reasonOut").textContent = KompasGlass.reasoning(input);
  } else {
    $("reasonWrap").classList.add("hidden");
    $("reasonOut").textContent = "";
  }
}

async function copyText(id) {
  try {
    await navigator.clipboard.writeText($(id).textContent);
    alert("Gekopieerd.");
  } catch {
    alert("Kopiëren lukte niet. Houd de tekst ingedrukt en kopieer handmatig.");
  }
}

function quickLog() {
  const note = prompt("Wat klopt niet of wat ontbreekt?");
  if (!note) return;

  const updated = KompasLogbook.add({
    observation: currentObs.name,
    object: getObject().name,
    type: $("type").value,
    part: $("part").value,
    location: $("location").value,
    note
  });

  $("logText").value = updated;
  alert("Toegevoegd aan het KOMPAS-logboek.");
}

init();
