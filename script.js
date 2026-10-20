'use strict';
const INITIAL=[{name:'Partido A',votes:650000},{name:'Partido B',votes:480000},{name:'Partido C',votes:290000},{name:'Partido D',votes:160000},{name:'Partido E',votes:65000}];
const COLORS=['#4a66e8','#e86b65','#26a69a','#f3b84d','#a274d7','#e786b8','#588ba8','#84aa66'];
let parties=INITIAL.map((p,i)=>({...p,color:COLORS[i%COLORS.length]}));
let nextColor=INITIAL.length;
let nextId=INITIAL.length;
parties.forEach((p,i)=>p.id=i);
let reorderTimer;
let chartMode="bars";
const $=id=>document.getElementById(id);
const number=n=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}).format(n);
function validInt(v){return /^\d+$/.test(String(v).trim())&&Number.isSafeInteger(Number(v));}
function calculate(items,seats,blank){
 const valid=items.reduce((s,p)=>s+p.votes,blank),minimum=valid*.03;
 const eligible=items.map((p,i)=>({...p,index:i,seats:0})).filter(p=>p.votes>0&&p.votes>=minimum);
 const winners=[];
 for(let s=0;s<seats&&eligible.length;s++){
  eligible.sort((a,b)=>{const diff=b.votes/(b.seats+1)-a.votes/(a.seats+1);return Math.abs(diff)>1e-9?diff:b.votes-a.votes||a.index-b.index;});
  const winner=eligible[0];const divisor=winner.seats+1;winners.push({index:winner.index,divisor,quotient:winner.votes/divisor});winner.seats++;
 }
 const allocated=items.map((p,i)=>({...p,seats:eligible.find(e=>e.index===i)?.seats||0,index:i}));
 return {valid,minimum,winners,allocated};
}
function el(tag,content,className){const node=document.createElement(tag);if(content!==undefined)node.textContent=content;if(className)node.className=className;return node;}
function soft(hex){const c=hex.slice(1);const rgb=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16));return `rgb(${rgb.map(v=>Math.round(v*.17+255*.83)).join(",")})`;}
function paint(row,color){row.style.background=soft(color);}
function sortInputsAnimated(){
 const body=$('parties');const rows=[...body.children];
 const first=new Map(rows.map(row=>[row.dataset.id,row.getBoundingClientRect()]));
 parties.sort((a,b)=>(Number(b.votes)||0)-(Number(a.votes)||0)||a.id-b.id);
 parties.forEach(p=>{const row=rows.find(r=>Number(r.dataset.id)===p.id);if(row)body.append(row);});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 [...body.children].forEach(row=>{const old=first.get(row.dataset.id);if(!old)return;
 const delta=old.top-row.getBoundingClientRect().top;if(Math.abs(delta)<1)return;
 row.animate([{transform:`translateY(${delta}px)`,filter:'brightness(1.08)',boxShadow:'0 14px 26px #172e5440',position:'relative',zIndex:5},{transform:'translateY(0)',filter:'brightness(1)',boxShadow:'0 0 0 transparent',position:'relative',zIndex:1}],{duration:570,easing:'cubic-bezier(.2,.8,.2,1)'});
 });
}
function queueSort(){clearTimeout(reorderTimer);reorderTimer=setTimeout(sortInputsAnimated,550);}
function renderInputs(){const body=$('parties');body.replaceChildren();parties.forEach((p,i)=>{
 const tr=el('tr');tr.dataset.id=p.id;paint(tr,p.color);
 const color=el('input');color.type='color';color.value=p.color;color.className='color-picker';color.setAttribute('aria-label',`Color de ${p.name}`);
 color.addEventListener('input',()=>{p.color=color.value;paint(tr,p.color);renderResults();});
 const name=el('input');name.type='text';name.value=p.name;name.maxLength=70;name.setAttribute('aria-label','Nombre del partido');name.addEventListener('input',()=>{p.name=name.value;renderResults();});
 const votes=el('input');votes.type='number';votes.min='0';votes.step='1';votes.value=p.votes;votes.setAttribute('aria-label',`Votos de ${p.name}`);
 votes.addEventListener('input',()=>{p.votes=votes.value;renderResults();if(validInt(p.votes))queueSort();});
 votes.addEventListener('change',()=>{if(validInt(p.votes))queueSort();});
 const remove=el('button','Eliminar','remove');remove.setAttribute('aria-label',`Eliminar ${p.name}`);
 remove.addEventListener('click',()=>{clearTimeout(reorderTimer);parties=parties.filter(x=>x.id!==p.id);renderInputs();renderResults();});
 for(const child of [color,name,votes,remove]){const td=el('td');td.append(child);tr.append(td);}body.append(tr);
 });sortInputsAnimated();}
