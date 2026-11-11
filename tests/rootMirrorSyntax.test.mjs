import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,statSync,readFileSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
function jsfiles(dir){
 return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const f=join(dir,entry.name);
  if(entry.isDirectory())return jsfiles(f);
  return entry.isFile()&&entry.name.endsWith('.js')?[f]:[];
 });
}
test('every checked-in JS mirror is parseable as real JavaScript, never TypeScript-only syntax',()=>{
 const files=jsfiles(resolve(root,'js')).sort();
 assert.ok(files.length>=60,'the complete root Pages runtime tree must be checked');
 for(const file of files){
  const check=spawnSync(process.execPath,['--check',file],{encoding:'utf8',timeout:8000});
  assert.equal(check.status,0,relative(root,file)+' invalid JavaScript: '+check.stderr);
  const source=readFileSync(file,'utf8');
  assert.ok(!/\]!(?![=])/.test(source),relative(root,file)+' has a leftover TypeScript non-null assertion');
 }
});
test('both optional root Pages and Actions Pages caches advertise a safe corrective offline revision',()=>{
 const a=readFileSync(join(root,'sw.js'),'utf8');
 const b=readFileSync(join(root,'public','sw.js'),'utf8');
 assert.match(a,/runegrave-shell-v0\.09\.33/);
 assert.equal(a,b,'the optional root Pages runtime must not diverge in service-worker cache');
 assert.ok(a.includes('scene/sagaExpression.js')&&a.includes('scene/sagaGateArt.js'));
 assert.ok(a.includes('scene/sagaFloorFrieze.js')&&a.includes('scene/sagaWeaponAtlas.js'));
 assert.ok(readFileSync(join(root,'js','scene','sagaFloorFrieze.js'),'utf8').includes('paintSagaFloorFrieze'));
 assert.ok(readFileSync(join(root,'js','scene','sagaWeaponAtlas.js'),'utf8').includes('paintEnemySagaWeapon'));
});
