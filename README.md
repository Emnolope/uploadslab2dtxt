# uploadslab2dtxt
A small utility to convert between Obsidian and my Slab2d(outdated) Web app

This shit aggregates backlink lists and dumps them in exports for ai context.
```javascript
(async(links)=>{const dv=app.plugins.plugins.dataview.api;console.log(`[1/5] Dataview API hooked`);const d=new Date();const dateStr=d.toISOString().replace(/[:\-T.Z]/g,"").slice(0,14);const outputFilePath=`exports/${dateStr}_${links.join(' ')}.md`;console.log(`[2/5] Date generated: ${dateStr}`);const queryString=links.map(l=>`[[${l}]] or "${l}"`).join(' or ');const pages=Array.from(dv.pages(queryString)).sort((a,b)=>a.file.name.localeCompare(b.file.name));console.log(`[3/5] Query identified ${pages.length} files matching: ${queryString}`);let monolith="";for(let page of pages){const file=app.vault.getAbstractFileByPath(page.file.path);if(file){const content=await app.vault.read(file);monolith+=`# \`${file.basename}\`\n${content}\n\n`;}}console.log(`[4/5] Monolith constructed. Total string length: ${monolith.length} chars.`);await app.vault.create(outputFilePath,monolith);console.log(`[5/5] Success. Exported to: ${outputFilePath}`);})(["Link 1", "Link 2", "Link 3"]);
