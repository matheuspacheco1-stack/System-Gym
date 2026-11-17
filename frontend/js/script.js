/* SYSTEM GYM — frontend puro, sem dependências. Dados demonstrativos em localStorage. */
'use strict';

const STORAGE_KEY = 'system-gym-demo-v2';
const THEME_KEY = 'system-gym-theme';
const PROFILE_KEY = 'system-gym-demo-profile';
const studentPages = [['aluno_inicio','Meu painel','grid'],['aluno_treinos','Treinos prontos','dumbbell'],['aluno_montar','Montar treino','plus'],['aluno_matricula','Minha matrícula','calendar']];
const studentPageLabels = Object.fromEntries(studentPages.map(([key,label])=>[key,label]));
const teacherPages = [['prof_inicio','Meu painel','grid'],['prof_montar','Prescrever treino','plus'],['prof_treinos','Treinos prescritos','dumbbell'],['prof_alunos','Alunos','users']];
const teacherPageLabels = Object.fromEntries(teacherPages.map(([key,label])=>[key,label]));
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const svg = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const money = value => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(Number(value) || 0);
const shortMoney = value => { const v = Number(value)||0; return v >= 1000 ? `R$ ${(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})} mil` : `R$ ${Math.round(v).toLocaleString('pt-BR')}`; };
const localDate = offset => {const date = new Date();date.setHours(12,0,0,0);date.setDate(date.getDate()+offset);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
const ptDate = value => value ? String(value).split('-').reverse().join('/') : '—';
const initials = value => String(value||'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
const numeric = value => Number.isFinite(Number(value)) ? Number(value) : 0;

const pages = [
  ['dashboard','Visão geral','grid'], ['alunos','Alunos','users'],['professores','Professores','badge'],
  ['planos','Planos','card'],['matriculas','Matrículas','calendar'],['pagamentos','Pagamentos','coins'],
  ['treinos','Treinos','dumbbell'],['exercicios','Exercícios','activity']
];
const pageLabels = Object.fromEntries(pages.map(([k,v])=>[k,v]));

function seedDemo() {
  const students = [
    ['Mariana Costa','mariana.costa@exemplo.com','11 98765-1010','124.567.890-11'],
    ['Rafael Lima','rafael.lima@exemplo.com','11 98765-2020','124.567.890-22'],
    ['Bruno Santos','bruno.santos@exemplo.com','11 98765-3030','124.567.890-33'],
    ['Ana Ferreira','ana.ferreira@exemplo.com','11 98765-4040','124.567.890-44'],
    ['Lucas Oliveira','lucas.oliveira@exemplo.com','11 98765-5050','124.567.890-55'],
    ['Camila Souza','camila.souza@exemplo.com','11 98765-6060','124.567.890-66'],
    ['Pedro Almeida','pedro.almeida@exemplo.com','11 98765-7070','124.567.890-77'],
    ['Beatriz Martins','beatriz.martins@exemplo.com','11 98765-8080','124.567.890-88']
  ];
  const alunos = students.map((row,i)=>({id:i+1,nome:row[0],email:row[1],telefone:row[2],cpf:row[3],data_nascimento:'2000-04-15',endereco:'Endereço de demonstração',data_cadastro:localDate(-i)}));
  const professores = [
    {id:1,nome:'Carlos Mendes',cpf:'123.000.000-10',telefone:'11 98888-1111',email:'carlos@exemplo.com',especialidade:'Musculação'},
    {id:2,nome:'Juliana Rocha',cpf:'123.000.000-20',telefone:'11 98888-2222',email:'juliana@exemplo.com',especialidade:'Treinamento funcional'},
    {id:3,nome:'Felipe Nunes',cpf:'123.000.000-30',telefone:'11 98888-3333',email:'felipe@exemplo.com',especialidade:'Condicionamento físico'}
  ];
  const planos = [
    {id:1,nome:'Mensal',descricao:'Acesso por um mês',valor:120,duracao_meses:1,status:'Ativo'},
    {id:2,nome:'Trimestral',descricao:'Acesso por três meses',valor:300,duracao_meses:3,status:'Ativo'},
    {id:3,nome:'Anual',descricao:'Acesso por doze meses',valor:960,duracao_meses:12,status:'Ativo'}
  ];
  const matriculas = [
    [1,1,'Ativa'],[2,3,'Ativa'],[3,2,'Pendente'],[4,1,'Ativa'],[5,1,'Ativa'],[6,2,'Ativa'],[7,1,'Ativa'],[8,3,'Ativa']
  ].map((row,i)=>({id:i+1,aluno_id:row[0],plano_id:row[1],data_inicio:localDate(-40+i*3),data_fim:localDate(15+i*11),status:row[2]}));
  const pagamentos = [
    [1,120,-20,'PIX','Pago'],[2,960,-10,'Cartão','Pago'],[3,300,3,'PIX','Pendente'],
    [4,120,-5,'Dinheiro','Pago'],[5,120,1,'PIX','Pendente'],[6,300,2,'Cartão','Pendente'],
    [7,120,4,'PIX','Pendente'],[8,960,-8,'Cartão','Pago']
  ].map((row,i)=>({id:i+1,matricula_id:row[0],valor:row[1],data_pagamento:row[4]==='Pago'?localDate(row[2]):'',data_vencimento:localDate(row[2]),forma_pagamento:row[3],status:row[4]}));
  const treinos = [
    {id:1,aluno_id:1,professor_id:1,nome:'Treino A — Superior',descricao:'Foco em peito, ombros e tríceps',data_criacao:localDate(-9)},
    {id:2,aluno_id:2,professor_id:2,nome:'Treino B — Inferior',descricao:'Foco em pernas e glúteos',data_criacao:localDate(-7)},
    {id:3,aluno_id:4,professor_id:1,nome:'Treino C — Costas',descricao:'Foco em dorsais e bíceps',data_criacao:localDate(-4)},
    {id:4,aluno_id:6,professor_id:3,nome:'Treino D — Funcional',descricao:'Circuito funcional',data_criacao:localDate(-1)}
  ];
  const exercicios = [
    {id:1,nome:'Supino reto',grupo_muscular:'Peito',descricao:'Exercício de empurrar para peitoral'},
    {id:2,nome:'Agachamento',grupo_muscular:'Pernas',descricao:'Exercício composto para membros inferiores'},
    {id:3,nome:'Puxada frontal',grupo_muscular:'Costas',descricao:'Exercício para dorsais'},
    {id:4,nome:'Desenvolvimento',grupo_muscular:'Ombros',descricao:'Exercício para deltoides'},
    {id:5,nome:'Remada baixa',grupo_muscular:'Costas',descricao:'Exercício para as costas'},
    {id:6,nome:'Prancha abdominal',grupo_muscular:'Core',descricao:'Exercício isométrico'}
  ];
  const treino_exercicios = [
    [1,1,3,'12',1,'Ajustar a carga progressivamente'],[1,4,3,'10',2,'Manter a postura'],
    [2,2,4,'10',1,'Pausar entre séries'],[3,3,3,'12',1,'Movimento controlado'],
    [3,5,3,'12',2,''],[4,6,3,'30 segundos',1,'Controlar a respiração']
  ].map((r,i)=>({id:i+1,treino_id:r[0],exercicio_id:r[1],series:r[2],repeticoes:r[3],ordem:r[4],observacoes:r[5]}));
  const demo = {alunos,professores,planos,matriculas,pagamentos,treinos,exercicios,treino_exercicios};
  addMoreDemoData(demo);
  return demo;
}

// Dados adicionais EXCLUSIVAMENTE de demonstração, sem chamadas ao backend.
// Não sobrepõe alunos nem matrículas que a pessoa já cadastrou.
function addMoreDemoData(database) {
  if(database.matriculas.some(row => row.demo_extra)) return 0;
  const nomes = [
    'Gabriela','Matheus','Larissa','João','Isabela','Thiago','Amanda','Gustavo',
    'Fernanda','Vinícius','Eduarda','Henrique','Letícia','Daniel','Bianca','André',
    'Sofia','Caio','Vitória','Leonardo','Manuela','Felipe','Débora','Gabriel',
    'Luiza','Rodrigo','Patrícia','Diego','Renata','Samuel','Priscila','Eduardo',
    'Carolina','Miguel','Natália','Arthur','Júlia','Victor','Heloísa','Murilo',
    'Paula','Igor','Clara','Marcelo','Yasmin','Alexandre','Talita','Bernardo',
    'Elisa','Vitor','Rafaela','Renan','Vanessa','Davi','Nicole','Otávio',
    'Jéssica','Luan','Alice','Ricardo','Mirela','César','Milena','Fábio'
  ];
  const sobrenomes = ['Silva','Pereira','Gomes','Barbosa','Rodrigues','Carvalho','Ribeiro','Alves','Castro','Araújo','Moura','Freitas'];
  let nextAluno = Math.max(0,...database.alunos.map(row=>Number(row.id)||0))+1;
  let nextMatricula = Math.max(0,...database.matriculas.map(row=>Number(row.id)||0))+1;
  let nextPagamento = Math.max(0,...database.pagamentos.map(row=>Number(row.id)||0))+1;
  let novasMatriculas=0;
  nomes.forEach((nome,i)=>{
    const nomeCompleto=`${nome} ${sobrenomes[i%sobrenomes.length]}`;
    const alunoId=nextAluno++;
    const emailBase=nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,'.');
    database.alunos.push({id:alunoId,nome:nomeCompleto,email:`${emailBase}.${alunoId}@exemplo.com`,telefone:`11 9${String(10000000+i*71).padStart(8,'0')}`,cpf:`000.000.${String(i+100).padStart(3,'0')}-00`,data_nascimento:'1999-08-14',endereco:'Dados fictícios para demonstração',data_cadastro:localDate(-i%40),demo_extra:true});
    // 58 novas matrículas, aumentando de 8 para 66 no conjunto inicial.
    if(i>=58) return;
    const planoId=(i%3)+1;
    const status=i%13===0?'Pendente':i%29===0?'Cancelada':'Ativa';
    const matriculaId=nextMatricula++;
    const val=database.planos.find(row=>Number(row.id)===planoId)?.valor ?? 120;
    database.matriculas.push({id:matriculaId,aluno_id:alunoId,plano_id:planoId,data_inicio:localDate(-3-(i%40)),data_fim:localDate(20+(i%35)),status,demo_extra:true});
    const pendente=status==='Pendente'||i%9===0;
    database.pagamentos.push({id:nextPagamento++,matricula_id:matriculaId,valor:val,data_pagamento:pendente?'':localDate(-(i%12)),data_vencimento:localDate(pendente?2+(i%12):-(i%12)),forma_pagamento:['PIX','Cartão','Dinheiro'][i%3],status:pendente?'Pendente':'Pago',demo_extra:true});
    novasMatriculas++;
  });
  return novasMatriculas;
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageSize=10;
let pageEnterTimer = null;
let routeTimer = null;

function loadData() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if (saved && typeof saved === 'object' && ['alunos','planos','matriculas','treinos'].every(k=>Array.isArray(saved[k]))) return saved;
  } catch(e) { /* armazenamento indisponível, usa dados desta sessão */ }
  return seedDemo();
}
let db = loadData();
/* Acrescenta o catálogo V5 sem redefinir os treinos e exercícios antigos do navegador.
   IDs existentes e associações treino_exercicios são preservados. */
