const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const scene = fs.readFileSync(path.join(__dirname,'../src/components/IsometricBackground.tsx'),'utf8');
test('scene materials are present',()=>{
  for(const name of ['detailMetal','detailBlade','detailCloud','detailAsphalt','detailWater','detailCanopy'])
    assert.ok(scene.includes('id="'+name+'"'),name);
});
test('all existing policy interactions and responsive camera remain',()=>{
  for(const name of ['getFreightCargoInfo(levels)','windLevel = levels[10]','forestryLevel = levels[13]','heavyVehiclesLevel = levels[2]','cameraWidth = Math.max(1200','useReducedMotion()'])
    assert.ok(scene.includes(name),name);
});
test('cloud animation avoids costly moving blur filter',()=>{
  assert.ok(!scene.includes('opacity="0.78" filter="url(#cloudDiffusion)"'));
});
