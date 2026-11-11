const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const PORT=Number(process.env.PORT||3088), TOKEN=process.env.MONITOR_TOKEN||'change-this-long-token';
const alerts=new Map(), nodes=new Map();
const json=(res,code,data)=>{res.writeHead(code,{'content-type':'application/json'});res.end(JSON.stringify(data))};
function authorized(req){return req.headers.authorization===`Bearer ${TOKEN}`||url.parse(req.url,true).query.token===TOKEN}
function alert(node,metric,value,limit){const key=`${node.name}:${metric}`;if(value<limit||alerts.has(key))return;if(process.env.DISCORD_WEBHOOK_URL)fetch(process.env.DISCORD_WEBHOOK_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({content:`⚠️ ${node.name}: ${metric} ${value}% (batas ${limit}%)`})}).catch(()=>{});alerts.set(key,Date.now())}
const server=http.createServer((req,res)=>{const p=url.parse(req.url).pathname;
 if(p==='/'){res.writeHead(200,{'content-type':'text/html'});return res.end(fs.readFileSync(path.join(__dirname,'public/index.html')))}
 if(p==='/api/nodes'&&req.method==='GET')return json(res,200,[...nodes.values()].map(n=>({...n,online:Date.now()-n.received<30000})));
 if(p==='/api/metrics'&&req.method==='POST'){if(!authorized(req))return json(res,401,{error:'unauthorized'});let b='';req.on('data',x=>b+=x);req.on('end',()=>{try{const n=JSON.parse(b);if(!n.name||typeof n.cpu!=='number')throw Error();n.received=Date.now();nodes.set(n.name,n);alert(n,'CPU',n.cpu,Number(process.env.ALERT_CPU||90));alert(n,'RAM',n.ram,Number(process.env.ALERT_RAM||90));alert(n,'Disk',n.disk,Number(process.env.ALERT_DISK||90));json(res,200,{ok:true})}catch{json(res,400,{error:'invalid payload'})}});return}
 json(res,404,{error:'not found'})});
server.listen(PORT,'0.0.0.0',()=>console.log(`VPS monitor listening on ${PORT}`));
