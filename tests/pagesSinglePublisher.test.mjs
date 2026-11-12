import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const pageWorkflow=readFileSync(new URL('.github/workflows/pages.yml',root),'utf8');
const ciWorkflow=readFileSync(new URL('.github/workflows/ci.yml',root),'utf8');
test('one Pages publisher: validate source but never create duplicate deployment',()=>{
 assert.match(pageWorkflow,/name: Validate Runegrave Pages source/);
 assert.match(pageWorkflow,/branches: \[main\]/);
 assert.match(pageWorkflow,/npm test/,'the branch-root publication remains test-verified');
 assert.doesNotMatch(pageWorkflow,/actions\/deploy-pages@/,'no second Pages deployment may fight GitHub branch publisher');
 assert.doesNotMatch(pageWorkflow,/actions\/upload-pages-artifact@/,'no duplicate Pages artifact may shadow the branch publisher');
 assert.match(ciWorkflow,/v00943_browser_audit\.py/,'real Chromium and mobile tests must remain mandatory');
 for(const path of ['index.html','styles.css','sw.js','manifest.webmanifest','js/main.js'])
  assert.ok(existsSync(new URL(path,root)),'branch Pages shell missing '+path);
});
