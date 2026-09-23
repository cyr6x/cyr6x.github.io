const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));

$('#year').textContent = new Date().getFullYear();

const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 18), {passive:true});

const menu = $('#menu');
const mobileNav = $('#mobile-nav');
menu.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
$$('#mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
}));

const portraitZone = $('#portrait-zone');
if (portraitZone && !reduced) {
  const resetPortrait = () => {
    portraitZone.style.setProperty('--mx','0px');
    portraitZone.style.setProperty('--my','0px');
    portraitZone.style.setProperty('--rx','0deg');
    portraitZone.style.setProperty('--ry','0deg');
    portraitZone.classList.remove('is-live');
  };
  portraitZone.addEventListener('pointermove', e => {
    const r = portraitZone.getBoundingClientRect();
    const x = clamp((e.clientX-r.left)/r.width);
    const y = clamp((e.clientY-r.top)/r.height);
    portraitZone.style.setProperty('--mx', `${(x-.5)*14}px`);
    portraitZone.style.setProperty('--my', `${(y-.5)*10}px`);
    portraitZone.style.setProperty('--rx', `${(.5-y)*3.2}deg`);
    portraitZone.style.setProperty('--ry', `${(x-.5)*4.2}deg`);
    portraitZone.classList.add('is-live');
  });
  portraitZone.addEventListener('pointerleave', resetPortrait);
}

const filters = $$('.filter');
const projectCards = $$('.project-card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.toggle('is-active', b === btn));
  const filter = btn.dataset.filter;
  projectCards.forEach(card => {
    const kinds = (card.dataset.kind || '').split(' ');
    card.classList.toggle('is-hidden', filter !== 'all' && !kinds.includes(filter));
  });
}));

const projectData = {
  sirts:{kicker:'CAPSTONE · FINAL YEAR PROJECT',title:'CCorp SIRTS',summary:'A Security Incident Response & Ticketing System built as the final-year capstone. Its value is the incident-response thinking: role boundaries, incident lifecycle, auditability, triage flow and defensible records.',facts:[['Focus','Incident response workflow'],['Evidence','RBAC · audit log · lifecycle'],['Positioning','Final-year capstone'],['Security relevance','Direct']]},
  sentinel:{kicker:'DETECTION ENGINEERING',title:'Azure SOC Honeypot',summary:'A practical SOC pipeline using Microsoft Sentinel and Windows telemetry. Failed authentication events are enriched and queried with KQL to surface brute-force behaviour and support investigation.',facts:[['Focus','Detection & telemetry'],['SIEM','Microsoft Sentinel'],['Query language','KQL'],['Security relevance','Direct']]},
  pcap:{kicker:'NETWORK FORENSICS',title:'Malware Traffic Analysis',summary:'A packet-level investigation of malicious traffic using Wireshark. The exercise follows beacon behaviour, extracts indicators and maps observed activity to MITRE ATT&CK techniques.',facts:[['Focus','PCAP investigation'],['Tool','Wireshark'],['Outputs','IOCs · behaviour · mapping'],['Security relevance','Direct']]},
  burp:{kicker:'WEB SECURITY LAB',title:'Web Application Testing',summary:'Controlled SQL injection and reflected-XSS testing against an intentionally vulnerable environment, with reproducible evidence and remediation notes.',facts:[['Focus','Web vulnerability validation'],['Tool','Burp Suite'],['Environment','DVWA'],['Security relevance','Direct']]},
  nmap:{kicker:'ENUMERATION LAB',title:'Nmap Enumeration',summary:'Host discovery, service enumeration and fingerprinting used to understand attack surface and exposed services before deeper validation.',facts:[['Focus','Attack surface discovery'],['Tool','Nmap'],['Evidence','Hosts · ports · services'],['Security relevance','Direct']]},
  metasploit:{kicker:'EXPLOITATION LAB',title:'Metasploit Validation',summary:'Controlled exploitation against deliberately vulnerable targets, used to validate exposure, understand impact and document remediation.',facts:[['Focus','Controlled exploitation'],['Tool','Metasploit'],['Environment','Linux lab targets'],['Security relevance','Direct']]},
  recon:{kicker:'RECONNAISSANCE LAB',title:'Passive Recon & OSINT',summary:'Passive asset discovery and subdomain-enumeration work focused on evidence gathering without noisy active interaction.',facts:[['Focus','Passive discovery'],['Tools','OSINT · theHarvester'],['Evidence','Assets · subdomains'],['Security relevance','Direct']]},
  network:{kicker:'COURSEWORK',title:'Network Security & Defence',summary:'Academic technical work covering segmentation, secure network design, firewall policy, network services and the reasoning behind control choices.',facts:[['Focus','Network defence'],['Topics','Segmentation · DMZ · policy'],['Evidence','Technical report'],['Security relevance','Direct']]},
  simulator:{kicker:'LEARNING SYSTEM',title:'Security+ MCQ × PBQ Simulator',summary:'A scenario-led practice system built to reproduce timed Security+ conditions, randomise question exposure, review weak areas and train exam discipline. The build supports learning; the cybersecurity knowledge is the point.',facts:[['Focus','Security+ exam simulation'],['Mode','Timed MCQ + PBQ'],['Evidence','Domain analytics · review'],['Security relevance','Supporting']]},
  ims:{kicker:'NON-SECURITY COURSEWORK',title:'C TECH IMS',summary:'An inventory-management coursework build demonstrating systems analysis, data handling, reporting and application delivery. It is intentionally not presented as a cybersecurity solution.',facts:[['Focus','Inventory management'],['Evidence','Systems coursework'],['Security claim','None'],['Why it is here','Breadth / academic work']]}
};

