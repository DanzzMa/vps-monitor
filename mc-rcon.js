const net=require('net');
let id=1;
function packet(type,payload){const body=Buffer.concat([Buffer.from([id&255,(id>>8)&255,(id>>16)&255,(id>>24)&255]),Buffer.from([type,0,0,0]),Buffer.from(payload),Buffer.from([0,0])]);const out=Buffer.alloc(4+body.length);out.writeInt32LE(body.length,0);body.copy(out,4);return out}
function read(buf){if(buf.length<4)return null;const n=buf.readInt32LE(0);if(buf.length<4+n)return null;return{packet:buf.subarray(4,4+n),rest:buf.subarray(4+n)}}
function rcon(host,port,password){return new Promise(resolve=>{let buf=Buffer.alloc(0),step=0,done=false,s=net.createConnection({host,port});const finish=x=>{if(!done){done=true;s.destroy();resolve(x)}};s.setTimeout(4000,()=>finish(null));s.on('error',()=>finish(null));s.on('data',chunk=>{buf=Buffer.concat([buf,chunk]);let r;while((r=read(buf))){buf=r.rest;const body=r.packet,type=body.readInt32LE(4),text=body.subarray(12,body.length-2).toString();if(type===-1)return finish(null);if(step===0){step=1;s.write(packet(2,'list'))}else return finish(text)}});s.on('connect',()=>s.write(packet(3,password)))} )}
module.exports=rcon;