const normExercise = name => String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g,' ');
function catalogRegionInfo(exercise) {
  return SG_REGIONS.find(r=>r.grupo===exercise?.grupo_muscular && r.regiao===exercise?.regiao) || null;
}
function catalogImage(exercise) {
  return catalogRegionInfo(exercise)?.imagem || SG_REGIONS.find(r=>r.regiao===exercise?.regiao)?.imagem || 'img/musculos/core.webp';
}
function exerciseImageHTML(exercise,extraClass='') {
  return `<img class="muscle-thumb ${esc(extraClass)}" src="${esc(catalogImage(exercise))}" alt="Região muscular: ${esc(exercise?.regiao || exercise?.grupo_muscular || 'esquema geral')}" loading="lazy">`;
}
function upgradeExerciseCatalogue() {
  if (!Array.isArray(db.exercicios)) db.exercicios=[];
  const existing = new Map(db.exercicios.map(e=>[normExercise(e.nome),e]));
  const anchors={'Supino reto': 'Supino reto com barra', 'Agachamento': 'Agachamento livre', 'Puxada frontal': 'Puxada frontal aberta', 'Desenvolvimento':'Desenvolvimento com halteres', 'Remada baixa':'Remada baixa aberta', 'Prancha abdominal':'Prancha abdominal'};
  for(const ex of db.exercicios) {
    let match=existing.get(normExercise(ex.nome));
    if(match===ex && (!ex.regiao || !ex.grupo_muscular)){
      const target=SG_CATALOG.find(c=>normExercise(c.nome)===normExercise(anchors[ex.nome]||ex.nome));
      if(target) Object.assign(ex,{grupo_muscular:target.grupo_muscular,regiao:target.regiao,imagem:target.imagem});
    }
  }
  let nextId=Math.max(0,...db.exercicios.map(e=>Number(e.id)||0))+1;
  let inserted=0;
  SG_CATALOG.forEach(source=>{
    const key=normExercise(source.nome);
    const old=existing.get(key);
    if(old){if(!old.regiao) old.regiao=source.regiao;if(!old.imagem) old.imagem=source.imagem;return;}
    const row={...source,id:nextId++,descricao:`Ênfase: ${source.regiao}.`};
    db.exercicios.push(row);existing.set(key,row);inserted++;
  });
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(db)); } catch(e) { /* permanece na sessão */ }
  return inserted;
}
// Migração V6: atualiza as regiões de exercícios já salvos sem mudar os IDs.
// Treinos pessoais/prescritos continuam apontando para os mesmos exercícios.
for (const ex of (db.exercicios || [])) {
  if (!ex || !ex.grupo_muscular) continue;
  const normalized=sgSimplifyRegion(ex.grupo_muscular,ex.regiao);
  if (normalized && normalized!==ex.regiao) ex.regiao=normalized;
  const match=SG_REGIONS.find(r=>r.grupo===ex.grupo_muscular&&r.regiao===ex.regiao);
  if (match) ex.imagem=match.imagem;
}
upgradeExerciseCatalogue();

if(!Array.isArray(db.treinos_aluno)) db.treinos_aluno = [];
let userSession = null;
try { const profile = JSON.parse(sessionStorage.getItem(PROFILE_KEY)||'null'); if(profile?.role==='admin') userSession={role:'admin'}; else if(profile?.role==='professor' && db.professores.some(a=>Number(a.id)===Number(profile.professorId))) userSession={role:'professor',professorId:Number(profile.professorId)}; else if(profile?.role==='aluno' && db.alunos.some(a=>Number(a.id)===Number(profile.alunoId))) userSession={role:'aluno',alunoId:Number(profile.alunoId)}; } catch(e) {}
function saveData() {try{localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}catch(e){showToast('Alteração feita nesta sessão. O navegador não permitiu armazenar os dados.', 'error');}}
const state = {page:'dashboard',workoutTab:'treinos',search:'',status:'todos',sort:'recentes',period:6,notificationRead:false,returnFocus:null,tablePage:1,exerciseGroup:'',exerciseRegion:''};