const dialog = $('#project-dialog');
const dialogBody = $('#dialog-body');
$$('.project-open').forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('[data-project]');
  const data = projectData[card?.dataset.project];
  if (!data) return;
  dialogBody.innerHTML = `<div class="dialog-content"><p class="section-kicker">${data.kicker}</p><h3 id="dialog-title">${data.title}</h3><p>${data.summary}</p><div class="dialog-facts">${data.facts.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div></div>`;
  dialog.showModal();
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
});

const contacts = {
  email: {value:'baaycyril@gmail.com', href:'mailto:baaycyril@gmail.com'},
  phone: {value:'+254 795 794 573', href:'tel:+254795794573'}
};
$$('.contact-reveal').forEach(btn => btn.addEventListener('click', () => {
  const data = contacts[btn.dataset.contact];
  if (!data) return;
  if (btn.dataset.revealed === 'true') {
    location.href = data.href;
    return;
  }
  btn.dataset.revealed = 'true';
  btn.querySelector('b').textContent = data.value;
  btn.setAttribute('aria-label', `${btn.dataset.contact}: ${data.value}. Click again to open.`);
}));

const canvas = $('#space');
const ctx = canvas.getContext('2d', {alpha:true});
let stars = [];
let dpr = 1;
function resizeSpace(){
  dpr = Math.min(devicePixelRatio || 1, 1.8);
  const w = innerWidth, h = innerHeight;
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.round(clamp((w*h)/9000,70,190));
  stars = Array.from({length:count},(_,i)=>({x:Math.random()*w,y:Math.random()*h,z:Math.random(),r:.4+Math.random()*1.25,p:Math.random()*Math.PI*2}));
}
resizeSpace();
addEventListener('resize', resizeSpace, {passive:true});

let pointer = {x:.5,y:.5};
addEventListener('pointermove', e => {pointer.x=e.clientX/innerWidth;pointer.y=e.clientY/innerHeight},{passive:true});
function drawSpace(t){
  const w=innerWidth,h=innerHeight;
  ctx.clearRect(0,0,w,h);
  const page = document.documentElement;
  const scrollP = clamp(scrollY / Math.max(1,page.scrollHeight-h));
  const contact = $('#contact').getBoundingClientRect();
  const endP = clamp(1 - contact.top / h, 0, 1);
  const px = reduced ? .5 : pointer.x, py = reduced ? .5 : pointer.y;
  stars.forEach((s,i)=>{
    const depth=.25+s.z*.75;
    const drift = reduced ? 0 : Math.sin(t*.00018+s.p)*4*depth;
    const x=(s.x + (px-.5)*-22*depth + drift + scrollP*18*depth + w)%w;
    const y=(s.y + (py-.5)*-12*depth + scrollP*48*depth + h)%h;
    const alpha=.12+s.z*.43 + endP*.16;
    ctx.beginPath();ctx.arc(x,y,s.r*(.72+s.z*.55),0,Math.PI*2);ctx.fillStyle=`rgba(210,218,229,${alpha})`;ctx.fill();
  });
  if(endP>0){
    const g=ctx.createRadialGradient(w*.5,h*.75,0,w*.5,h*.75,w*.48);
    g.addColorStop(0,`rgba(255,59,67,${.035*endP})`);g.addColorStop(1,'rgba(255,59,67,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }
  requestAnimationFrame(drawSpace);
}
requestAnimationFrame(drawSpace);

if ('IntersectionObserver' in window && !reduced) {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting) e.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,.78,.2,1)',fill:'both'});
  }),{threshold:.12});
  $$('.project-card,.skill-panel,.path-steps li,.intro-grid').forEach(el=>obs.observe(el));
}
