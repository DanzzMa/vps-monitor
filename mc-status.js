const net=require('net');
function vi(n){const a=[];do{let b=n&127;n>>>=7;if(n)b|=128;a.push(b)}while(n);return Buffer.from(a)}
function str(s){const b=Buffer.from(s);return Buffer.concat([vi(b.length),b])}
function packet(body){return Buffer.concat([vi(body.length),body])}
function readVi(b,o){let n=0,s=0,i=o;for(;i<b.length;i++){const x=b[i];n|=(x&127)<<s;if(!(x&128))return[n,i+1];s+=7;if(s>35)throw Error('bad varint')}throw Error('incomplete')}
function status(host,port){return new Promise(resolve=>{let data=Buffer.alloc(0),done=false;const finish=x=>{if(!done){done=true;s.destroy();resolve(x)}};const s=net.createConnection({host,port});s.setTimeout(4000,()=>finish(null));s.on('error',()=>finish(null));s.on('data',chunk=>{data=Buffer.concat([data,chunk]);try{const [len,start]=readVi(data,0);if(data.length<start+len)return;const [id,p]=readVi(data,start);if(id!==0)return finish(null);const [size,q]=readVi(data,p);const text=data.subarray(q,q+size).toString();const j=JSON.parse(text);finish({online:true,players:j.players,version:j.version?.name})}catch(e){if(e.message!=='incomplete')finish(null)}});s.on('connect',()=>{const handshake=Buffer.concat([vi(0),vi(767),str(host),Buffer.from([(port>>8)&255,port&255]),vi(1)]);s.write(packet(handshake));s.write(packet(Buffer.from([0])))});})}
module.exports=status;
