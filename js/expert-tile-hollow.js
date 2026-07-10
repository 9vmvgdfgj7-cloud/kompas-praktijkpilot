window.KompasTileHollow={
input(v){return{kind:v.kind,location:v.location,count:Math.max(1,Number(v.count||1)),connected:v.connected,movement:v.movement,loose:v.loose,crack:v.crack,jointDamage:v.jointDamage,levelDifference:v.levelDifference}},
qualification(i){if(i.movement==="Ja"||i.loose==="Ja"||i.crack==="Ja"||i.jointDamage==="Ja"||i.levelDifference==="Ja")return"Opleverpunt";return"Constatering"},
titleObject(i){return i.kind==="Vloertegelwerk"?"Vloertegelwerk":"Wandtegelwerk"},
description(i){
const plural=i.count===1?"tegel":"tegels";
const verb=i.count===1?"klinkt":"klinken";
let s=`Bij lichte beklopping ${verb} ${i.count} ${plural} van het ${i.kind.toLowerCase()} in ${i.location.toLowerCase()} afwijkend en hol ten opzichte van de omliggende tegels.`;
const extras=[];
extras.push(i.connected==="Ja"?"De tegels liggen aaneengesloten.":"De tegels liggen niet aaneengesloten.");
extras.push(i.movement==="Ja"?"Beweging is waarneembaar.":"Er is geen beweging waarneembaar.");
if(i.loose==="Ja")extras.push("Minimaal één tegel ligt aantoonbaar los.");
if(i.crack==="Ja")extras.push("Scheurvorming is aanwezig.");
if(i.jointDamage==="Ja")extras.push("Voegschade is aanwezig.");
if(i.levelDifference==="Ja")extras.push("Daarnaast is een hoogteverschil aanwezig; dit betreft een afzonderlijke afwijking.");
return s+" "+extras.join(" ");
},
technical(i){return[
"Een afwijkend, hol klinkend geluid is op zichzelf geen rechtstreeks bewijs dat het tegelwerk niet voldoet.",
"Uitvoeringsrichtlijn 35-101 stelt eisen aan het minimale lijmcontactoppervlak: 80% voor vloertegelwerk, 95% bij dubbelzijdige verlijming of vloeibedlijm en 65% voor wandtegelwerk.",
"Met alleen bekloppen kan het werkelijke lijmcontactoppervlak niet betrouwbaar worden vastgesteld. Daarom beoordeelt KOMPAS ook bijkomende verschijnselen, zoals beweging, een aantoonbaar losse tegel, scheurvorming, voegschade of een afzonderlijk hoogteverschil."
].join("\n\n")},
source(){return"Bron: SKG-IKOB Uitvoeringsrichtlijn 35-101, ‘Het aanbrengen van wand- en vloertegelwerk in reguliere binnentoepassing’, paragraaf 6.5 (minimaal lijmcontactoppervlak) en hoofdstuk 7 (eisen aan het gerede tegelwerk)."},
why(i){
const reasons=[];
if(i.movement==="Ja")reasons.push("beweging is waargenomen");
if(i.loose==="Ja")reasons.push("een tegel ligt aantoonbaar los");
if(i.crack==="Ja")reasons.push("scheurvorming is aanwezig");
if(i.jointDamage==="Ja")reasons.push("voegschade is aanwezig");
if(i.levelDifference==="Ja")reasons.push("een afzonderlijk hoogteverschil is aanwezig");
if(reasons.length)return`Naast het afwijkende geluid is/zijn ${reasons.join(", ")}. Daarom adviseert KOMPAS deze waarneming als opleverpunt vast te leggen.`;
let extra=i.count>1&&i.connected==="Ja"?" Het gaat om meerdere aaneengesloten tegels; daarom is duidelijke vastlegging wenselijk.":"";
return"Er is uitsluitend een afwijkend, hol klinkend geluid vastgesteld. Zonder bijkomende verschijnselen kan daarmee niet worden vastgesteld dat het tegelwerk niet voldoet. KOMPAS adviseert daarom een constatering."+extra;
},
reasoning(i){return this.technical(i)+"\n\n"+this.why(i)}
};