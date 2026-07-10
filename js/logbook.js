window.KompasLogbook={
add(e){const c=KompasStorage.getLog(),b=["","---",`Datum: ${new Date().toLocaleString("nl-NL")}`,`Waarneming: ${e.observation}`,`Object: ${e.object}`,`Type: ${e.type}`,`Onderdeel: ${e.part}`,`Locatie: ${e.location}`,`Opmerking: ${e.note}`,""].join("\n"),u=c+b;KompasStorage.setLog(u);return u},
download(v){const b=new Blob([v||""],{type:"text/plain;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="KOMPAS_logboek.txt";a.click()}
};