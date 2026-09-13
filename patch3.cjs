const fs=require('fs');
let t=fs.readFileSync('src/views.ts','utf8');
let orig=t;
t=t.replace('>LACAK PARCEL & RUTE PENGIRIMAN // TRACK LIVE WAYPOINT<', ' data-path="tracking">LACAK PARCEL & RUTE PENGIRIMAN // TRACK LIVE WAYPOINT<');
t=t.replace('>BUKA PELACAKAN →<', ' data-path="tracking">BUKA PELACAKAN →<');
// also ensure modal button has data-path, if not replaced second time, try alternative
if(t===orig) console.log('no replace');
else console.log('replaced', (t.match(/data-path="tracking"/g)||[]).length);
fs.writeFileSync('src/views.ts',t,'utf8');
