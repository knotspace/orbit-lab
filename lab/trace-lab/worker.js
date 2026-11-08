const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization"};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const auth=(r,e)=>!!e.ADMIN_KEY&&r.headers.get("Authorization")==="Bearer "+e.ADMIN_KEY;
const makeId=()=>crypto.randomUUID().replace(/-/g,"").slice(0,20);
const makeOwnerToken=()=>crypto.randomUUID().replace(/-/g,"")+crypto.randomUUID().replace(/-/g,"").slice(0,8);
const cleanUrl=value=>{try{const u=new URL(value);return ["https:","http:"].includes(u.protocol)?u.href:null}catch{return null}};
export default {
 async scheduled(event,env,ctx){ctx.waitUntil((async()=>{const cutoff=new Date(Date.now()-24*60*60*1000).toISOString();await env.DB.prepare("DELETE FROM visits WHERE link_id IN (SELECT id FROM links WHERE created_at <= ?)").bind(cutoff).run();await env.DB.prepare("DELETE FROM links WHERE created_at <= ?").bind(cutoff).run();})());},
 async fetch(req,env){
  if(req.method==="OPTIONS")return new Response(null,{headers:cors});
  const u=new URL(req.url),p=u.pathname;
  if(p==="/api/create"&&req.method==="POST"){
   let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
   const mode=b.mode==="redirect"?"redirect":"surprise";
   const destination=mode==="redirect"?cleanUrl(b.destination):null;
   if(mode==="redirect"&&!destination)return json({error:"転送先URLはhttp/httpsで指定してください"},400);
   const id=makeId(),ownerToken=makeOwnerToken();
   await env.DB.prepare("INSERT INTO links (id,mode,destination,created_at) VALUES (?,?,?,?)").bind(id,mode,destination||"",new Date().toISOString()).run();
   await env.DB.prepare("INSERT INTO link_owners (link_id,owner_token) VALUES (?,?)").bind(id,ownerToken).run();
   return json({id,mode,ownerToken,expiresAt:new Date(Date.now()+24*60*60*1000).toISOString()});
  }
  if(p==="/api/visit"&&req.method==="POST"){
   let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
   if(typeof b.id!=="string"||!/^[a-f0-9]{20}$/.test(b.id))return json({error:"Invalid link"},400);
   const link=await env.DB.prepare("SELECT id,mode,destination,created_at FROM links WHERE id=?").bind(b.id).first();
   if(!link)return json({error:"このURLは存在しないか、すでに失効しています。"},404);
   if(Date.now()-Date.parse(link.created_at)>=24*60*60*1000)return json({error:"このURLは発行から24時間が経過したため失効しました。"},410);
   const ip=req.headers.get("CF-Connecting-IP")||"unavailable",cf=req.cf||{};
   let geo={};
   if(ip!=="unavailable"){try{const r=await fetch("https://ipwho.is/"+encodeURIComponent(ip));const d=await r.json();if(d.success)geo={country:d.country||"",region:d.region||"",city:d.city||"",isp:d.connection?.isp||"",org:d.connection?.org||"",asn:d.connection?.asn||""};}catch{}}
   const country=geo.country||cf.country||"",region=geo.region||cf.region||"",city=geo.city||cf.city||"";
   let regionLabel=region,cityLabel=city;
   if((country==="Japan"||cf.country==="JP")&&city){try{const gr=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(city)+"&count=5&language=ja&format=json");const gj=await gr.json();const match=(gj.results||[]).find(x=>x.country_code==="JP"&&(!region||!x.admin1||x.admin1.toLowerCase()===region.toLowerCase()))||(gj.results||[]).find(x=>x.country_code==="JP");if(match){cityLabel=match.name||city;regionLabel=match.admin1||region;}}catch{}}
   const prefectures={"Hokkaido":"北海道","Aomori":"青森県","Iwate":"岩手県","Miyagi":"宮城県","Akita":"秋田県","Yamagata":"山形県","Fukushima":"福島県","Ibaraki":"茨城県","Tochigi":"栃木県","Gunma":"群馬県","Saitama":"埼玉県","Chiba":"千葉県","Tokyo":"東京都","Kanagawa":"神奈川県","Niigata":"新潟県","Toyama":"富山県","Ishikawa":"石川県","Fukui":"福井県","Yamanashi":"山梨県","Nagano":"長野県","Gifu":"岐阜県","Shizuoka":"静岡県","Aichi":"愛知県","Mie":"三重県","Shiga":"滋賀県","Kyoto":"京都府","Osaka":"大阪府","Hyogo":"兵庫県","Nara":"奈良県","Wakayama":"和歌山県","Tottori":"鳥取県","Shimane":"島根県","Okayama":"岡山県","Hiroshima":"広島県","Yamaguchi":"山口県","Tokushima":"徳島県","Kagawa":"香川県","Ehime":"愛媛県","Kochi":"高知県","Fukuoka":"福岡県","Saga":"佐賀県","Nagasaki":"長崎県","Kumamoto":"熊本県","Oita":"大分県","Miyazaki":"宮崎県","Kagoshima":"鹿児島県","Okinawa":"沖縄県"};
   regionLabel=prefectures[regionLabel]||regionLabel;
   if(cityLabel&&country==="Japan"&&!/[市区町村]$/.test(cityLabel))cityLabel+="市";
   if(regionLabel&&!regionLabel.endsWith("県")&&!regionLabel.endsWith("都")&&!regionLabel.endsWith("府")&&regionLabel!=="北海道"&&country==="Japan")regionLabel+="県";
   const visitRecordId=makeId();
   await env.DB.prepare("INSERT INTO visits (id,link_id,ip,country,region,city,isp,org,asn,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
    .bind(visitRecordId,link.id,ip,country,region,city,geo.isp||"",geo.org||"",geo.asn||"",new Date().toISOString()).run();
   return json({mode:link.mode,destination:link.destination,visitRecordId,ip,region:region||"地域不明",city:city||"市区町村不明",regionLabel:regionLabel||"地域不明",cityLabel:cityLabel||"市区町村不明",country:country||"不明",isp:geo.isp||"不明"});
  }
  if(p==="/api/details"&&req.method==="POST"){
   let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
   if(typeof b.visitRecordId!=="string"||!/^[a-f0-9]{20}$/.test(b.visitRecordId))return json({error:"Invalid visit"},400);
   const message=typeof b.message==="string"?b.message.trim().slice(0,1000):"";
   const birthDate=typeof b.birthDate==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(b.birthDate)?b.birthDate:"";
   const gender=["男性","女性","その他","回答しない"].includes(b.gender)?b.gender:"";
   const visit=await env.DB.prepare("SELECT v.id,l.created_at,l.mode FROM visits v JOIN links l ON l.id=v.link_id WHERE v.id=?").bind(b.visitRecordId).first();
   if(!visit||visit.mode!=="surprise")return json({error:"回答先が見つかりません"},404);
   if(Date.now()-Date.parse(visit.created_at)>=24*60*60*1000)return json({error:"このリンクは失効しました"},410);
   await env.DB.prepare("CREATE TABLE IF NOT EXISTS visit_details (visit_id TEXT PRIMARY KEY,message TEXT,birth_date TEXT,gender TEXT,FOREIGN KEY(visit_id) REFERENCES visits(id) ON DELETE CASCADE)").run();
   await env.DB.prepare("INSERT INTO visit_details (visit_id,message,birth_date,gender) VALUES (?,?,?,?) ON CONFLICT(visit_id) DO UPDATE SET message=excluded.message,birth_date=excluded.birth_date,gender=excluded.gender").bind(b.visitRecordId,message,birthDate,gender).run();
   return json({ok:true});
  }
  if(p==="/api/gps"&&req.method==="POST"){
   let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
   if(typeof b.visitRecordId!=="string"||!/^[a-f0-9]{20}$/.test(b.visitRecordId)||typeof b.latitude!=="number"||typeof b.longitude!=="number"||Math.abs(b.latitude)>90||Math.abs(b.longitude)>180)return json({error:"Invalid GPS coordinates"},400);
   const cutoff=new Date(Date.now()-24*60*60*1000).toISOString();
   const result=await env.DB.prepare("UPDATE visits SET gps_lat=?,gps_lon=?,gps_at=? WHERE id=? AND link_id IN (SELECT id FROM links WHERE created_at > ?)").bind(b.latitude,b.longitude,new Date().toISOString(),b.visitRecordId,cutoff).run();
   if(!result.meta?.changes)return json({error:"Visit record not found"},404);
   return json({ok:true});
  }
  if(p==="/api/owner-results"&&req.method==="GET"){
   const token=u.searchParams.get("token")||"";
   if(!/^[a-f0-9]{40}$/.test(token))return json({error:"確認URLが正しくありません"},400);
   const owner=await env.DB.prepare("SELECT o.link_id,l.created_at FROM link_owners o JOIN links l ON l.id=o.link_id WHERE o.owner_token=?").bind(token).first();
   if(!owner)return json({error:"確認URLが無効か、リンクが削除されています"},404);
   if(Date.now()-Date.parse(owner.created_at)>=24*60*60*1000)return json({error:"この確認URLは発行から24時間が経過したため失効しました。"},410);
   await env.DB.prepare("CREATE TABLE IF NOT EXISTS visit_details (visit_id TEXT PRIMARY KEY,message TEXT,birth_date TEXT,gender TEXT,FOREIGN KEY(visit_id) REFERENCES visits(id) ON DELETE CASCADE)").run();
   const q=await env.DB.prepare("SELECT v.id,v.link_id,l.mode,v.ip,v.country,v.region,v.city,v.isp,v.org,v.asn,v.gps_lat,v.gps_lon,v.gps_at,v.created_at,d.message,d.birth_date,d.gender FROM visits v JOIN links l ON l.id=v.link_id LEFT JOIN visit_details d ON d.visit_id=v.id WHERE v.link_id=? ORDER BY v.created_at DESC LIMIT 200").bind(owner.link_id).all();
   const rows=q.results||[];
   const translated=await Promise.all(rows.map(async x=>{let regionLabel=x.region||"",cityLabel=x.city||"";if(x.country==="Japan"&&x.city){try{const z=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(x.city)+"&count=5&language=ja&format=json");const j=await z.json();const m=(j.results||[]).find(y=>y.country_code==="JP");if(m){cityLabel=m.name||cityLabel;regionLabel=m.admin1||regionLabel;}}catch{}}const prefectures={"Hokkaido":"北海道","Aomori":"青森県","Iwate":"岩手県","Miyagi":"宮城県","Akita":"秋田県","Yamagata":"山形県","Fukushima":"福島県","Ibaraki":"茨城県","Tochigi":"栃木県","Gunma":"群馬県","Saitama":"埼玉県","Chiba":"千葉県","Tokyo":"東京都","Kanagawa":"神奈川県","Niigata":"新潟県","Toyama":"富山県","Ishikawa":"石川県","Fukui":"福井県","Yamanashi":"山梨県","Nagano":"長野県","Gifu":"岐阜県","Shizuoka":"静岡県","Aichi":"愛知県","Mie":"三重県","Shiga":"滋賀県","Kyoto":"京都府","Osaka":"大阪府","Hyogo":"兵庫県","Nara":"奈良県","Wakayama":"和歌山県","Tottori":"鳥取県","Shimane":"島根県","Okayama":"岡山県","Hiroshima":"広島県","Yamaguchi":"山口県","Tokushima":"徳島県","Kagawa":"香川県","Ehime":"愛媛県","Kochi":"高知県","Fukuoka":"福岡県","Saga":"佐賀県","Nagasaki":"長崎県","Kumamoto":"熊本県","Oita":"大分県","Miyazaki":"宮崎県","Kagoshima":"鹿児島県","Okinawa":"沖縄県"};regionLabel=prefectures[regionLabel]||regionLabel;if(x.country==="Japan"&&cityLabel&&!/[市区町村]$/.test(cityLabel))cityLabel+="市";return {...x,region_label:regionLabel,city_label:cityLabel};}));
   return json({results:translated});
  }
  if(p==="/api/results"&&req.method==="GET"){
   if(!auth(req,env))return json({error:"Unauthorized"},401);
   const q=await env.DB.prepare("SELECT v.id,v.link_id,l.mode,v.ip,v.country,v.region,v.city,v.isp,v.org,v.asn,v.gps_lat,v.gps_lon,v.gps_at,v.created_at FROM visits v LEFT JOIN links l ON l.id=v.link_id ORDER BY v.created_at DESC LIMIT 200").all();
   return json({results:q.results||[]});
  }
  return json({error:"Not found"},404);
 }
};