function find(kind,id) {return (db[kind]||[]).find(row=>Number(row.id)===Number(id));}
function label(kind,id) {return find(kind,id)?.nome || `#${id ?? '?'}`;}
function studentStatus(row) {return db.matriculas.some(m=>Number(m.aluno_id)===Number(row.id)&&m.status==='Ativa')?'Ativo':'Pendente';}
function fmtStatus(str) {
  const type = ['Ativo','Ativa','Pago'].includes(str) ? 'active' : ['Pendente','Atrasado'].includes(str)?'pending':'inactive';
  return `<span class="status ${type}"><span aria-hidden="true">●</span>${esc(str)}</span>`;
}
function footer() {return `<footer class="footer"><span>© ${new Date().getFullYear()} SYSTEM GYM — painel demonstrativo.</span><span>Construído com HTML, CSS e JavaScript.</span></footer>`;}
function titleArea(title,desc,action,iconName='plus',eyebrow='PAINEL ADMINISTRATIVO') {
  return `<header class="intro"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p class="subtitle">${esc(desc)}</p></div><div class="intro-actions">${action||''}</div></header>`;
}
function barMini() {return `<div class="mini-bars" aria-hidden="true">${[37,60,47,73,62,89,57,83,68,100].map((v,i)=>`<span style="--h:${v}%;--delay:${i*45}ms"></span>`).join('')}</div>`;}
function statCard(title,value,desc,icon,kind='int') {
  return `<article class="stat-card"><div class="stat-header"><span>${esc(title)}</span><span class="stat-icon">${svg(icon)}</span></div><div class="stat-number ${kind==='currency'?'currency':''}" data-counter="${numeric(value)}" data-format="${kind}">${kind==='currency'?'R$ 0,00':'0'}</div><div class="stat-bottom">${desc}</div>${barMini()}</article>`;
}
function monthLabels(n) {
  const monthFmt = new Intl.DateTimeFormat('pt-BR',{month:'short'});
  return Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-n+1+i);return monthFmt.format(d).replace('.','').replace(/^./,v=>v.toUpperCase());});
}
function chartHTML() {
  const n = state.period;
  const labels=monthLabels(n);
  const base = n===6 ? [1250,1630,1510,1930,1850,2350] : [850,1050,930,1230,1150,1420,1250,1630,1510,1930,1850,2350];
  const expenses = base.map((x,i)=>Math.round(x*(.55+.04*Math.sin(i))));
  const max=3000, w=720,h=220;
  const pts = arr => arr.map((v,i)=>[i*(w/(arr.length-1)),h-(v/max)*(h-18)]);
  const path = arr => pts(arr).map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const pRevenue=path(base), pExpenses=path(expenses);
  const area=`${pRevenue} L${w},${h} L0,${h} Z`;
  return `<div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Receitas</span><span class="legend-item"><i class="legend-dot muted"></i>Despesas</span></div>
  <div class="revenue-chart"><div class="chart-y"><span>R$ 3 mil</span><span>R$ 2,2 mil</span><span>R$ 1,5 mil</span><span>R$ 750</span><span>R$ 0</span></div>
  <div class="chart-shell"><div class="chart-grid">${'<span></span>'.repeat(5)}</div>
  <svg class="chart-svg" viewBox="0 0 720 220" preserveAspectRatio="none" role="img" aria-label="Gráfico ilustrativo de receita e despesas dos últimos ${n} meses">
    <defs><linearGradient id="revenueFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7ae59" stop-opacity=".30"/><stop offset="1" stop-color="#d7ae59" stop-opacity="0"/></linearGradient></defs>
    <path class="chart-area-fill" d="${area}" fill="url(#revenueFade)"/><path class="chart-curve" d="${pExpenses}" stroke="#767780" style="animation-delay:.13s"/><path class="chart-curve" d="${pRevenue}" stroke="var(--gold)"/>
    <g class="chart-points">${pts(base).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g></svg>
    <div class="chart-months">${labels.map(label=>`<span>${esc(label)}</span>`).join('')}</div></div></div>`;
}
function dashboard() {
  const active = db.matriculas.filter(m=>m.status==='Ativa');
  const paid = db.pagamentos.filter(p=>p.status==='Pago');
  const pending = db.pagamentos.filter(p=>p.status==='Pendente');
  const revenue = paid.filter(p=>p.data_pagamento?.slice(0,7)===localDate(0).slice(0,7)).reduce((s,p)=>s+numeric(p.valor),0);
  const greetingHour=new Date().getHours(); const greeting=greetingHour<12?'Bom dia':greetingHour<18?'Boa tarde':'Boa noite';
  const thisDate = new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
  const intro=titleArea('Visão geral', `${greeting}! Acompanhe os principais indicadores da sua academia.`,
    `<span class="demo-tag"><i></i> Dados demonstrativos</span><button class="btn btn-primary" data-action="quick">${svg('plus')} Novo cadastro</button>`,'plus',thisDate);
  const stat= `<div class="stats-grid">${statCard('Alunos cadastrados',db.alunos.length,`<span class="positive">${svg('trending')} Cadastro atualizado</span>`,'users')}${statCard('Matrículas ativas',active.length,`<span class="positive">${svg('check')} Inscrições em andamento</span>`,'calendar')}${statCard('Receita recebida no mês',revenue,`<span class="positive">${svg('trending')} Pagamentos registrados</span>`,'coins','currency')}${statCard('Pagamentos pendentes',pending.length,`<span class="warn-text">${svg('clock')} Requer atenção</span>`,'clock')}</div>`;
  const counts = [1,2,3].map(id=>active.filter(m=>Number(m.plano_id)===id).length);
  const total = active.length;
  const p1=total ? counts[0]/total*100 : 0, p2=total ? (counts[0]+counts[1])/total*100:0;
  const donut = `<article class="panel"><div class="panel-header"><div><h2>Distribuição de planos</h2><p class="panel-caption">Matrículas ativas por modalidade</p></div>${svg('more')}</div><div class="donut-layout"><div class="donut" style="--part1:${p1.toFixed(3)}%;--part2:${p2.toFixed(3)}%"><div class="donut-inner"><strong>${total}</strong><span>matrículas ativas</span></div></div></div><div class="plan-rows">${[1,2,3].map((id,i)=>`<div class="plan-row"><span><i class="legend-dot ${i===1?'bronze':i===2?'muted':''}"></i>${esc(label('planos',id))}</span><strong>${counts[i]} <small>${total?(100*counts[i]/total).toFixed(1).replace('.',','):'0'}%</small></strong></div>`).join('')}</div></article>`;
  const recent=[...db.alunos].sort((a,b)=>(b.data_cadastro||'').localeCompare(a.data_cadastro||'')).slice(0,4);
  const recentRows = recent.map(row=>`<tr><td><span class="name-cell"><span class="person-avatar">${esc(initials(row.nome))}</span><span><strong>${esc(row.nome)}</strong><small>${esc(row.email)}</small></span></span></td><td>${esc(label('planos',db.matriculas.find(m=>Number(m.aluno_id)===row.id)?.plano_id)||'—')}</td><td>${ptDate(row.data_cadastro)}</td><td>${fmtStatus(studentStatus(row))}</td></tr>`).join('');
  const nextDue=[...pending].sort((a,b)=>String(a.data_vencimento).localeCompare(String(b.data_vencimento))).slice(0,4);
  const dueRows=nextDue.map(p=>{const m=find('matriculas',p.matricula_id); const [year,mon,day]=(p.data_vencimento||'').split('-');return `<div class="due-item"><div class="date-square"><strong>${esc(day||'—')}</strong><small>${esc(monthLabelsName(mon))}</small></div><div class="due-name"><strong>${esc(label('alunos',m?.aluno_id))}</strong><small>Plano ${esc(label('planos',m?.plano_id))}</small></div><strong class="due-amount">${money(p.valor)}</strong></div>`;}).join('');
  return `<div class="main-area">${intro}${stat}<div class="dashboard-grid">
    <article class="panel"><div class="panel-header"><div><h2>Visão financeira</h2><p class="panel-caption">Evolução ilustrativa das receitas e despesas</p></div><select class="panel-select" id="chartPeriod" aria-label="Período do gráfico"><option value="6" ${state.period===6?'selected':''}>Últimos 6 meses</option><option value="12" ${state.period===12?'selected':''}>Últimos 12 meses</option></select></div>${chartHTML()}<p class="chart-note">Os valores deste gráfico são ilustrativos e não representam dados do MySQL.</p></article>
    ${donut}
    <article class="panel"><div class="panel-header"><div><h2>Cadastros recentes</h2><p class="panel-caption">Últimos alunos adicionados ao sistema</p></div><button class="text-link" data-page-link="alunos">Ver todos ${svg('arrow')}</button></div><div class="table-scroll"><table class="panel-table"><thead><tr><th>Aluno</th><th>Plano</th><th>Cadastro</th><th>Status</th></tr></thead><tbody>${recentRows||'<tr><td colspan="4">Nenhum aluno cadastrado.</td></tr>'}</tbody></table></div></article>
    <article class="panel"><div class="panel-header"><div><h2>Próximos vencimentos</h2><p class="panel-caption">Pagamentos pendentes que precisam de atenção</p></div><button class="text-link" data-page-link="pagamentos">Ver todos ${svg('arrow')}</button></div><div class="due-list">${dueRows||'<div class="empty-state">Nenhum pagamento pendente.</div>'}</div></article>
  </div>${footer()}</div>`;
}
function monthLabelsName(mon) {return ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][Math.max(0,Number(mon)-1)]||'—';}