function renderResults(){const seatsRaw=$('seats').value,blankRaw=$('blank').value;const valid=validInt(seatsRaw)&&Number(seatsRaw)>=1&&Number(seatsRaw)<=100&&validInt(blankRaw)&&parties.every(p=>validInt(p.votes));if(!valid){$('error').textContent='Introduce votos y votos en blanco enteros no negativos, y entre 1 y 100 escaños.';clearResults();return;}$('error').textContent='';const seats=Number(seatsRaw),blank=Number(blankRaw),items=parties.map(p=>({name:p.name.trim()||'Sin nombre',votes:Number(p.votes),color:p.color}));const {valid:total,minimum,winners,allocated}=calculate(items,seats,blank);$('total').textContent=`${number(total)} votos válidos`;$('assigned').textContent=number(winners.length);$('represented').textContent=number(allocated.filter(p=>p.seats>0).length);$('threshold').textContent=number(Math.ceil(minimum));const bar=$('seatbar'),legend=$('legend'),breakdown=$('breakdown'),quotients=$('quotients');[bar,legend,breakdown,quotients].forEach(n=>n.replaceChildren());allocated.filter(p=>p.seats>0).sort((a,b)=>b.seats-a.seats||b.votes-a.votes).forEach(p=>{for(let j=0;j<p.seats;j++){const seat=el('span',undefined,'seat');seat.style.background=p.color;seat.title=p.name;bar.append(seat);}const item=el('span',undefined,'legend-item');const dot=el('span',undefined,'dot');dot.style.background=p.color;item.append(dot,el('span',`${p.name}: ${p.seats}`));legend.append(item);});$('empty').hidden=winners.length>0;renderChart(allocated,seats);allocated.sort((a,b)=>b.votes-a.votes).forEach(p=>{const tr=el('tr');paint(tr,p.color);const label=el('td');const dot=el('span',undefined,'dot');dot.style.background=p.color;label.append(dot,document.createTextNode(' '+p.name));tr.append(label);[number(p.votes),total?`${number(p.votes/total*100)} %`:'0 %',String(p.seats)].forEach(v=>tr.append(el('td',v)));breakdown.append(tr);});const qhead=$('quotient-head');qhead.replaceChildren(el('th','Partido / divisor'));for(let d=1;d<=seats;d++)qhead.append(el('th',`÷${d}`));const winning=new Set(winners.map(w=>`${w.index}:${w.divisor}`));allocated.forEach(p=>{const tr=el('tr');paint(tr,p.color);const label=el('td');label.className='sticky-col';const dot=el('span',undefined,'dot');dot.style.background=p.color;label.append(dot,document.createTextNode(' '+p.name));tr.append(label);for(let d=1;d<=seats;d++){const cell=el('td',number(p.votes/d));if(winning.has(`${p.index}:${d}`)){cell.className='winning';cell.style.borderColor=p.color;cell.title='Cociente ganador: obtiene un diputado';}tr.append(cell);}quotients.append(tr);});}
function clearResults(){['seatbar','legend','breakdown','quotients'].forEach(id=>$(id).replaceChildren());['assigned','represented','threshold'].forEach(id=>$(id).textContent='—');$('total').textContent='Datos inválidos';$('empty').hidden=true;$('dynamic-chart').replaceChildren();}
$('add').addEventListener('click',()=>{parties.push({name:`Partido ${parties.length+1}`,votes:0,color:COLORS[nextColor++%COLORS.length],id:nextId++});renderInputs();renderResults();});$('reset').addEventListener('click',()=>{parties=INITIAL.map((p,i)=>({...p,color:COLORS[i%COLORS.length]}));nextColor=INITIAL.length;nextId=INITIAL.length;parties.forEach((p,i)=>p.id=i);clearTimeout(reorderTimer);$('seats').value=16;$('blank').value=0;renderInputs();renderResults();});['seats','blank'].forEach(id=>$(id).addEventListener('input',renderResults));renderInputs();renderResults();

