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

test('new railway foreground uses two independently visible services', () => {
  const railway = fs.readFileSync(path.join(__dirname,'../src/components/RailwayScene.tsx'),'utf8');
  assert.ok(scene.includes('<RailwayScene heavyVehiclesLevel={heavyVehiclesLevel}'));
  assert.ok(railway.includes('Two-track railway with passenger and freight trains'));
  assert.ok(railway.includes('initial={false}'));
  assert.ok(!railway.includes('opacity: [0, 1, 1, 0]'));
});
test('train livery and cargo track policy levers', () => {
  const railway = fs.readFileSync(path.join(__dirname,'../src/components/RailwayScene.tsx'),'utf8');
  for (const marker of ['heavyVehiclesLevel >= 2', 'heavyVehiclesLevel >= 4', "FreightCargoId", 'kind={freightCargo}', 'RailwayScene']) {
    assert.ok(railway.includes(marker), marker);
  }
});

test('trains visibly shuttle faster with brighter larger rolling stock', () => {
  const railway = fs.readFileSync(path.join(__dirname,'../src/components/RailwayScene.tsx'),'utf8');
  for (const marker of ['x: [0, passengerTravel, 0]', 'x: [freightTravel, 0, freightTravel]', 'passengerDuration = isLongTrain', 'freightDuration = isLongTrain', 'scale(1.43)', 'scale(1.49)', 'length: 35']) {
    assert.ok(railway.includes(marker), marker);
  }
  assert.ok(!railway.includes('opacity: [0, 1, 1, 0]'));
});