const schemas = {
  alunos: {desc:'Gerencie os dados dos alunos da academia.',one:'aluno',fields:[
    ['nome','Nome completo','text',true],['cpf','CPF','text',true],['telefone','Telefone','tel',true],['email','E-mail','email',true],
    ['data_nascimento','Data de nascimento','date',false],['endereco','Endereço','text',false],['data_cadastro','Data de cadastro','date',true]
  ],columns:[['nome','Aluno'],['email','E-mail'],['telefone','Telefone'],['data_cadastro','Cadastro'],['computed_status','Status']]},
  professores:{desc:'Organize a equipe de professores e especialidades.',one:'professor',fields:[
    ['nome','Nome completo','text',true],['cpf','CPF','text',true],['telefone','Telefone','tel',true],['email','E-mail','email',true],['especialidade','Especialidade','text',true]
  ],columns:[['nome','Professor'],['especialidade','Especialidade'],['email','E-mail'],['telefone','Telefone']]},
  planos:{desc:'Cadastre planos, valores e períodos de validade.',one:'plano',fields:[
    ['nome','Nome do plano','text',true],['descricao','Descrição','textarea',false],['valor','Valor (R$)','number',true],['duracao_meses','Duração em meses','number',true],['status','Status','status_plano',true]
  ],columns:[['nome','Plano'],['descricao','Descrição'],['valor','Valor'],['duracao_meses','Duração'],['status','Status']]},
  matriculas:{desc:'Associe alunos aos planos e acompanhe suas matrículas.',one:'matrícula',fields:[
    ['aluno_id','Aluno','select_alunos',true],['plano_id','Plano','select_planos',true],['data_inicio','Início','date',true],['data_fim','Término','date',true],['status','Status','status_matricula',true]
  ],columns:[['id','Código'],['aluno_id','Aluno'],['plano_id','Plano'],['data_inicio','Início'],['data_fim','Término'],['status','Status']]},
  pagamentos:{desc:'Registre recebimentos, formas de pagamento e vencimentos.',one:'pagamento',fields:[
    ['matricula_id','Matrícula','select_matriculas',true],['valor','Valor (R$)','number',true],['data_vencimento','Vencimento','date',true],['data_pagamento','Data de pagamento','date',false],['forma_pagamento','Forma de pagamento','forma',true],['status','Status','status_pagamento',true]
  ],columns:[['id','Código'],['matricula_id','Aluno'],['valor','Valor'],['data_vencimento','Vencimento'],['forma_pagamento','Forma'],['status','Status']]},
  treinos:{desc:'Organize os treinos criados pelos professores.',one:'treino',fields:[
    ['nome','Nome do treino','text',true],['aluno_id','Aluno','select_alunos',true],['professor_id','Professor','select_professores',true],['descricao','Descrição','textarea',false],['data_criacao','Data de criação','date',true]
  ],columns:[['nome','Treino'],['aluno_id','Aluno'],['professor_id','Professor'],['data_criacao','Criação'],['descricao','Descrição']]},
  exercicios:{desc:'Catálogo com imagens anatômicas, grupos e regiões musculares para montar treinos.',one:'exercício',fields:[
    ['nome','Nome do exercício','text',true],['grupo_muscular','Grupo muscular','muscle_group',true],['regiao','Região enfatizada','muscle_region',true],['descricao','Descrição','textarea',false]
  ],columns:[['nome','Exercício'],['grupo_muscular','Grupo'],['regiao','Região muscular'],['descricao','Descrição']]},
  treinos_aluno:{desc:'Treinos pessoais que alunos montaram no catálogo demonstrativo.',one:'treino pessoal',fields:[],columns:[['nome','Treino'],['aluno_id','Aluno'],['data_criacao','Criação'],['descricao','Descrição']]},
  treino_exercicios:{desc:'Configure séries, repetições e observações de cada exercício do treino.',one:'exercício do treino',fields:[
    ['treino_id','Treino','select_treinos',true],['exercicio_id','Exercício','select_exercicios',true],['series','Séries','number',true],['repeticoes','Repetições','text',true],['ordem','Ordem no treino','number',true],['observacoes','Observações','textarea',false]
  ],columns:[['treino_id','Treino'],['exercicio_id','Exercício'],['series','Séries'],['repeticoes','Repetições'],['ordem','Ordem'],['observacoes','Observações']]}
};

function activeKind() {return state.page==='treinos' && ['treino_exercicios','treinos_aluno'].includes(state.workoutTab) ? state.workoutTab : state.page;}
function formatCell(kind,row,key) {
  const val=row[key];
  if (key==='computed_status') return fmtStatus(studentStatus(row));
  if (key==='status') return fmtStatus(val || '—');
  if (kind==='exercicios' && key==='nome') return `<span class="exercise-admin-name">${exerciseImageHTML(row)}<strong>${esc(val)}</strong></span>`;
  if (kind==='exercicios' && key==='regiao') return `<span class="gold-region">${esc(val||'Não definida')}</span>`;
  if (key==='id') return `<span style="color:var(--muted)">#${String(val).padStart(4,'0')}</span>`;
  if (key==='valor') return `<strong style="color:var(--text)">${money(val)}</strong>`;
  if (key==='duracao_meses') return `${esc(val)} ${Number(val)===1?'mês':'meses'}`;
  if (key.startsWith('data_')) return esc(ptDate(val));
  if (key==='aluno_id'||key==='professor_id'||key==='plano_id'||key==='treino_id'||key==='exercicio_id') {
    const kindMap={aluno_id:'alunos',professor_id:'professores',plano_id:'planos',treino_id:'treinos',exercicio_id:'exercicios'};
    return esc(label(kindMap[key],val));
  }
  if (key==='matricula_id') {const m=find('matriculas',val);return esc(m ? label('alunos',m.aluno_id):'#'+val);}
  if (key==='nome' && (kind==='alunos'||kind==='professores')) return `<span class="name-cell"><span class="person-avatar">${esc(initials(val))}</span><span><strong>${esc(val)}</strong>${kind==='alunos'?`<small>${esc(row.email)}</small>`:''}</span></span>`;
  return esc(val||'—');
}

function sectionSummary(kind) {
  const total=db[kind].length;
  const visible=filteredRows(kind).length;
  const meaningful={
    alunos:{label:'Alunos com matrícula ativa',number:db.alunos.filter(a=>studentStatus(a)==='Ativo').length,icon:'check'},
    professores:{label:'Professores com treinos',number:new Set(db.treinos.map(t=>t.professor_id)).size,icon:'dumbbell'},
    planos:{label:'Planos ativos',number:db.planos.filter(p=>p.status==='Ativo').length,icon:'check'},
    matriculas:{label:'Matrículas ativas',number:db.matriculas.filter(m=>m.status==='Ativa').length,icon:'check'},
    pagamentos:{label:'Pagamentos recebidos',number:db.pagamentos.filter(p=>p.status==='Pago').length,icon:'check'},
    treinos:{label:'Exercícios associados',number:db.treino_exercicios.length,icon:'dumbbell'},
    treino_exercicios:{label:'Treinos com exercícios',number:new Set(db.treino_exercicios.map(r=>r.treino_id)).size,icon:'dumbbell'},
    treinos_aluno:{label:'Alunos com treinos próprios',number:new Set(db.treinos_aluno.map(r=>r.aluno_id)).size,icon:'users'},
    exercicios:{label:'Exercícios em treinos',number:new Set(db.treino_exercicios.map(r=>r.exercicio_id)).size,icon:'check'}
  }[kind];
  const entries=[
    {label:'Total de registros',number:total,icon:'grid'},
    {label:'Resultados da pesquisa',number:visible,icon:'search'},
    meaningful
  ];
  return `<section class="section-insights" aria-label="Indicadores de ${esc(pageLabels[kind]||'treinos')}">${entries.map((entry,i)=>`<article class="insight-card" style="--insight-order:${i}"><div class="insight-head"><span>${esc(entry.label)}</span>${svg(entry.icon)}</div><strong class="insight-value" data-counter="${entry.number}" data-format="int">0</strong><div class="insight-track"><i style="--fill:${Math.min(100,Math.max(8,total?entry.number/total*100:0))}%"></i></div></article>`).join('')}</section>`;
}
function tableSkeleton() {
  return `<div class="table-skeleton" id="tableSkeleton" aria-hidden="true"><div class="skeleton-row skeleton-header"><i></i><i></i><i></i><i></i></div>${Array.from({length:5},(_,i)=>`<div class="skeleton-row" style="--skeleton-index:${i}"><i></i><i></i><i></i><i></i></div>`).join('')}</div>`;
}

