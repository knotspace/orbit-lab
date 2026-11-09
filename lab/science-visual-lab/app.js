(()=>{'use strict';
const $=s=>document.querySelector(s),canvas=$('#scene'),ctx=canvas.getContext('2d');
const catalog=[
{name:'物理',tag:'PHYSICS',units:[
{name:'運動と力',topics:[
{id:'motion',name:'速さと運動',summary:'物体が移動する距離と時間の関係を、動く台車で観察する。',experiment:'速さを変えて、同じ時間で進む距離を比べよう。',principle:'速さは、単位時間あたりに進む距離。速さが一定なら距離は時間に比例する。',formula:'速さ = 距離 ÷ 時間',keywords:['速さ','距離','時間'],observe:'台車の位置が時間とともに変わる。',change:'速さのスライダーを動かして移動距離を比べる。',think:'速さを2倍にすると、同じ時間で進む距離は？',controls:[['速さ',1,10,4,'m/s']]},
{id:'force',name:'力と加速度',summary:'力の大きさと質量によって、物体の加速のしかたがどう変わるかを見る。',experiment:'力と質量をそれぞれ変え、加速度を比べよう。',principle:'同じ質量なら力が大きいほど加速度は大きく、同じ力なら質量が大きいほど加速度は小さい。',formula:'F = m × a',keywords:['力','質量','加速度'],observe:'台車が力を受けて加速する。',change:'力と質量を別々に変える。',think:'力を2倍、質量を同じにすると加速度は？',controls:[['力',1,10,5,'N'],['質量',1,10,5,'kg']]},
{id:'energy',name:'位置エネルギーと運動エネルギー',summary:'高さから落ちるボールの位置エネルギーが運動エネルギーへ移る様子を見る。',experiment:'高さを変え、落下時の速さの違いを比べよう。',principle:'摩擦などを無視すると、位置エネルギーと運動エネルギーの和は一定。',formula:'位置 E = mgh　／　運動 E = ½mv²',keywords:['エネルギー','高さ','保存'],observe:'ボールが落ちるほど速くなる。',change:'スタートする高さを変える。',think:'高さが4倍なら位置エネルギーは？',controls:[['高さ',1,10,7,'m']]}
]},
{name:'電流と回路',topics:[
{id:'circuit',name:'電流・電圧・抵抗',summary:'電池・抵抗・導線をつないだ回路で、電流と電圧の関係を確かめる。',experiment:'電圧と抵抗を変え、電流計の値がどう変わるか見よう。',principle:'抵抗が一定なら電圧が大きいほど電流は大きい。電圧が一定なら抵抗が大きいほど電流は小さい。',formula:'V = R × I',keywords:['電流','電圧','抵抗'],observe:'閉じた回路に電流が流れる。',change:'電圧・抵抗を変えて電流の大きさを見る。',think:'抵抗を2倍にすると電流はどうなる？',controls:[['電圧',1,12,6,'V'],['抵抗',1,12,4,'Ω']]},
{id:'series',name:'直列回路と並列回路',summary:'電流の通り道が1本の回路と枝分かれする回路を比べる。',experiment:'回路の方式を切り替え、豆電球の明るさを比べよう。',principle:'直列回路では電流は各部分で等しい。並列回路では枝分かれした電流の和が全体の電流になる。',formula:'直列：I₁=I₂　／　並列：I=I₁+I₂',keywords:['直列','並列','電流'],observe:'電流が回路を一周する。',change:'直列・並列を切り替える。',think:'並列回路で枝が増えると全体の抵抗は？',controls:[['電池の電圧',1,12,6,'V'],['抵抗',1,12,4,'Ω']]},
{id:'magnet',name:'電流と磁界',summary:'導線に電流を流すと、その周囲に磁界ができることを観察する。',experiment:'電流の向きを反転させ、磁界の向きがどうなるか見よう。',principle:'電流が流れる導線のまわりには同心円状の磁界ができ、電流の向きを逆にすると磁界の向きも逆になる。',formula:'右ねじの法則',keywords:['電流','磁界','右ねじ'],observe:'導線の周囲に磁力線が現れる。',change:'電流の向きを反転させる。',think:'電流を強くすると磁界の強さは？',controls:[['電流',1,10,5,'A']]}
]},
{name:'音と光',topics:[
{id:'wave',name:'音の波と振動',summary:'音の高さと大きさを、波形の振動数と振幅で見比べる。',experiment:'振動数と振幅を別々に変えて波形を観察しよう。',principle:'音の高さは振動数、大きさは振幅に関係する。',formula:'振動数 f = 1 ÷ 周期 T',keywords:['振動数','振幅','波形'],observe:'空気の振動が波として伝わる。',change:'高さと音量のつまみを変える。',think:'振幅だけを大きくすると音の高さは？',controls:[['振動数',1,10,5,'段階'],['振幅',1,10,5,'段階']]}
]}]},
{name:'化学',tag:'CHEMISTRY',units:[
{name:'物質の状態と粒子',topics:[
{id:'state',name:'固体・液体・気体',summary:'温度によって粒子の運動が変わり、物質の状態が変化する様子を粒子モデルで見る。',experiment:'温度を上げ下げし、粒子の動きと並び方を観察しよう。',principle:'温度が高いほど粒子の運動は活発になる。状態変化の前後で物質そのものが別の物質になるわけではない。',formula:'融解 ⇄ 凝固　／　蒸発 ⇄ 凝縮',keywords:['粒子','融解','蒸発'],observe:'粒子の並び方と動きが変わる。',change:'温度スライダーで状態を変える。',think:'水が沸騰している間、温度はどうなる？',controls:[['温度',0,100,25,'℃']]}
]},
{name:'原子・分子と化学変化',topics:[
{id:'atom',name:'原子と分子',summary:'原子が結びついて分子をつくるイメージを、色分けした粒子で確認する。',experiment:'水分子・酸素分子・水素分子の構成を切り替えよう。',principle:'物質は原子からできており、分子は複数の原子が結びついた粒子。',formula:'水 H₂O　／　酸素 O₂　／　水素 H₂',keywords:['原子','分子','化学式'],observe:'種類の違う原子が結びつく。',change:'分子モデルを選んで構成を比べる。',think:'水分子1個には水素原子が何個ある？',controls:[['分子モデル',1,3,1,'種類']]}
]},
{name:'化学反応と質量',topics:[
{id:'reaction',name:'化学反応と質量保存',summary:'反応の前後で原子の種類と数が変わらないことをモデルで見る。',experiment:'反応前と反応後を切り替えて、原子の数を数えよう。',principle:'化学変化の前後で原子の種類と数は変わらないため、閉じた系では全体の質量が保存される。',formula:'反応前の質量 = 反応後の質量',keywords:['化学変化','原子','質量保存'],observe:'粒子の組み替えで別の物質ができる。',change:'反応の進行度を変える。',think:'反応後に原子の数が減ることはある？',controls:[['反応の進行',0,100,50,'%']]}
]}
]},
{name:'生物',tag:'BIOLOGY',units:[
{name:'生物のからだ',topics:[
{id:'cell',name:'細胞のつくり',summary:'細胞膜・核・細胞質など、細胞をつくる基本構造を拡大して見る。',experiment:'植物細胞と動物細胞を切り替えて違いを探そう。',principle:'細胞は生物の体をつくる基本単位。植物細胞には細胞壁や葉緑体などが見られる。',formula:'細胞 → 組織 → 器官 → 個体',keywords:['細胞','核','葉緑体'],observe:'細胞の中にさまざまな構造がある。',change:'植物・動物の細胞を比べる。',think:'植物細胞にあって動物細胞にない構造は？',controls:[['細胞の種類',1,2,1,'種類']]}
]},
{name:'植物のはたらき',topics:[
{id:'photo',name:'光合成',summary:'光の強さによって光合成の進み方が変わる様子を、葉と気体の出入りで見る。',experiment:'光の強さを変え、酸素の発生量のモデルを比べよう。',principle:'植物は光エネルギーを使い、水と二酸化炭素からデンプンなどの有機物をつくり、酸素を放出する。',formula:'二酸化炭素 + 水 → 有機物 + 酸素（光）',keywords:['光合成','二酸化炭素','酸素'],observe:'光を受けた葉から酸素が出る。',change:'光の強さを変えて気泡の数を見る。',think:'光が全くないと光合成は進む？',controls:[['光の強さ',0,100,60,'%']]}
]},
{name:'生態系',topics:[
{id:'food',name:'食物連鎖と生態系',summary:'生産者から消費者へ、食物を通じてエネルギーが移る関係を見る。',experiment:'生物の数を変えて、生態系のバランスを考えよう。',principle:'食物連鎖では生物どうしが食べる・食べられる関係でつながり、物質とエネルギーが移動する。',formula:'生産者 → 消費者 → 分解者',keywords:['食物連鎖','生産者','消費者'],observe:'生物どうしが矢印でつながる。',change:'草食動物の数を変えて影響を見る。',think:'生産者が減ると他の生物にどんな影響がある？',controls:[['草食動物の数',1,10,5,'匹']]}
]}
]},
{name:'地学',tag:'EARTH SCIENCE',units:[
{name:'地球の活動',topics:[
{id:'plate',name:'プレートと地震',summary:'プレートが動き、境界付近に力がたまって地震が起きるしくみを模式的に見る。',experiment:'プレートの移動方向と速さを変えて境界を観察しよう。',principle:'地球表面は複数のプレートに分かれ、境界では沈み込み・広がり・横ずれなどが起きる。',formula:'プレート運動：年間数 cm 程度',keywords:['プレート','境界','地震'],observe:'プレートが動き、境界に変形が集まる。',change:'プレートの向きと移動量を変える。',think:'沈み込み帯ではどのような地形ができやすい？',controls:[['移動量',0,10,4,'cm/年']]}
]},
{name:'天気と水の循環',topics:[
{id:'water',name:'水の循環',summary:'蒸発・凝結・降水・流出をつないで、水が地球をめぐる流れを見る。',experiment:'太陽エネルギーを変えて蒸発の量を比べよう。',principle:'水は太陽エネルギーなどによって状態を変えながら、大気・陸・海の間を循環する。',formula:'蒸発 → 凝結 → 降水 → 流出',keywords:['蒸発','雲','降水'],observe:'水が蒸発し、雲になり、雨として戻る。',change:'加熱の強さを変える。',think:'水蒸気が冷やされるとどうなる？',controls:[['太陽エネルギー',0,100,55,'%']]}
]},
{name:'天体',topics:[
{id:'moon',name:'月の満ち欠け',summary:'太陽・地球・月の位置関係を変え、月の見える形が変わる理由を観察する。',experiment:'月の公転位置を動かし、地球から見える明るい部分を確認しよう。',principle:'月の形が変わるのは、太陽に照らされた月を地球から見る角度が変わるため。',formula:'新月 → 上弦 → 満月 → 下弦',keywords:['月','太陽光','公転'],observe:'月の位置によって明るい部分の見え方が変わる。',change:'月の位置スライダーを動かす。',think:'満月のとき、太陽・地球・月はどんな順？',controls:[['月の位置',0,360,180,'°']]},
{id:'season',name:'季節と地軸の傾き',summary:'地軸が傾いた地球が太陽の周りを公転すると、季節が変わるしくみを確認する。',experiment:'公転位置を変え、北半球に届く光の角度を比べよう。',principle:'季節は地球と太陽の距離だけで決まるのではなく、地軸の傾きによる日光の当たり方や昼の長さの違いで生じる。',formula:'地軸の傾き：約23.4°',keywords:['地軸','公転','日照時間'],observe:'地軸の傾きは公転中もほぼ同じ向きを保つ。',change:'公転位置を変えて北半球への日射を見る。',think:'夏は太陽が近いから暑い、という説明は正しい？',controls:[['公転位置',0,360,90,'°']]}
]}
]}
];
let field=0,unit=0,topic=0,values=[],raf=0,t=0,last=0,W=0,H=0,dpr=1;
function current(){return catalog[field].units[unit].topics[topic]}
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function options(el,arr,selected){el.innerHTML=arr.map((x,i)=>'<option value="'+i+'" '+(i===selected?'selected':'')+'>'+x+'</option>').join('')}
function renderSelectors(){options($('#field'),catalog.map(x=>x.name),field);options($('#unit'),catalog[field].units.map(x=>x.name),unit);options($('#topic'),catalog[field].units[unit].topics.map(x=>x.name),topic)}
function renderTopic(){const d=current();$('#title').textContent=d.name;$('#tag').textContent=catalog[field].tag+' / '+catalog[field].units[unit].name.toUpperCase();$('#summary').textContent=d.summary;$('#experiment').textContent=d.experiment;$('#principle').textContent=d.principle;$('#formula').textContent=d.formula;$('#observe').textContent=d.observe;$('#change').textContent=d.change;$('#think').textContent=d.think;$('#keywords').innerHTML=d.keywords.map(x=>'<span class="chip">'+x+'</span>').join('');values=d.controls.map(x=>x[3]);$('#controls').innerHTML=d.controls.map((x,i)=>'<div class="control"><label for="v'+i+'"><span>'+x[0]+'</span><output id="o'+i+'">'+x[3]+' '+x[4]+'</output></label><input id="v'+i+'" type="range" min="'+x[1]+'" max="'+x[2]+'" value="'+x[3]+'" step="1" data-i="'+i+'"></div>').join('');$('#controls').querySelectorAll('input').forEach(el=>el.addEventListener('input',e=>{const i=+e.target.dataset.i;values[i]=+e.target.value;$('#o'+i).textContent=values[i]+' '+d.controls[i][4];draw()}));$('#caption').textContent='LIVE MODEL · '+catalog[field].name.toUpperCase()+' / '+d.name.toUpperCase();draw()}
function text(s,x,y,size=12,color='#c4d7e2',align='left'){ctx.fillStyle=color;ctx.font=' '+size+'px system-ui';ctx.textAlign=align;ctx.fillText(s,x,y)}
function line(x1,y1,x2,y2,color='#7de4d1',width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function draw(){if(!W)return;const d=current(),v=values;ctx.clearRect(0,0,W,H);ctx.fillStyle='#091827';ctx.fillRect(0,0,W,H);for(let i=0;i<85;i++){circle((i*71%997)/997*W,(i*137%991)/991*H,1,'rgba(164,204,223,.2)')}const cx=W*.5,cy=H*.5,s=Math.min(W,H)*.35;
switch(d.id){
case'motion':{let speed=v[0]||4,x=W*.15+((t*speed*.035)%(W*.65));line(W*.1,cy+55,W*.9,cy+55,'#38576b',3);for(let i=0;i<8;i++)line(W*.1+i*W*.1,cy+50,W*.1+i*W*.1,cy+60,'#52748a',1);ctx.fillStyle='#78dcca';ctx.fillRect(x-25,cy+5,50,32);circle(x-13,cy+40,7,'#a5c5d3');circle(x+13,cy+40,7,'#a5c5d3');text('台車',x,cy-9,12,'#d8f7ef','center');text('速さ '+speed+' m/s',W*.1,cy-45,14);text('時間が経つほど移動距離が増える',W/2,H*.82,12,'#9bb4c6','center');break}
case'force':{let force=v[0],mass=v[1],acc=force/mass,x=W*.18+Math.min(W*.6,acc*W*.06);line(W*.1,cy+45,W*.9,cy+45,'#38576b',3);ctx.fillStyle='#7ac9ef';ctx.fillRect(x-30,cy-5,60,45);circle(x-18,cy+43,7,'#a5c5d3');circle(x+18,cy+43,7,'#a5c5d3');line(x+35,cy+15,x+35+force*7,cy+15,'#ffb37d',4);text('F = '+force+' N',x+35,cy-3,13,'#ffb37d');text('加速度 '+acc.toFixed(2)+' m/s²',W/2,H*.8,15,'#9cefe0','center');break}
case'energy':{let h=v[0],ballY=H*.18+(10-h)*H*.045;line(W*.2,H*.75,W*.8,H*.75,'#6b899d',3);line(W*.5,H*.2,W*.5,H*.75,'#4c687c',2);circle(W*.5,ballY,17,'#ffbd79');line(W*.5,ballY+20,W*.5,H*.75,'#6b899d',1);text('位置エネルギー '+(h*9.8).toFixed(1),W*.5,H*.12,14,'#ffcf9e','center');text('落下すると運動エネルギーが増える',W*.5,H*.88,12,'#9cefe0','center');break}
case'circuit':case'series':{let voltage=v[0],res=v[1],amp=voltage/res;ctx.strokeStyle='#79b9d6';ctx.lineWidth=4;ctx.strokeRect(W*.23,H*.28,W*.54,H*.4);ctx.fillStyle='#f6c66f';ctx.fillRect(W*.19,H*.43,38,55);text('＋',W*.21,H*.46,12,'#07111b','center');text('−',W*.21,H*.52,12,'#07111b','center');ctx.fillStyle='#f3a66f';ctx.fillRect(W*.48,H*.25,50,20);text('R',W*.505,H*.22,12,'#f3a66f','center');for(let i=0;i<Math.min(12,Math.round(amp*3));i++){let p=(t*.25+i/12)%1,x=W*.23+p*W*.54,y=p<.15?H*.28:p<.5?H*.28+(p-.15)/.35*H*.4:p<.85?H*.68-(p-.5)/.35*H*.4:H*.28;text('●',x,y,12,'#a4f3e3','center')}text('電流 I = '+amp.toFixed(2)+' A',W*.5,H*.84,16,'#9cefe0','center');break}
case'magnet':{let n=v[0];circle(W/2,H/2,5,'#ffb37d');for(let i=1;i<7;i++){ctx.strokeStyle='rgba(117,228,209,'+(.65-i*.07)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(W/2,H/2,i*25,0,Math.PI*2);ctx.stroke()}text('電流 '+n+' A',W/2,H*.82,14,'#9cefe0','center');text('磁界の向き ↻',W/2,H*.18,13,'#b4c8d5','center');break}
case'wave':{let freq=v[0],amp=v[1];ctx.beginPath();for(let x=0;x<W;x+=2){let y=H/2-Math.sin(x/W*Math.PI*2*freq/3+t)*amp*8;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle='#7ce4d2';ctx.lineWidth=3;ctx.stroke();line(0,H/2,W,H/2,'#35566a',1);text('振動数 '+freq+'　／　振幅 '+amp,W/2,H*.82,14,'#c2d8e5','center');break}
case'state':{let temp=v[0],phase=temp<33?0:temp<70?1:2,count=phase===0?36:phase===1?26:22;for(let i=0;i<count;i++){let x,y;if(phase===0){x=W*.25+(i%6)*W*.1;y=H*.3+Math.floor(i/6)*H*.12}else{x=rand(i+1)*W*.65+W*.17;y=rand(i+30)*H*.55+H*.2}let dx=phase===2?Math.sin(t+i)*12:phase===1?Math.sin(t*.6+i)*4:0;circle(x+dx,y,5,'#8fe5d6')}text(temp<33?'固体':temp<70?'液体':'気体',W/2,H*.82,20,'#d8f6ee','center');text('温度 '+temp+' ℃',W/2,H*.16,14,'#b4c8d5','center');break}
case'atom':{let types=['H₂O','O₂','H₂'],names=['水分子','酸素分子','水素分子'],k=v[0]-1;for(let j=0;j<5;j++){let x=W*.2+j*W*.15,y=H*.5+Math.sin(t+j)*12;if(k===0){line(x,y,x+19,y-10,'#9bb5c8',5);circle(x,y,11,'#e6f3fa');circle(x+20,y-10,7,'#f3a66f');circle(x+35,y,11,'#e6f3fa')}else{circle(x,y,13,k===1?'#f3a66f':'#e6f3fa');if(k===1)circle(x+19,y,13,'#f3a66f')}}text(names[k]+'　'+types[k],W/2,H*.82,18,'#9cefe0','center');break}
case'reaction':{let p=v[0]/100;for(let i=0;i<10;i++){let x=W*.18+i*W*.065,y=H*.38+(i%2)*H*.15;circle(x,y,10,i%2?'#ffb37d':'#7fc9ef')}text('反応前',W*.5,H*.2,15,'#c2d8e5','center');text('原子の数は反応の前後で変わらない',W*.5,H*.82,13,'#9cefe0','center');text(Math.round(p*100)+'% 反応進行',W*.5,H*.9,11,'#b4c8d5','center');break}
case'cell':{let plant=v[0]===1;ctx.fillStyle=plant?'#244e46':'#274765';ctx.strokeStyle=plant?'#8fe2ad':'#7fc9ef';ctx.lineWidth=5;ctx.beginPath();if(plant)ctx.roundRect(W*.22,H*.22,W*.56,H*.5,22);else ctx.ellipse(W/2,H/2,W*.3,H*.27,0,0,Math.PI*2);ctx.fill();ctx.stroke();circle(W/2,H/2,plant?27:31,'#b58de4');if(plant)for(let i=0;i<6;i++)circle(W*.3+(i%3)*W*.17,H*.32+Math.floor(i/3)*H*.28,8,'#80dc9c');text(plant?'植物細胞':'動物細胞',W/2,H*.84,16,'#c9e8f1','center');break}
case'photo':{let light=v[0];ctx.fillStyle='#2b674b';ctx.beginPath();ctx.ellipse(W*.5,H*.5,35,110,-.6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#9ce7b1';ctx.lineWidth=3;ctx.stroke();circle(W*.18,H*.3,25,'#ffd27c');for(let i=0;i<Math.round(light/8);i++){let x=W*.57+rand(i+2)*W*.3,y=H*.28+rand(i+70)*H*.45;circle(x,y,3,'#a5eee0')}text('光の強さ '+light+'%',W*.5,H*.85,14,'#9cefe0','center');text('酸素 O₂ ↑',W*.78,H*.2,13,'#a5eee0');break}
case'food':{let n=v[0];let nodes=[['植物',.2,.68],['草食動物',.5,.45],['肉食動物',.8,.22]];nodes.forEach((a,i)=>{circle(W*a[1],H*a[2],27,i===0?'#68b77c':i===1?'#d9b36c':'#d67e72');text(a[0],W*a[1],H*a[2]+48,12,'#c4d7e2','center')});line(W*.24,H*.64,W*.45,H*.49);line(W*.54,H*.42,W*.75,H*.27);text('個体数 '+n,W*.5,H*.88,14,'#9cefe0','center');break}
case'plate':{let shift=v[0];ctx.fillStyle='#b18a69';ctx.beginPath();ctx.moveTo(W*.05,H*.48);ctx.lineTo(W*.45,H*.48);ctx.lineTo(W*.5,H*.65);ctx.lineTo(W*.05,H*.65);ctx.fill();ctx.fillStyle='#6c9fbd';ctx.beginPath();ctx.moveTo(W*.5,H*.65);ctx.lineTo(W*.55,H*.48);ctx.lineTo(W*.95,H*.48);ctx.lineTo(W*.95,H*.65);ctx.fill();line(W*.25,H*.35,W*.25+shift*8,H*.35,'#ffb37d',4);line(W*.75,H*.35,W*.75-shift*5,H*.35,'#9cefe0',4);text('プレート境界',W/2,H*.82,15,'#c6d9e5','center');break}
case'water':{let k=v[0];ctx.fillStyle='#235c83';ctx.fillRect(0,H*.62,W,H*.38);circle(W*.18,H*.2,28,'#ffd27c');for(let i=0;i<Math.round(k/10);i++){let x=W*.3+rand(i+4)*W*.5,y=H*.58-rand(i+40)*H*.34;line(x,y,x-3,y-18,'#7ce4d2',2)}ctx.fillStyle='#9cb8cb';ctx.beginPath();ctx.ellipse(W*.68,H*.3,70,24,0,0,Math.PI*2);ctx.fill();text('蒸発 ↑　凝結 →　降水 ↓',W*.5,H*.87,14,'#d0e2ec','center');break}
case'moon':case'season':{let a=v[0]*Math.PI/180;circle(W*.5,H*.5,27,'#3b87b1');circle(W*.5,H*.5,23,'#6aa7c2');if(d.id==='moon'){circle(W*.82,H*.5,18,'#c4cbd0');ctx.fillStyle='#ffda8b';ctx.beginPath();ctx.arc(W*.18,H*.5,24,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0b1b2a';ctx.beginPath();ctx.arc(W*.82+Math.cos(a)*18,H*.5+Math.sin(a)*18,18,0,Math.PI*2);ctx.fill();text('月の位置 '+v[0]+'°',W/2,H*.84,14,'#c9dbe6','center')}else{ctx.save();ctx.translate(W*.5,H*.5);ctx.rotate(a);ctx.strokeStyle='#9cefe0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-75);ctx.lineTo(0,75);ctx.stroke();ctx.restore();circle(W*.18,H*.5,23,'#ffd27c');text('公転位置 '+v[0]+'°　地軸の傾き 23.4°',W/2,H*.84,13,'#c9dbe6','center')}break}
}
}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(now){if(document.hidden||reducedMotion)return;const dt=Math.min(40,now-last||16);last=now;t+=dt*.001;draw();raf=requestAnimationFrame(animate)}
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden&&!reducedMotion){last=performance.now();raf=requestAnimationFrame(animate)}});
$('#field').addEventListener('change',e=>{field=+e.target.value;unit=0;topic=0;renderSelectors();renderTopic()});$('#unit').addEventListener('change',e=>{unit=+e.target.value;topic=0;renderSelectors();renderTopic()});$('#topic').addEventListener('change',e=>{topic=+e.target.value;renderTopic()});$('#reset').onclick=()=>renderTopic();new ResizeObserver(resize).observe(canvas);renderSelectors();renderTopic();resize();if(!document.hidden&&!reducedMotion)raf=requestAnimationFrame(animate);
})();