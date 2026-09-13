const fs=require('fs');
let t=fs.readFileSync('src/views.ts','utf8');
// fix second button malformed
t=t.replace('href="#"><span class="material-symbols-outlined text-[16px]">route</span data-path="tracking">BUKA', 'data-path="tracking" href="#"><span class="material-symbols-outlined text-[16px]">route</span>BUKA');
// ensure first button also has correct order - if it currently is href="#" data-path, normalize to data-path first? but both work, let's ensure it's data-path before href for consistency
t=t.replace('href="#" data-path="tracking">LACAK', 'data-path="tracking" href="#">LACAK');
// also check if first button still missing - ensure it has data-path
if(!t.includes('LACAK PARCEL & RUTE PENGIRIMAN // TRACK LIVE WAYPOINT') || !t.includes('data-path="tracking"')){
  console.log('still missing tracking');
}
fs.writeFileSync('src/views.ts',t,'utf8');
console.log('fixed', (t.match(/data-path="tracking"/g)||[]).length);
