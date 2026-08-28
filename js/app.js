const map=L.map('map',{zoomControl:true,minZoom:8,maxZoom:19}).setView([13.99,-60.98],11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const saintLuciaBounds=[[13.70,-61.10],[14.30,-60.75]];map.setMaxBounds(saintLuciaBounds);

// 360MAP original presentation layer. Bus route lines remain intentionally paused.
const categoryLayers={Beauty:L.layerGroup(),Events:L.layerGroup(),Food:L.layerGroup(),['Getting Around']:L.layerGroup(),Lodging:L.layerGroup(),
Park:L.layerGroup(),['Police Stations']:L.layerGroup()};
Object.values(categoryLayers).forEach(l=>l.addTo(map));
const categoryColors={Beauty:'#d56a9c',Events:'#7b61b7',Food:'#e58a36','Getting Around':'#4d91c6',Lodging:'#5c9b72','Police Stations':'#4c5964'};

const original360Icons={
  Beauty:'assets/icons/beauty-barber.png',
  Events:'assets/icons/events.png',
  Food:'assets/icons/restaurant.png',
  'Getting Around':'assets/icons/transport-hub.png',
  Lodging:null,
  Park:'assets/icons/park.png',
  'Police Stations':'assets/icons/police.png'
};

function markerIcon(category){
  const iconUrl=original360Icons[category];
  if(iconUrl){return L.icon({iconUrl,iconSize:[48,48],iconAnchor:[24,44],popupAnchor:[0,-42]});}
  return L.divIcon({className:'custom-marker',html:`<div style="width:28px;height:28px;border-radius:50%;background:${categoryColors[category]};border:3px solid white;box-shadow:0 2px 7px rgba(0,0,0,.35);display:grid;place-items:center;color:white;font-size:11px;font-weight:800">${category[0]}</div>`,iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-14]});
}
function addPOI(category,name,lat,lng,description=''){return L.marker([lat,lng],{icon:markerIcon(category)}).bindPopup(`<div class="poi-popup"><h3>${name}</h3><p><b>${category}</b></p>${description?`<p>${description}</p>`:''}</div>`).addTo(categoryLayers[category]);}

// Castries bus-station labels transcribed from Sherma's route/station table.
// Coordinates come from the project's government bus-stop point dataset, with user-verified corrections below.
const stationDetails={
 '1A':['Gros Islet','Jean Baptiste St.'],'1B':['Baboneau','Castries Market'],'1D':['Gran Riviere','Castries Market'],'1E':['Monchy','Jean Baptiste St.'],'1F':['Bisse','Castries Market'],
 '2A':['Bexon/Marc','Jean Baptiste St. / Jeremie St.'],'2B':['Dennery Valley','Micoud St / Bridge St'],'2C':['Dennery Village','Mongiraud St / Micoud St'],'2H':['Vieux Fort','Hospital Rd'],
 '3A':['La Croix','Peynier St / St. Louis'],'3B':['JacMel','Victoria / Chisel St'],'3C':['Millet','Mongiraud St / Brazil St'],'3D':['Anse La Raye','Brazil / Bridge'],'3E':['Canaries','Castries Market'],'3F':['Soufriere','Jeremie St Plaza'],
 '5A':['Morne Du Don','Jeremie St / Chaussee'],'5B':['Rockhall / Arundel Hill','Coral / Highest'],'5C':['Fond Assau','Entrepot Bus Stop'],'5D':['Marchand / Forestiere / Guesneau','Chisel St / Maryam'],'5E':['La Clery','Chisel / Brazil St'],'5F':['Morne','St. Louis and High St']
};
const busStationLayer=L.layerGroup().addTo(map);
const routeColors={'1':'#1677d2','2':'#16834a','3':'#f28b12','5':'#6d2bb8'};
function busStationIcon(route){const color=routeColors[route[0]]||'#34495e';return L.divIcon({className:'bus-station-marker',html:`<div style="min-width:30px;height:30px;padding:0 5px;border-radius:15px;background:${color};border:3px solid white;box-shadow:0 2px 7px rgba(0,0,0,.4);display:grid;place-items:center;color:white;font:800 11px/1 sans-serif">${route}</div>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-18]});}
if(typeof json_bus_stop_2!=='undefined'){
 json_bus_stop_2.features.forEach(feature=>{
  const route=feature.properties.ID;
  const info=stationDetails[route];
  if(!info || route==='5C')return;
  const [lng,lat]=feature.geometry.coordinates;
  L.marker([lat,lng],{icon:busStationIcon(route),title:`Route ${route} — ${info[0]}`})
   .bindPopup(`<div class="poi-popup"><h3>Route ${route} — ${info[0]}</h3><p><b>Castries Station:</b> ${info[1]}</p></div>`)
   .addTo(busStationLayer);
 });
}

// User-verified downtown Castries placement: 5C at Entrepot Bus Stop.
L.marker([14.00824,-60.98795],{icon:busStationIcon('5C'),title:'Route 5C — Fond Assau'})
 .bindPopup('<div class="poi-popup"><h3>Route 5C — Fond Assau</h3><p><b>Castries Station:</b> Entrepot Bus Stop</p></div>')
 .addTo(busStationLayer);

// User-verified Route 5 stand toward Leslie Land Road.
L.marker([14.00774,-60.98717],{icon:busStationIcon('5'),title:'Route 5 — Cedars / Ravine Chabot'})
 .bindPopup('<div class="poi-popup"><h3>Route 5 — Cedars / Ravine Chabot</h3><p><b>Castries Station:</b> toward Leslie Land Rd.</p></div>')
 .addTo(busStationLayer);

// Only independently sourced/approved POIs should be added below.
addPOI(
  'Park',
  'Derek Walcott Square',
  14.008837,
  -60.990788,
  'Public square in central Castries'
);
addPOI( 'Park', 'Serenity Park', 14.016014, -60.991191, 'Public square in Castries'
document.querySelectorAll('.key-item').forEach(btn=>btn.addEventListener('click',()=>{const c=btn.dataset.category;const layer=categoryLayers[c];if(map.hasLayer(layer)){map.removeLayer(layer);btn.classList.remove('active')}else{layer.addTo(map);btn.classList.add('active')}}));
document.getElementById('resetBtn').addEventListener('click',()=>map.fitBounds(saintLuciaBounds));
document.getElementById('locateBtn').addEventListener('click',()=>map.locate({setView:true,maxZoom:16,enableHighAccuracy:true}));
map.on('locationerror',()=>alert('Your location could not be determined. Please allow location access in your browser.'));
