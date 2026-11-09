/** Optional branch-source fallback: keep public static Pages assets in repository root. */
import { cpSync, copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const name of ['js','art','icons']) cpSync(resolve(root,'dist',name),resolve(root,name),{recursive:true,force:true});
for(const name of ['manifest.webmanifest','sw.js']) copyFileSync(resolve(root,'dist',name),resolve(root,name));
// Root index.html and styles.css are source files and are already in the branch root.
if(!existsSync(resolve(root,'.nojekyll')))writeFileSync(resolve(root,'.nojekyll'),'');
console.log('Mirrored the built runtime to root for GitHub Pages main/(root) publishing.');