function renderChart(allocated,seats){
 const container=$('dynamic-chart');container.replaceChildren();
 const items=allocated.filter(p=>p.seats>0).sort((a,b)=>b.seats-a.seats||b.votes-a.votes);
 container.setAttribute('aria-label',items.length?items.map(p=>`${p.name}: ${p.seats} escaños`).join('; '):'Sin escaños asignados');
 if(!items.length){container.append(el('p','Introduce votos válidos para ver el gráfico.','empty'));return;}
 if(chartMode==='bars'){
  const chart=el('div',undefined,'bar-chart');const max=Math.max(...items.map(p=>p.seats));
  items.forEach(p=>{const row=el('div',undefined,'bar-chart-row');const label=el('span',undefined,'bar-chart-name');const dot=el('span',undefined,'dot');dot.style.background=p.color;label.append(dot,el('span',p.name));const track=el('div',undefined,'bar-chart-track');const fill=el('div',undefined,'bar-chart-fill');fill.style.background=p.color;fill.style.width=`${100*p.seats/max}%`;track.append(fill);row.append(label,track,el('span',String(p.seats),'bar-chart-value'));chart.append(row);});container.append(chart);
 }else{
  const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 300 300');svg.setAttribute('class','pie-svg');svg.setAttribute('aria-hidden','true');
  let angle=-Math.PI/2;const cx=150,cy=150,r=124,inner=73,total=items.reduce((n,p)=>n+p.seats,0);
  const point=(radius,a)=>`${(cx+radius*Math.cos(a)).toFixed(3)} ${(cy+radius*Math.sin(a)).toFixed(3)}`;
  items.forEach(p=>{const end=angle+2*Math.PI*p.seats/total;const path=document.createElementNS(ns,'path');const a2=end-.000001;const d=`M ${point(r,angle)} A ${r} ${r} 0 ${end-angle>Math.PI?1:0} 1 ${point(r,a2)} L ${point(inner,a2)} A ${inner} ${inner} 0 ${end-angle>Math.PI?1:0} 0 ${point(inner,angle)} Z`;path.setAttribute('d',d);path.setAttribute('fill',p.color);path.setAttribute('stroke','#fff');path.setAttribute('stroke-width','2');const title=document.createElementNS(ns,'title');title.textContent=`${p.name}: ${p.seats} escaños`;path.append(title);svg.append(path);angle=end;});
  const center=(text,y,cls)=>{const node=document.createElementNS(ns,'text');node.textContent=text;node.setAttribute('x','150');node.setAttribute('y',String(y));node.setAttribute('text-anchor','middle');node.setAttribute('class',cls);svg.append(node);};center(String(total),150,'pie-center-number');center('escaños',172,'pie-center-label');
  const legend=el('div',undefined,'pie-legend');items.forEach(p=>{const item=el('div',undefined,'pie-legend-item');const name=el('span',undefined,'bar-chart-name');const dot=el('span',undefined,'dot');dot.style.background=p.color;name.append(dot,el('span',p.name));item.append(name,el('strong',`${p.seats} · ${number(100*p.seats/total)} %`));legend.append(item);});const layout=el('div',undefined,'pie-layout');layout.append(svg,legend);container.append(layout);
 }
}
function setChartMode(mode){chartMode=mode;for(const [id,value] of [['chart-bars','bars'],['chart-pie','pie']]){const button=$(id);button.classList.toggle('active',mode===value);button.setAttribute('aria-pressed',String(mode===value));}renderResults();}
$('chart-bars').addEventListener('click',()=>setChartMode('bars'));
$('chart-pie').addEventListener('click',()=>setChartMode('pie'));