function listPage() {
  const kind=activeKind(),cfg=schemas[kind];
  const isWorkout=state.page==='treinos';
  const btn=`${kind==='matriculas' && !db.matriculas.some(r=>r.demo_extra)?`<button class="btn btn-ghost boost-btn" data-action="expand-demo">${svg('trending')} Ampliar demonstração</button>`:''}<button class="btn btn-ghost" data-action="export">${svg('download')} Exportar CSV</button>${kind==='treinos_aluno'?'':`<button class="btn btn-primary" data-action="new" data-kind="${kind}">${svg('plus')} Novo ${esc(cfg.one)}</button>`}`;
  const title=pageLabels[state.page];
  const tabs=isWorkout?`<div class="tabs" role="tablist" aria-label="Seções de treino"><button class="tab ${kind==='treinos'?'active':''}" role="tab" aria-selected="${kind==='treinos'}" data-tab="treinos">Treinos</button><button class="tab ${kind==='treino_exercicios'?'active':''}" role="tab" aria-selected="${kind==='treino_exercicios'}" data-tab="treino_exercicios">Exercícios dos treinos</button><button class="tab ${kind==='treinos_aluno'?'active':''}" role="tab" aria-selected="${kind==='treinos_aluno'}" data-tab="treinos_aluno">Montados pelos alunos</button></div>`:'';
  const hasStatus=kind==='alunos'||['planos','matriculas','pagamentos'].includes(kind);
  return `<div class="main-area">${titleArea(title, cfg.desc,btn,'plus','GERENCIAMENTO')}
  ${kind==='exercicios'?adminMuscleGallery():''}
  <section class="panel table-panel"><div class="panel-header"><div><h2>${kind==='treino_exercicios'?'Séries e exercícios':`Todos os ${esc(title.toLocaleLowerCase('pt-BR'))}`}</h2><p class="panel-caption">Consulte, pesquise, filtre e gerencie registros de demonstração.</p></div><span class="demo-tag"><i></i> Modo demonstração</span></div>
  ${sectionSummary(kind)}${tabs}<div class="table-toolbar"><div class="filters-left"><label class="search-inline">${svg('search')}<input class="table-search-input" id="tableSearch" type="search" autocomplete="off" placeholder="Pesquisar registros..." value="${esc(state.search)}" aria-label="Pesquisar registros"></label>
  ${kind==='exercicios'?`<select class="panel-select" id="adminExerciseGroup" aria-label="Filtrar por grupo muscular"><option value="">Todos os grupos</option>${[...new Set(db.exercicios.map(e=>e.grupo_muscular).filter(Boolean))].map(group=>`<option value="${esc(group)}" ${state.exerciseGroup===group?'selected':''}>${esc(group)}</option>`).join('')}</select><select class="panel-select" id="adminExerciseRegion" aria-label="Filtrar por região muscular"><option value="">Todas as regiões</option>${[...new Set(db.exercicios.filter(e=>!state.exerciseGroup||e.grupo_muscular===state.exerciseGroup).map(e=>e.regiao).filter(Boolean))].map(region=>`<option value="${esc(region)}" ${state.exerciseRegion===region?'selected':''}>${esc(region)}</option>`).join('')}</select>`:''}
    ${hasStatus?`<select class="panel-select" id="statusFilter" aria-label="Filtrar por status"><option value="todos">Todos os status</option><option value="ativos" ${state.status==='ativos'?'selected':''}>Ativos / pagos</option><option value="pendentes" ${state.status==='pendentes'?'selected':''}>Pendentes</option><option value="inativos" ${state.status==='inativos'?'selected':''}>Inativos</option></select>`:''}
  <select class="panel-select" id="sortFilter" aria-label="Ordenação"><option value="recentes" ${state.sort==='recentes'?'selected':''}>Mais recentes</option><option value="antigos" ${state.sort==='antigos'?'selected':''}>Mais antigos</option><option value="az" ${state.sort==='az'?'selected':''}>A–Z</option></select>
  <button class="btn btn-ghost" data-action="clear-filters" title="Limpar filtros">${svg('reset')} Limpar</button></div><span class="records-count" id="recordsCount"></span></div>
  <p class="mobile-table-hint">${svg('arrow')} Deslize a tabela para ver mais colunas e os botões de edição.</p><div class="table-stage">${tableSkeleton()}<div class="table-container"><table class="data-table"><thead><tr>${cfg.columns.map(([,label])=>`<th>${esc(label)}</th>`).join('')}<th>Ações</th></tr></thead><tbody id="tableBody"></tbody></table><div id="emptyResults" hidden></div></div></div><nav id="tablePagination" class="table-pagination" aria-label="Paginação dos registros"></nav>
  <p class="table-footnote">Os cadastros realizados aqui são salvos somente neste navegador. A conexão com Flask e MySQL será feita posteriormente.</p>
  </section>${footer()}</div>`;
}
function filteredRows(kind) {
  const cfg=schemas[kind];let rows=[...(db[kind]||[])];
  const s=state.search.trim().toLocaleLowerCase('pt-BR');
  if(s) rows=rows.filter(row=>cfg.columns.map(([key])=>String(formatPlain(kind,row,key))).join(' ').toLocaleLowerCase('pt-BR').includes(s));
  if(kind==='exercicios'){if(state.exerciseGroup)rows=rows.filter(e=>e.grupo_muscular===state.exerciseGroup);if(state.exerciseRegion)rows=rows.filter(e=>e.regiao===state.exerciseRegion);}
  if(state.status!=='todos' && ['alunos','planos','matriculas','pagamentos'].includes(kind)) {
    rows=rows.filter(row=>{const value=(kind==='alunos'?studentStatus(row):row.status)||'';
      if(state.status==='ativos') return ['Ativo','Ativa','Pago'].includes(value);
      if(state.status==='pendentes') return value==='Pendente';
      return ['Inativo','Inativa','Cancelada','Cancelado'].includes(value);
    });
  }
  rows.sort((a,b)=>{if(state.sort==='az') return String(a.nome||a.id||'').localeCompare(String(b.nome||b.id||''),'pt-BR');return state.sort==='antigos'?Number(a.id)-Number(b.id):Number(b.id)-Number(a.id);});
  return rows;
}
function formatPlain(kind,row,key) {
  if(key==='computed_status') return studentStatus(row);
  if(key==='matricula_id') {const m=find('matriculas',row.matricula_id);return label('alunos',m?.aluno_id);}
  const foreign={aluno_id:'alunos',plano_id:'planos',professor_id:'professores',treino_id:'treinos',exercicio_id:'exercicios'};
  if(foreign[key]) return label(foreign[key],row[key]);
  return String(row[key]??'');
}
function renderTable(options={}) {
  const tbody=$('#tableBody');if(!tbody)return;
  const kind=activeKind(),cfg=schemas[kind],rows=filteredRows(kind);
  const totalPages=Math.max(1,Math.ceil(rows.length/pageSize));
  state.tablePage=Math.min(Math.max(1,state.tablePage),totalPages);
  const start=(state.tablePage-1)*pageSize;
  const shown=rows.slice(start,start+pageSize);
  tbody.innerHTML=shown.map((row,i)=>`<tr class="${options.animate?'table-row-enter':''}" style="--row-index:${i}">${cfg.columns.map(([key])=>`<td>${formatCell(kind,row,key)}</td>`).join('')}<td><div class="table-actions">${kind==='treinos_aluno'?`<button class="action-btn" title="Visualizar" aria-label="Visualizar treino pessoal" data-action="view-personal" data-id="${row.id}">${svg('book')}</button><button class="action-btn danger" title="Excluir" aria-label="Excluir treino pessoal" data-action="remove-personal" data-id="${row.id}">${svg('trash')}</button>`:`<button class="action-btn" title="Editar" aria-label="Editar registro" data-action="edit" data-kind="${kind}" data-id="${row.id}">${svg('edit')}</button><button class="action-btn danger" title="Excluir" aria-label="Excluir registro" data-action="delete" data-kind="${kind}" data-id="${row.id}">${svg('trash')}</button>`}</div></td></tr>`).join('');
  $('#recordsCount').textContent=`${rows.length} de ${db[kind].length} registro${db[kind].length!==1?'s':''}`;
  const empty=$('#emptyResults');empty.hidden=rows.length>0;
  empty.innerHTML=rows.length?'':`<div class="empty-state">${svg('search')}<h3>Nenhum resultado encontrado</h3><p>Altere a pesquisa ou remova os filtros para continuar.</p></div>`;
  const pagination=$('#tablePagination');
  if(pagination){
    pagination.hidden=rows.length<=pageSize;
    pagination.innerHTML=totalPages>1?`<span>Exibindo ${start+1}–${Math.min(start+pageSize,rows.length)} de ${rows.length}</span><div class="pagination-buttons"><button class="page-nav" data-action="pagination" data-direction="prev" ${state.tablePage===1?'disabled':''} aria-label="Página anterior">‹</button>${Array.from({length:totalPages},(_,i)=>i+1).filter(n=>n===1||n===totalPages||Math.abs(n-state.tablePage)<=1).map((num,i,arr)=>`${i>0 && num-arr[i-1]>1?'<span class="pagination-ellipsis">…</span>':''}<button class="page-nav ${num===state.tablePage?'current':''}" data-action="pagination" data-pagenum="${num}" aria-label="Página ${num}" ${num===state.tablePage?'aria-current="page"':''}>${num}</button>`).join('')}<button class="page-nav" data-action="pagination" data-direction="next" ${state.tablePage===totalPages?'disabled':''} aria-label="Próxima página">›</button></div>`:'';
  }
  const insightValues=$$('.insight-value');
  if(insightValues[1]){insightValues[1].dataset.counter=String(rows.length);insightValues[1].textContent=rows.length.toLocaleString('pt-BR');}
  if(options.animate && !reduceMotion()) {
    tbody.querySelectorAll('.table-row-enter').forEach(row=>row.addEventListener('animationend',()=>row.classList.remove('table-row-enter'),{once:true}));
  }
}

