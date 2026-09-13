const fs=require('fs');
let t=fs.readFileSync('src/views.ts','utf8');
let count=0;
t=t.replaceAll('data-path="tracking" href="#"', 'data-path="tracking" href="#" onclick="window.forceShowView && window.forceShowView(\'view-tracking\'); return false;"');
fs.writeFileSync('src/views.ts',t,'utf8');
console.log('patched', (t.match(/forceShowView/g)||[]).length);
