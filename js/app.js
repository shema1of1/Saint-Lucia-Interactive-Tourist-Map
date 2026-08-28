const map=L.map('map',{zoomControl:true,minZoom:8,maxZoom:19}).setView([13.99,-60.98],11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const saintLuciaBounds=[[13.70,-61.10],[14.30,-60.75]];map.setMaxBounds(saintLuciaBounds);

// 360MAP original presentation layer. Bus routes remain intentionally paused.
const categoryLayers={Beauty:L.layerGroup(),Events:L.layerGroup(),Food:L.layerGroup(),['Getting Around']:L.layerGroup(),Lodging:L.layerGroup(),['Police Stations']:L.layerGroup()};
Object.values(categoryLayers).forEach(l=>l.addTo(map));
const categoryColors={Beauty:'#d56a9c',Events:'#7b61b7',Food:'#e58a36','Getting Around':'#4d91c6',Lodging:'#5c9b72','Police Stations':'#4c5964'};

// Approved 360MAP artwork with descriptive repository filenames.
const original360Icons={
  Beauty:'assets/icons/beauty-barber.png',
  Events:'assets/icons/events.png',
  Food:'assets/icons/restaurant.png',
  'Getting Around':'assets/icons/transport-hub.png',
  Lodging:'assets/icons/lodging.png',
  'Police Stations':'assets/icons/police.png'
};

function markerIcon(category){
  const iconUrl=original360Icons[category];
  if(iconUrl){return L.icon({iconUrl,iconSize:[48,48],iconAnchor:[24,44],popupAnchor:[0,-42]});}
  return L.divIcon({className:'custom-marker',html:`<div style="width:28px;height:28px;border-radius:50%;background:${categoryColors[category]};border:3px solid white;box-shadow:0 2px 7px rgba(0,0,0,.35);display:grid;place-items:center;color:white;font-size:11px;font-weight:800">${category[0]}</div>`,iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-14]});
}
function addPOI(category,name,lat,lng,description=''){return L.marker([lat,lng],{icon:markerIcon(category)}).bindPopup(`<div class="poi-popup"><h3>${name}</h3><p><b>${category}</b></p>${description?`<p>${description}</p>`:''}</div>`).addTo(categoryLayers[category]);}

// Only independently sourced/approved POIs should be added below.
document.querySelectorAll('.key-item').forEach(btn=>btn.addEventListener('click',()=>{const c=btn.dataset.category;const layer=categoryLayers[c];if(map.hasLayer(layer)){map.removeLayer(layer);btn.classList.remove('active')}else{layer.addTo(map);btn.classList.add('active')}}));
document.getElementById('resetBtn').addEventListener('click',()=>map.fitBounds(saintLuciaBounds));
document.getElementById('locateBtn').addEventListener('click',()=>map.locate({setView:true,maxZoom:16,enableHighAccuracy:true}));
map.on('locationerror',()=>alert('Your location could not be determined. Please allow location access in your browser.'));