function updateCounter() {
  const reduce = reduceMotion();
  $$('.stat-number[data-counter],.insight-value[data-counter]').forEach(el=>{
    const end=Number(el.dataset.counter),format=el.dataset.format;
    const render=n=>format==='currency'?money(n):Math.round(n).toLocaleString('pt-BR');
    if(reduce||end===0){el.textContent=render(end);return;}
    const started=performance.now(),duration=1450;
    function frame(now){if(!el.isConnected)return;const p=Math.min((now-started)/duration,1);const eased=1-Math.pow(1-p,3);el.textContent=render(end*eased);if(p<1)requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  });
}
function animateEntrance(page) {
  if(pageEnterTimer) clearTimeout(pageEnterTimer);
  const body=$('.main-area');
  if(!body)return;
  body.classList.add('content-arriving');
  if(routeTimer)clearTimeout(routeTimer);
  routeTimer=setTimeout(()=>{if(body.isConnected)body.classList.remove('content-arriving');},reduceMotion()?0:1250);
  const progress=$('#routeProgress');
  if(progress){progress.classList.remove('progress-playing');void progress.offsetWidth;progress.classList.add('progress-playing');}
  const loading=$('#tableSkeleton');
  if(loading) {
    const stage=loading.closest('.table-stage');
    stage?.classList.add('is-loading');
    pageEnterTimer=setTimeout(()=>{
      if(loading.isConnected){loading.classList.add('is-complete');stage?.classList.remove('is-loading');}
    },reduceMotion()?0:410);
  }
  body.querySelectorAll('.insight-card,.stat-card,.panel').forEach((node,i)=>node.style.setProperty('--entrance-index',String(i)));
}
function navigate(page,options={}) {
  if (!userSession) return;
  if (userSession.role === 'professor') {
    if (!teacherPageLabels[page]) page='prof_inicio';
    const oldPage=state.page;state.page=page;
    $$('.nav-item').forEach(el=>{el.classList.toggle('active',el.dataset.page===page);el.setAttribute('aria-current',el.dataset.page===page?'page':'false');});
    $('#breadcrumbCurrent').textContent=teacherPageLabels[page];
    $('#mainContent').innerHTML=renderTeacherPage(page);
    animateEntrance(page);updateCounter();closeSidebar();closeNotification();
    if(!options.skipHash)history.replaceState(null,'',`#${page}`);
    if(oldPage!==page)window.scrollTo({top:0,behavior:'instant'});
    return;
  }
  if (userSession.role === 'aluno') {
    if (!studentPageLabels[page]) page='aluno_inicio';
    const oldPage=state.page;
    state.page=page;
    $$('.nav-item').forEach(el=>{el.classList.toggle('active',el.dataset.page===page);el.setAttribute('aria-current',el.dataset.page===page?'page':'false');});
    $('#breadcrumbCurrent').textContent=studentPageLabels[page];
    $('#mainContent').innerHTML=renderStudentPage(page);
    animateEntrance(page);updateCounter();closeSidebar();closeNotification();
    if(!options.skipHash)history.replaceState(null,'',`#${page}`);
    if(oldPage!==page)window.scrollTo({top:0,behavior:'instant'});
    return;
  }
  if(!pageLabels[page])page='dashboard';
  const oldPage=state.page;
  state.page=page;
  if(!options.preserveFilter){state.search=options.search||'';state.status='todos';state.sort='recentes';state.tablePage=1;state.exerciseGroup='';state.exerciseRegion='';}
  // Trocar a seção conserva o menu, o tema e os dados já inseridos.
  $$('.nav-item').forEach(el=>{el.classList.toggle('active',el.dataset.page===page);el.setAttribute('aria-current',el.dataset.page===page?'page':'false');});
  $('#breadcrumbCurrent').textContent=pageLabels[page];
  $('#mainContent').innerHTML=page==='dashboard'?dashboard():listPage();
  if(page!=='dashboard')renderTable({animate:true});
  animateEntrance(page);
  updateCounter();
  closeSidebar();closeNotification();
  if(!options.skipHash)history.replaceState(null,'',`#${page}`);
  if(oldPage!==page)window.scrollTo({top:0,behavior:'instant'});
}

function optionsFor(type) {
  if(type.startsWith('select_')){
    const kind=type.replace('select_','');
    return db[kind].map(row=>({value:String(row.id),label:kind==='matriculas'?`#${String(row.id).padStart(4,'0')} — ${label('alunos',row.aluno_id)} (${label('planos',row.plano_id)})`:row.nome}));
  }
  return {
    status_plano:[['Ativo','Ativo'],['Inativo','Inativo']],
    status_matricula:[['Ativa','Ativa'],['Pendente','Pendente'],['Cancelada','Cancelada']],
    status_pagamento:[['Pendente','Pendente'],['Pago','Pago'],['Cancelado','Cancelado']],
    forma:[['PIX','PIX'],['Cartão','Cartão'],['Dinheiro','Dinheiro'],['Boleto','Boleto']]
  }[type]?.map(([value,label])=>({value,label}))||[];
}
function inputFor(kind,field,row={}){
  const [key,title,type,required]=field;
  let value=row[key];
  if(value===undefined||value===null){
    if(['data_cadastro','data_criacao','data_inicio','data_vencimento'].includes(key))value=localDate(0);
    else if(key==='status')value=kind==='matriculas'?'Ativa':kind==='pagamentos'?'Pendente':'Ativo';
    else if(key==='series')value=3;else if(key==='repeticoes')value='12';else if(key==='ordem')value=1;
    else value='';
  }
  const req=required?' required':'';
  const titleId=`f_${key}`;
  const fieldContent=type==='muscle_group'
   ? `<select class="form-control" id="${titleId}" name="${key}" ${req}><option value="">Selecione um grupo</option>${[...new Set(SG_REGIONS.map(r=>r.grupo))].map(g=>`<option value="${esc(g)}" ${String(value)===g?'selected':''}>${esc(g)}</option>`).join('')}</select>`
   : type==='muscle_region'
    ? `<select class="form-control" id="${titleId}" name="${key}" ${req}><option value="">Selecione uma região</option>${SG_REGIONS.filter(r=>!row.grupo_muscular||r.grupo===row.grupo_muscular).map(r=>`<option value="${esc(r.regiao)}" ${String(value)===r.regiao?'selected':''}>${esc(r.regiao)}</option>`).join('')}</select>`
   : type==='textarea' 
   ? `<textarea class="form-control" id="${titleId}" name="${key}" rows="3" ${req} placeholder="${esc(title)}">${esc(value)}</textarea>`
   : type.startsWith('select_')||type.startsWith('status_')||type==='forma'
     ? `<select class="form-control" id="${titleId}" name="${key}" ${req}><option value="">Selecione...</option>${optionsFor(type).map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(value)?'selected':''}>${esc(o.label)}</option>`).join('')}</select>`
     : `<input class="form-control" id="${titleId}" name="${key}" type="${type}" value="${esc(value)}" ${req} ${type==='number'?'min="0" step="any"':''} placeholder="${esc(title)}" autocomplete="off">`;
  return `<div class="field ${type==='textarea'||key==='endereco'?'full':''}"><label for="${titleId}">${esc(title)}${required?' *':''}</label>${fieldContent}</div>`;
}
function modal(html) {
  state.returnFocus=document.activeElement;
  $('#modalDialog').innerHTML=html;
  $('#modalOverlay').hidden=false;
  document.body.style.overflow='hidden';
  $('#modalDialog').querySelector('input,select,button')?.focus();
}
function closeModal() {
  if($('#modalOverlay').hidden)return;
  $('#modalOverlay').hidden=true;$('#modalDialog').innerHTML='';document.body.style.overflow='';
  if(state.returnFocus?.isConnected)state.returnFocus.focus();
}
function modalHeading(title,subtitle){return `<header class="modal-top"><div><p class="eyebrow">SYSTEM GYM • DEMONSTRAÇÃO</p><h2 id="modalTitle">${esc(title)}</h2><p>${esc(subtitle)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Fechar">${svg('x')}</button></header>`;}
function openForm(kind,id=null) {
  if(userSession?.role!=='admin')return;
  const cfg=schemas[kind],row=id===null?null:find(kind,id);
  if(id!==null&&!row)return showToast('Registro não encontrado.','error');
  const verb=id===null?'Cadastrar':'Editar';
  modal(`${modalHeading(`${verb} ${cfg.one}`, 'Os dados serão armazenados somente no seu navegador.')}
  <form id="recordForm" data-kind="${kind}" data-id="${id??''}"><div class="form-grid">${cfg.fields.map(f=>inputFor(kind,f,row||{})).join('')}</div><div class="form-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">${svg('check')} ${id===null?'Salvar cadastro':'Salvar alterações'}</button></div></form>`);
}


async function salvarAlunoNaAPI(form) {
  if (!form.reportValidity()) return;

  const id = form.dataset.id
    ? Number(form.dataset.id)
    : null;

  const dados = Object.fromEntries(
    new FormData(form).entries()
  );

  delete dados.data_cadastro;

  const url = id
    ? `/api/alunos/${id}`
    : '/api/alunos/';

  try {
    const resposta = await fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.erro || 'Erro ao salvar aluno.'
      );
    }

    const consulta = await fetch('/api/alunos/');

    if (!consulta.ok) {
      throw new Error('Aluno salvo, mas houve erro ao atualizar a lista.');
    }

    const alunos = await consulta.json();

    db.alunos = alunos.map(aluno => ({
      ...aluno,
      id: aluno.id_aluno,
      data_cadastro: aluno.data_cadastro
        ? new Date(aluno.data_cadastro).toISOString().slice(0, 10)
        : ''
    }));

    saveData();
    closeModal();
    navigate('alunos');
    showToast('Aluno salvo no MariaDB com sucesso!');

  } catch (erro) {
    showToast(erro.message, 'error');
    console.error(erro);
  }
}


