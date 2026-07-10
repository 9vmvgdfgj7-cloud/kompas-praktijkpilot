let DATA = null;
let currentObs = null;
const $ = id => document.getElementById(id);

async function loadData() {
  const response = await fetch("data/kompas-data.json");
  DATA = await response.json();
  $("versionTitle").textContent = DATA.version;
  bindEvents();
  renderObs();
  renderDevelopmentList();
}

function bindEvents() {
  $("navStart").onclick = () => showSection("start");
  $("navDevelopment").onclick = () => showSection("development");
  $("navLog").onclick = () => showSection("log");
  $("navNew").onclick = resetAll;
  $("search").oninput = renderObs;
  $("object").onchange = objectChanged;
  $("type").onchange = typeChanged;
  ["part","location","glassSide","glassZone","glassLength","glassDistance","glassWeather","extra"]
    .forEach(id => $(id).addEventListener(id === "glassLength" || id === "extra" ? "input" : "change", renderOutput));
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.onclick = () => copyEl(btn.dataset.copy);
  });
  $("quickLog").onclick = quickLog;
  $("otherObservation").onclick = () => showSection("start");
  $("downloadLog").onclick = downloadLog;
  $("backStart").onclick = () => showSection("start");
}

function showSection(id) {
  ["start","form","development","log"].forEach(x => $(x).classList.toggle("hidden", x !== id));
  if (id === "start") renderObs();
}

function resetAll() {
  currentObs = null;
  $("search").value = "";
  $("extra").value = "";
  showSection("start");
}

function renderObs() {
  if (!DATA) return;
  const q = $("search").value.toLowerCase();
  let out = "";
  [...new Set(DATA.observations.map(o => o.category))].forEach(cat => {
    const items = DATA.observations.filter(o => o.category === cat && o.name.toLowerCase().includes(q));
    if (!items.length) return;
    out += `<div class="group">${cat}</div>`;
    items.forEach(o => {
      out += `<button data-observation="${o.id}">${o.name}<span class="small">${o.type === "discussion" ? "Discussiekaart" : "Registratiekaart"}</span></button>`;
    });
  });
  $("obsList").innerHTML = out || "<p>Geen waarneming gevonden.</p>";
  document.querySelectorAll("[data-observation]").forEach(btn => {
    btn.onclick = () => selectObs(btn.dataset.observation);
  });
}

function selectObs(id) {
  currentObs = DATA.observations.find(o => o.id === id);
  $("obsTitle").textContent = currentObs.name;
  $("cardType").textContent = currentObs.type === "discussion" ? "Discussiekaart" : "Registratiekaart";
  $("object").innerHTML = DATA.objects.map(o => `<option value="${o.id}">${o.name}</option>`).join("");
  if (id === "beglazing_beschadigd") $("object").value = "beglazing";
  objectChanged();
  $("glassBlock").classList.toggle("hidden", id !== "beglazing_beschadigd");
  showSection("form");
  renderOutput();
}

function getObj() {
  return DATA.objects.find(o => o.id === $("object").value);
}

function objectChanged() {
  const obj = getObj();
  $("type").innerHTML = obj.types.map(t => `<option>${t}</option>`).join("");
  typeChanged();
}

function typeChanged() {
  const obj = getObj();
  const type = $("type").value;
  const parts = obj.partsByType ? obj.partsByType[type] : (obj.parts || []);
  $("part").innerHTML = parts.map(p => `<option>${p}</option>`).join("");
  $("location").innerHTML = DATA.locations.map(l => `<option>${l}</option>`).join("");
  if (currentObs && currentObs.id === "beglazing_beschadigd") $("part").value = "Beglazing";
  renderOutput();
}

function qualification() {
  if (!currentObs) return "";
  if (currentObs.id !== "beglazing_beschadigd") return "Opleverpunt";
  return KompasGlass.qualification({
    zone: $("glassZone").value,
    lengthMm: $("glassLength").value,
    distance: $("glassDistance").value,
    weather: $("glassWeather").value
  });
}

function titleText() {
  return `${qualification()} - ${currentObs.name} - ${getObj().name} - ${$("location").value}`;
}

