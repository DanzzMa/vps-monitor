const test=require('node:test'),assert=require('node:assert/strict');test('payload contract',()=>{const n={name:'x',cpu:1,ram:2,disk:3};assert.equal(typeof n.cpu,'number');assert.ok(n.name)})
