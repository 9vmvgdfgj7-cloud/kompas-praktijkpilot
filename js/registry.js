window.KompasRegistry={
title({qualification,observation,object,location}){return `${qualification} - ${observation} - ${object} - ${location}`},
description({observationId,observationName,objectName,type,part,location}){
const t=type.toLowerCase(),l=location.toLowerCase();
if(observationId==="manco")return `${part} ontbreekt aan de ${t} in ${l}.`;
if(observationId==="niet_compleet")return `${part} van de ${t} in ${l} is niet compleet.`;
if(observationId==="niet_afgemonteerd")return `${objectName} in ${l} is niet afgemonteerd.`;
if(observationId==="sluit_niet_aan")return part==="Ventiel"?`Ventiel sluit niet aan op het plafond in ${l}.`:`${part} sluit niet aan in ${l}.`;
return `${observationName} waargenomen op ${part.toLowerCase()} van de ${t} in ${l}.`;
},
warning({observationId,part}){const x=["Scharnier","Deurbeslag","Slot","Cilinder","Rubber","Beglazing"];return observationId==="lakbeschadiging"&&x.includes(part)?"Gebruik hier waarschijnlijk ‘Beschadiging’ in plaats van ‘Lakbeschadiging’.":""}
};