function descriptionText() {
  const obj = getObj();
  const type = $("type").value;
  const part = $("part").value;
  const location = $("location").value;
  let text;

  if (currentObs.id === "manco") {
    text = `${part} ontbreekt aan de ${type.toLowerCase()} in ${location.toLowerCase()}.`;
  } else if (currentObs.id === "niet_compleet") {
    text = `${part} van de ${type.toLowerCase()} in ${location.toLowerCase()} is niet compleet.`;
  } else if (currentObs.id === "niet_afgemonteerd") {
    text = `${obj.name} in ${location.toLowerCase()} is niet afgemonteerd.`;
  } else if (currentObs.id === "sluit_niet_aan") {
    text = part === "Ventiel"
      ? `Ventiel sluit niet aan op het plafond in ${location.toLowerCase()}.`
      : `${part} sluit niet aan in ${location.toLowerCase()}.`;
  } else if (currentObs.id === "beglazing_beschadigd") {
    text = KompasGlass.description({
      type,
      location,
      side: $("glassSide").value,
      zone: $("glassZone").value,
      lengthMm: $("glassLength").value,
      distance: $("glassDistance").value,
      weather: $("glassWeather").value
    });
  } else {
    text = `${currentObs.name} waargenomen op ${part.toLowerCase()} van de ${type.toLowerCase()} in ${location.toLowerCase()}.`;
  }

  const extra = $("extra").value.trim();
  return extra ? `${text}\nAanvullende toelichting inspecteur: ${extra}` : text;
}

function adviceText() {
  return `KOMPAS-advies: ${qualification()}.`;
}

function reasonText() {
  if (!currentObs || currentObs.id !== "beglazing_beschadigd") return "";
  return KompasGlass.reasoning({
    zone: $("glassZone").value,
    lengthMm: $("glassLength").value,
    distance: $("glassDistance").value,
    weather: $("glassWeather").value
  });
}

function renderOutput() {
  if (!currentObs) return;
  $("titleOut").textContent = titleText();
  $("descOut").textContent = descriptionText();
  $("adviceOut").textContent = adviceText();

  const reason = reasonText();
  $("reasonWrap").classList.toggle("hidden", !reason);
  $("reasonOut").textContent = reason;

  if (currentObs.id === "beglazing_beschadigd") {
    const norm = KompasGlass.normInfo($("glassZone").value, $("glassLength").value);
    $("normResult").className = `note ${norm.over ? "bad" : "ok"}`;
    $("normResult").textContent = norm.text;
  }

  $("warning").classList.add("hidden");
  const invalidForLak = ["Scharnier","Deurbeslag","Slot","Cilinder","Rubber","Beglazing"];
  if (currentObs.id === "lakbeschadiging" && invalidForLak.includes($("part").value)) {
    $("warning").innerHTML = "<strong>Let op vakterm.</strong><br>Gebruik hier waarschijnlijk ‘Beschadiging’ in plaats van ‘Lakbeschadiging’.";
    $("warning").classList.remove("hidden");
  }
}

function copyEl(id) {
  navigator.clipboard.writeText($(id).textContent).then(() => alert("Gekopieerd."));
}

function quickLog() {
  const note = prompt("Wat klopt niet of wat ontbreekt?");
  if (!note) return;
  const entry = [
    "",
    "---",
    `Waarneming: ${currentObs.name}`,
    `Object: ${getObj().name}`,
    `Type: ${$("type").value}`,
    `Onderdeel: ${$("part").value}`,
    `Locatie: ${$("location").value}`,
    `Opmerking: ${note}`,
    ""
  ].join("\n");
  $("logText").value += entry;
  alert("Toegevoegd aan het KOMPAS-logboek.");
}

function downloadLog() {
  const blob = new Blob([$("logText").value], {type:"text/plain;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "KOMPAS_logboek_v1_2.txt";
  a.click();
}

function renderDevelopmentList() {
  $("developmentRows").innerHTML = DATA.developmentList
    .map(item => `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>`)
    .join("");
}

loadData().catch(err => {
  console.error(err);
  alert("KOMPAS kon de gegevens niet laden. Controleer of alle projectbestanden zijn geüpload.");
});