function submitForm(form){
  if(userSession?.role!=='admin')return;
  if(!form.reportValidity())return;
  const kind=form.dataset.kind,id=form.dataset.id?Number(form.dataset.id):null;
  if (kind === 'alunos') {
  return salvarAlunoNaAPI(form);
}
  const row=id===null?{id:Math.max(0,...db[kind].map(r=>Number(r.id)||0))+1}:{...find(kind,id)};
  if(!row?.id)return showToast('Não foi possível localizar o registro.','error');
  for(const [key,,type] of schemas[kind].fields){const raw=new FormData(form).get(key);row[key]=(type==='number'||type.startsWith('select_'))?numeric(raw):String(raw||'').trim();}
  if(kind==='exercicios'){
    if(db.exercicios.some(e=>Number(e.id)!==Number(id) && normExercise(e.nome)===normExercise(row.nome)))return showToast('Já existe um exercício com esse nome no catálogo.','error');
    if(!SG_REGIONS.some(r=>r.grupo===row.grupo_muscular && r.regiao===row.regiao))return showToast('Selecione uma região muscular correspondente ao grupo.','error');
    row.imagem=catalogImage(row);
  }
  if(kind==='matriculas' && row.data_fim < row.data_inicio){return showToast('A data final precisa ser igual ou posterior à inicial.','error');}
  if(kind==='pagamentos' && row.status==='Pago' && !row.data_pagamento)row.data_pagamento=localDate(0);
  if(id===null)db[kind].push(row);else db[kind]=db[kind].map(r=>r.id===id?row:r);
  saveData();closeModal();navigate(state.page,{preserveFilter:true});showToast(id===null?'Cadastro adicionado com sucesso!':'Registro atualizado com sucesso!');refreshNotificationDot();
}
// Calcula a exclusão dos dados relacionados, mantendo a integridade dos registros.
// Os dados são apenas da demonstração no localStorage, não do MySQL.
function deletionPlan(kind,id){
  const plan={};
  const seen=new Set();
  function add(k,recordId){
    if(!find(k,recordId))return;
    const key=`${k}:${recordId}`;
    if(seen.has(key))return;
    seen.add(key);
    if(!plan[k])plan[k]=new Set();
    plan[k].add(Number(recordId));
    const refs={
      alunos:[['matriculas','aluno_id'],['treinos','aluno_id']],
      professores:[['treinos','professor_id']],
      planos:[['matriculas','plano_id']],
      matriculas:[['pagamentos','matricula_id']],
      treinos:[['treino_exercicios','treino_id']],
      exercicios:[['treino_exercicios','exercicio_id']]
    };
    for(const [child,fk] of (refs[k]||[])){
      for(const row of db[child]||[]){
        if(Number(row[fk])===Number(recordId))add(child,row.id);
      }
    }
  }
  add(kind,id);
  return plan;
}
function dependency(kind,id){
  const plan=deletionPlan(kind,id);
  return Object.entries(plan).some(([other,ids])=>other!==kind&&ids.size>0);
}
function deleteRequest(kind,id){
  if(userSession?.role!=='admin')return;
  const row=find(kind,id);
  if(!row)return showToast('Registro não encontrado. Atualize a página e tente novamente.','error');
  const plan=deletionPlan(kind,id);
  const linked=Object.entries(plan).filter(([other])=>other!==kind);
  // Para excluir aluno, a confirmação também explica a exclusão de matrículas,
  // pagamentos, treinos e exercícios vinculados a esses treinos.
  // Para outras entidades, preservamos o bloqueio de exclusão com vínculos.
  if(kind!=='alunos'&&linked.length){
    return showToast('Não é possível excluir: existem registros vinculados. Remova os vínculos primeiro.','error');
  }
  if(kind==='exercicios' && (db.treinos_aluno||[]).some(t=>(t.itens||[]).some(item=>Number(item.exercicio_id)===id))){
    return showToast('Este exercício é utilizado em um treino montado por aluno. Remova o vínculo antes de excluir.','error');
  }
  const typeLabels={matriculas:'matrícula(s)',pagamentos:'pagamento(s)',treinos:'treino(s)',treino_exercicios:'exercício(s) vinculado(s) a treinos'};
  const createdCount=kind==='alunos'?(db.treinos_aluno||[]).filter(t=>Number(t.aluno_id)===id).length:0;
  const details=linked.map(([other,ids])=>`<li><strong>${ids.size}</strong> ${esc(typeLabels[other]||other)}</li>`).join('')+(createdCount?`<li><strong>${createdCount}</strong> treino(s) pessoal(is) montado(s) pelo aluno</li>`:'');
  modal(`${modalHeading(kind==='alunos'?'Excluir aluno':'Excluir registro','Confirme antes de continuar.')}
    <p class="confirm-message">Deseja excluir <strong>${esc(row.nome || '#' + id)}</strong>?</p>
    ${details?`<div class="delete-warning"><strong>Esta ação também excluirá os seguintes dados vinculados:</strong><ul>${details}</ul><p>Os exercícios do catálogo e os demais alunos serão preservados.</p></div>`:''}
    <p class="confirm-message">A exclusão é permanente nos dados de demonstração deste navegador e não pode ser desfeita.</p>
    <div class="form-actions"><button class="btn btn-ghost" data-action="close-modal">Cancelar</button><button class="btn btn-danger" data-action="confirm-delete" data-kind="${kind}" data-id="${id}">${svg('trash')} Confirmar exclusão</button></div>`);
}
function confirmDelete(kind,id){
  if(userSession?.role!=='admin')return;
  if(!find(kind,id))return showToast('Registro não encontrado.','error');
  const plan=deletionPlan(kind,id);
  // Somente alunos podem ser excluídos em cascata nesta versão.
  if(kind!=='alunos'&&dependency(kind,id))return showToast('Existem registros vinculados.','error');
  for(const [table,ids] of Object.entries(plan)){
    db[table]=db[table].filter(row=>!ids.has(Number(row.id)));
  }
  if(kind==='alunos')db.treinos_aluno=db.treinos_aluno.filter(row=>Number(row.aluno_id)!==id);
  saveData();
  closeModal();
  navigate(state.page,{preserveFilter:true});
  refreshNotificationDot();
  showToast(kind==='alunos'?'Aluno e dados vinculados excluídos com sucesso!':'Registro excluído com sucesso!');
}
function toastContainer(){return $('#toastStack');}
function showToast(text,type='success'){
  const el=document.createElement('div');el.className=`toast ${type==='error'?'error':''}`;el.setAttribute('role','status');el.innerHTML=`${svg(type==='error'?'x':'check')}<span>${esc(text)}</span>`;
  toastContainer().append(el);window.setTimeout(()=>{el.classList.add('fade');window.setTimeout(()=>el.remove(),260);},3400);
}
function quickModal(){
  const keys=['alunos','professores','planos','matriculas','pagamentos','treinos','exercicios'];
  const icons={alunos:'users',professores:'badge',planos:'card',matriculas:'calendar',pagamentos:'coins',treinos:'dumbbell',exercicios:'activity'};
  modal(`${modalHeading('Novo cadastro','Escolha o que deseja adicionar ao SYSTEM GYM.')}<div class="quick-grid">${keys.map(k=>`<button class="quick-card" data-action="quick-new" data-kind="${k}">${svg(icons[k])}<strong>${esc(pageLabels[k])}</strong><span>Criar novo registro</span></button>`).join('')}</div>`);
}
function notifyItems(){return db.pagamentos.filter(p=>p.status==='Pendente').sort((a,b)=>String(a.data_vencimento).localeCompare(String(b.data_vencimento))).slice(0,5);}
function refreshNotificationDot(){ $('#notificationDot').hidden=state.notificationRead||notifyItems().length===0; }
function toggleNotifications(){
  if(userSession?.role!=='admin')return;
  const panel=$('#notificationPopover');const willOpen=panel.hidden;
  panel.hidden=!willOpen;$('#notificationButton').setAttribute('aria-expanded',String(willOpen));
  if(!willOpen)return;
  const items=notifyItems();
  panel.innerHTML=`<h3 class="notification-title">Notificações</h3><p class="notification-sub">${items.length} pagamento${items.length===1?'':'s'} pendente${items.length===1?'':'s'} na demonstração.</p>${items.map(p=>{const m=find('matriculas',p.matricula_id);return `<div class="notification-item">${svg('clock')}<div><strong>${esc(label('alunos',m?.aluno_id))} — ${money(p.valor)}</strong><small>Vencimento: ${ptDate(p.data_vencimento)}</small></div></div>`;}).join('')||'<p class="notification-sub">Nenhum aviso pendente.</p>'}<button class="btn btn-ghost" data-action="view-notifications">${svg('arrow')} Ver pagamentos</button>`;
  state.notificationRead=true;refreshNotificationDot();
}
function closeNotification(){$('#notificationPopover').hidden=true;$('#notificationButton').setAttribute('aria-expanded','false');}
function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebarScrim').classList.remove('show');}
function toggleSidebar(){$('#sidebar').classList.toggle('open');$('#sidebarScrim').classList.toggle('show');}
function changeTheme(){
  const light=document.body.classList.toggle('light');
  $('#themeButton').innerHTML=svg(light?'moon':'sun');
  $('#themeButton').title=light?'Ativar tema escuro':'Ativar tema claro';
  $('#themeButton').setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');
  try{localStorage.setItem(THEME_KEY,light?'light':'dark');}catch(e){}
  showToast(light?'Tema claro ativado.':'Tema escuro ativado.');
}
function exportCSV(){
  if(userSession?.role!=='admin')return;
  const kind=activeKind(),cfg=schemas[kind],rows=filteredRows(kind);
  if(!rows.length)return showToast('Não há registros para exportar.','error');
  const csvEsc=value=>{let t=String(value??'');if(/^[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';};
  const lines=[cfg.columns.map(([,label])=>csvEsc(label)).join(';'),...rows.map(row=>cfg.columns.map(([key])=>csvEsc(formatPlain(kind,row,key))).join(';'))];
  const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`system-gym-${kind}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);showToast('Arquivo CSV exportado com sucesso!');
}
function globalSearch(term){
  if(userSession?.role!=='admin')return;
  const query=String(term||'').trim().toLocaleLowerCase('pt-BR');
  if(!query)return;
  const page=pages.find(([key,label])=>key.includes(query)||label.toLocaleLowerCase('pt-BR').includes(query));
  if(page){navigate(page[0]);$('#globalSearch').value='';return;}
  for(const kind of Object.keys(schemas)){
    if(db[kind].some(row=>schemas[kind].columns.some(([key])=>formatPlain(kind,row,key).toLocaleLowerCase('pt-BR').includes(query)))){
      state.workoutTab=['treino_exercicios','treinos_aluno'].includes(kind)?kind:'treinos';
      navigate(['treino_exercicios','treinos_aluno'].includes(kind)?'treinos':kind,{search:query});
      $('#globalSearch').value='';
      showToast(`Exibindo resultados em ${pageLabels[state.page]}.`);
      return;
    }
  }
  showToast('Nenhuma seção ou registro encontrado com esse termo.','error');
}

// Eventos delegados: os botões funcionam mesmo após trocar de página.
document.addEventListener('click',e=>{
  const nav=e.target.closest('.nav-item');if(nav){navigate(nav.dataset.page);return;}
  const link=e.target.closest('[data-page-link]');if(link){navigate(link.dataset.pageLink);return;}
  const tab=e.target.closest('[data-tab]');if(tab){state.workoutTab=tab.dataset.tab;state.search='';state.status='todos';state.sort='recentes';navigate(state.page,{preserveFilter:true});return;}
  const control=e.target.closest('[data-action]');if(control){
    if(userSession?.role!=='admin')return;const action=control.dataset.action,kind=control.dataset.kind,id=Number(control.dataset.id);
    if(action==='expand-demo'){
      const added=addMoreDemoData(db);
      if(added){saveData();navigate('matriculas');refreshNotificationDot();showToast(`${added} novas matrículas de exemplo adicionadas!`);}
      else showToast('Os exemplos adicionais já estão carregados.');
    }
    if(action==='pagination'){
      const kindNow=activeKind();
      const pagesTotal=Math.max(1,Math.ceil(filteredRows(kindNow).length/pageSize));
      const wanted=Number(control.dataset.pagenum);
      state.tablePage=Number.isFinite(wanted)&&wanted>=1?wanted:Math.max(1,Math.min(pagesTotal,state.tablePage+(control.dataset.direction==='prev'?-1:1)));
      renderTable({animate:true});
      $('.table-panel')?.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'start'});
    }
    if(action==='view-personal')openAdminPersonalWorkout(id);
    if(action==='remove-personal')removeAdminPersonalWorkout(id);
    if(action==='confirm-remove-personal')confirmRemoveAdminPersonalWorkout(id);
    if(action==='quick')quickModal();
    if(action==='quick-new'){closeModal();navigate(kind==='treino_exercicios'?'treinos':kind);openForm(kind);}
    if(action==='new')openForm(kind);
    if(action==='edit')openForm(kind,id);
    if(action==='delete')deleteRequest(kind,id);
    if(action==='confirm-delete')confirmDelete(kind,id);
    if(action==='close-modal')closeModal();
    if(action==='export')exportCSV();
    if(action==='clear-filters'){state.search='';state.status='todos';state.sort='recentes';state.exerciseGroup='';state.exerciseRegion='';navigate(state.page,{preserveFilter:true});showToast('Filtros removidos.');}
    if(action==='view-notifications'){closeNotification();navigate('pagamentos');state.status='pendentes';navigate('pagamentos',{preserveFilter:true});}
    return;
  }
  if(e.target===$('#modalOverlay'))closeModal();
  if(!e.target.closest('.notification-wrap'))closeNotification();
});
document.addEventListener('input',e=>{
  if(userSession?.role==='admin' && e.target.id==='tableSearch'){state.search=e.target.value;state.tablePage=1;renderTable({animate:true});}
});
document.addEventListener('change',e=>{
  if(userSession?.role==='admin' && e.target.id==='statusFilter'){state.status=e.target.value;state.tablePage=1;renderTable({animate:true});}
  if(userSession?.role==='admin' && e.target.id==='sortFilter'){state.sort=e.target.value;state.tablePage=1;renderTable({animate:true});}
  if(userSession?.role==='admin' && e.target.id==='adminExerciseGroup'){
    state.exerciseGroup=e.target.value;state.exerciseRegion='';state.tablePage=1;
    const regionSelect=$('#adminExerciseRegion');
    regionSelect.innerHTML='<option value="">Todas as regiões</option>'+[...new Set(db.exercicios.filter(x=>!state.exerciseGroup||x.grupo_muscular===state.exerciseGroup).map(x=>x.regiao).filter(Boolean))].map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
    renderTable({animate:true});
  }
  if(userSession?.role==='admin' && e.target.id==='adminExerciseRegion'){state.exerciseRegion=e.target.value;state.tablePage=1;renderTable({animate:true});}
  if(userSession?.role==='admin' && e.target.id==='f_grupo_muscular'){
    const regionSelect=$('#f_regiao');if(regionSelect)regionSelect.innerHTML='<option value="">Selecione uma região</option>'+SG_REGIONS.filter(r=>r.grupo===e.target.value).map(r=>`<option value="${esc(r.regiao)}">${esc(r.regiao)}</option>`).join('');
  }
  if(userSession?.role==='admin' && e.target.id==='chartPeriod'){state.period=Number(e.target.value);navigate('dashboard');}
});
document.addEventListener('submit',e=>{if(e.target.id==='recordForm'){e.preventDefault();submitForm(e.target);}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!$('#modalOverlay').hidden)closeModal();else{closeNotification();closeSidebar();}}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus();}
  if(e.key==='Enter' && e.target.id==='globalSearch'){e.preventDefault();globalSearch(e.target.value);}
  // Mantém navegação de teclado dentro do modal.
  if(e.key==='Tab'&&!$('#modalOverlay').hidden){const focusable=$$('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])',$('#modalDialog'));if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
$('#menuButton').addEventListener('click',toggleSidebar);
$('#closeSidebar').addEventListener('click',closeSidebar);
$('#sidebarScrim').addEventListener('click',closeSidebar);
$('#themeButton').addEventListener('click',changeTheme);
$('#notificationButton').addEventListener('click',toggleNotifications);
$('.brand').addEventListener('click',e=>{e.preventDefault();navigate(userSession?.role==='aluno'?'aluno_inicio':'dashboard');});
try{if(localStorage.getItem(THEME_KEY)==='light'){document.body.classList.add('light');$('#themeButton').innerHTML=svg('moon');$('#themeButton').title='Ativar tema escuro';}}catch(e){}
refreshNotificationDot();
// A inicialização da navegação ocorre após carregar portal.js, que define o ambiente do aluno.



async function carregarAlunosDaAPI() {
  try {
    const resposta = await fetch('/api/alunos/');

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os alunos.');
    }

    const alunos = await resposta.json();

    db.alunos = alunos.map(aluno => ({
      ...aluno,
      id: aluno.id_aluno,
      data_cadastro: aluno.data_cadastro
        ? new Date(aluno.data_cadastro).toISOString().slice(0, 10)
        : ''
    }));

    saveData();

    console.log('Alunos carregados do MariaDB:', db.alunos.length);
  } catch (erro) {
    console.error('Erro ao carregar alunos:', erro);
  }
}

// Carregar alunos reais do MariaDB ao iniciar o sistema
carregarAlunosDaAPI().then(() => {
  if (userSession?.role === 'admin') {
    navigate(state.page, { preserveFilter: true });
  }
});
