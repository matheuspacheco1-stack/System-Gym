/* SYSTEM GYM — ambientes demonstrativos Admin / Aluno.
   ATENÇÃO: escolher um perfil AQUI NÃO É AUTENTICAÇÃO.
   A proteção real de registros e rotas depende do backend Flask. */
'use strict';

function currentStudent(){
  return userSession?.role==='aluno' ? db.alunos.find(a=>Number(a.id)===userSession.alunoId) : null;
}
function studentEnrollments(){
  return db.matriculas.filter(m=>Number(m.aluno_id)===userSession?.alunoId)
    .sort((a,b)=>String(b.data_inicio).localeCompare(String(a.data_inicio)) || Number(b.id)-Number(a.id));
}
function studentAssignedWorkouts(){
  return db.treinos.filter(t=>Number(t.aluno_id)===userSession?.alunoId);
}
function studentCustomWorkouts(){
  return db.treinos_aluno.filter(t=>Number(t.aluno_id)===userSession?.alunoId);
}
function studentGreeting(){
  const name=currentStudent()?.nome?.split(' ')[0]||'Aluno';
  const hour=new Date().getHours();
  return `${hour<12?'Bom dia':hour<18?'Boa tarde':'Boa noite'}, ${name}!`;
}
function studentStatusCard(m){
  if(!m)return '<span class="status inactive">Nenhuma matrícula</span>';
  return fmtStatus(m.status||'Pendente');
}
function studentWorkoutPreview(t,custom=false){
  const count=custom ? (t.itens||[]).length : db.treino_exercicios.filter(x=>Number(x.treino_id)===Number(t.id)).length;
  const author=custom ? 'Criado por você' : `Prof. ${label('professores',t.professor_id)}`;
  const action=custom?'open-custom':'open-assigned';
  return `<article class="workout-tile">
    <div class="tile-top"><span class="tile-icon">${svg(custom?'book':'dumbbell')}</span><span class="tiny-tag ${custom?'custom':''}">${custom?'MEU TREINO':'PRESCRITO'}</span></div>
    <h3>${esc(t.nome)}</h3><p>${esc(t.descricao||'Ficha de exercícios da academia.')}</p>
    <div class="tile-meta"><span>${svg('user')} ${esc(author)}</span><span>${svg('activity')} ${count} exercício${count===1?'':'s'}</span></div>
    <div class="tile-buttons"><button class="btn btn-primary" data-student-action="${action}" data-id="${Number(t.id)}">${svg('arrow')} Visualizar ficha</button>
    ${custom?`<button class="btn btn-ghost" title="Excluir treino montado" data-student-action="remove-custom" data-id="${Number(t.id)}">${svg('trash')}</button>`:''}</div>
  </article>`;
}
function studentOverview(){
  const student=currentStudent(),enrollments=studentEnrollments(),enrollment=enrollments[0];
  const assigned=studentAssignedWorkouts(),own=studentCustomWorkouts();
  const plan=enrollment?find('planos',enrollment.plano_id):null;
  const subtitle='Acesse suas fichas prontas, monte um treino e confira sua matrícula.';
  return `<div class="main-area student-main">
    ${titleArea('Meu painel',studentGreeting()+' '+subtitle,`<span class="demo-tag"><i></i> Perfil aluno · Demonstração</span>`,'user','ÁREA DO ALUNO')}
    <div class="stats-grid student-stats">
      ${statCard('Treinos prescritos',assigned.length,`<span class="positive">${svg('check')} Preparados pelos professores</span>`,'dumbbell')}
      ${statCard('Treinos montados',own.length,`<span class="positive">${svg('activity')} Criados por você</span>`,'book')}
      ${statCard('Matrículas vinculadas',enrollments.length,`<span class="positive">${svg('calendar')} Apenas seus registros</span>`,'calendar')}
      <article class="stat-card student-highlight-card"><div class="stat-header"><span>Plano atual</span><span class="stat-icon">${svg('card')}</span></div><strong>${esc(plan?.nome||'Sem plano')}</strong><div class="stat-bottom">${studentStatusCard(enrollment)}</div></article>
    </div>
    <div class="student-dashboard-grid">
      <article class="panel student-hero"><div class="hero-glow"></div><span class="eyebrow">SEU ESPAÇO DE TREINO</span><h2>Seu progresso começa aqui.</h2><p>Confira a ficha que o professor preparou e acompanhe cada exercício, série e repetição.</p>
        <button class="btn btn-primary" data-student-page="aluno_treinos">${svg('dumbbell')} Ver treinos prontos</button>
      </article>
      <article class="panel student-shortcuts"><div class="panel-header"><div><h2>Acesso rápido</h2><p class="panel-caption">Tudo o que você precisa, em um lugar.</p></div></div>
        <button data-student-page="aluno_montar" class="student-shortcut">${svg('plus')}<span><strong>Montar um treino</strong><small>Escolher exercícios do catálogo</small></span><b>›</b></button>
        <button data-student-page="aluno_matricula" class="student-shortcut">${svg('calendar')}<span><strong>Minha matrícula</strong><small>Plano, datas e situação</small></span><b>›</b></button>
      </article>
    </div>
    <section class="student-section-heading"><div><h2>Treinos atribuídos a você</h2><p>Consulte a ficha que seu professor cadastrou.</p></div><button class="text-link" data-student-page="aluno_treinos">Ver todos ${svg('arrow')}</button></section>
    <div class="workout-grid">${assigned.length ? assigned.slice(0,3).map(t=>studentWorkoutPreview(t)).join('') : `<div class="panel student-empty">${svg('dumbbell')}<h3>Nenhum treino prescrito ainda</h3><p>Assim que o administrador cadastrar um treino para seu perfil, ele aparecerá aqui.</p></div>`}</div>
    ${footer()}
  </div>`;
}
function studentWorkoutsPage(){
  const assigned=studentAssignedWorkouts(),own=studentCustomWorkouts();
  return `<div class="main-area student-main">
    ${titleArea('Treinos prontos','Veja as fichas cadastradas pelos professores e os treinos que você montou.',`<button class="btn btn-primary" data-student-page="aluno_montar">${svg('plus')} Montar treino</button>`,'dumbbell','ÁREA DO ALUNO')}
    <div class="student-section-heading"><div><h2>Preparados para você</h2><p>Treinos prescritos são somente para visualização.</p></div><span class="counter-pill">${assigned.length} ficha${assigned.length===1?'':'s'}</span></div>
    <div class="workout-grid">${assigned.length?assigned.map(t=>studentWorkoutPreview(t)).join(''):`<div class="panel student-empty">${svg('dumbbell')}<h3>Seu professor ainda não atribuiu um treino</h3><p>Se desejar testar, selecione a aluna Mariana Costa ou peça ao administrador para cadastrar um treino para este aluno.</p></div>`}</div>
    <div class="student-section-heading student-section-space"><div><h2>Treinos que você montou</h2><p>Essas fichas são pessoais e diferentes dos treinos prescritos.</p></div><span class="counter-pill">${own.length} treino${own.length===1?'':'s'}</span></div>
    <div class="workout-grid">${own.length?own.map(t=>studentWorkoutPreview(t,true)).join(''):`<div class="panel student-empty">${svg('plus')}<h3>Monte seu primeiro treino</h3><p>Escolha exercícios do catálogo e organize séries e repetições.</p><button class="btn btn-primary" data-student-page="aluno_montar">Começar</button></div>`}</div>
    ${footer()}
  </div>`;
}
function studentBuilderPage(){
  const groups=SG_GROUPS.filter(g=>db.exercicios.some(e=>e.grupo_muscular===g.nome));
  const countRegion=(grupo,regiao)=>db.exercicios.filter(e=>e.grupo_muscular===grupo&&e.regiao===regiao).length;
  // Começa sempre pela etapa 1 ao abrir a página.
  selectedExerciseGroup='';selectedExerciseRegion='';
  return `<div class="main-area student-main">
    ${titleArea('Montar treino','Escolha um grupo muscular, toque na região do corpo e adicione os exercícios desejados.',`<button class="btn btn-ghost" data-student-page="aluno_treinos">${svg('arrow')} Meus treinos</button>`,'plus','ÁREA DO ALUNO')}
    <div class="catalog-summary panel"><span class="catalog-summary-icon">${svg('activity')}</span><div><strong>${db.exercicios.length} exercícios disponíveis</strong><p>${groups.length} grupos musculares • ${SG_REGIONS.length} regiões organizadas • imagens anatômicas</p></div><span class="demo-tag"><i></i> Catálogo ilustrativo</span></div>
    <form id="studentWorkoutForm" class="student-builder-grid">
      <div class="panel builder-catalog">
        <div class="panel-header"><div><h2>Monte seu treino em 3 etapas</h2><p class="panel-caption">Clique nas imagens para avançar. Você pode voltar e escolher quantos músculos quiser.</p></div><span class="counter-pill"><span id="selectedCount">0</span> escolhidos</span></div>
        <div class="builder-path" id="builderPath" aria-label="Etapas da escolha"><span class="path-step current">1. Grupo</span><span class="path-divider">›</span><span class="path-step">2. Região</span><span class="path-divider">›</span><span class="path-step">3. Exercícios</span></div>
        <section class="builder-choice-stage" id="groupStep" aria-labelledby="groupStageTitle">
          <div class="stage-top"><div><span class="stage-index">ETAPA 01</span><h3 id="groupStageTitle">Qual grupo muscular você vai treinar?</h3></div></div>
          <div class="group-image-grid" id="muscleGroupTabs" aria-label="Escolha um grupo muscular">
            ${groups.map(g=>`<button type="button" class="group-image-button" data-exercise-tab="${esc(g.nome)}" aria-pressed="false"><img src="${esc(g.imagem)}" loading="lazy" alt="Mapa muscular do grupo ${esc(g.nome)}"><span class="group-card-caption"><strong>${esc(g.nome)}</strong><small>${db.exercicios.filter(e=>e.grupo_muscular===g.nome).length} exercícios</small></span><span class="group-card-arrow" aria-hidden="true">›</span></button>`).join('')}
          </div>
        </section>
        <section class="builder-choice-stage" id="regionStep" aria-labelledby="regionStageTitle" hidden>
          <div class="stage-top"><div><span class="stage-index">ETAPA 02</span><h3 id="regionStageTitle">Qual região você deseja enfatizar?</h3><p id="regionStepDescription">Selecione uma região em dourado.</p></div><button type="button" class="btn btn-ghost builder-back" data-builder-back="grupo">‹ Grupos</button></div>
          <div id="muscleRegionCards" class="region-image-grid" aria-label="Escolha uma região muscular"></div>
        </section>
        <section class="builder-choice-stage" id="exerciseStep" aria-labelledby="exerciseStageTitle" hidden>
          <div class="stage-top"><div><span class="stage-index">ETAPA 03</span><h3 id="exerciseStageTitle">Escolha os exercícios</h3><p id="selectedMuscleLabel">Adicione exercícios à sua ficha.</p></div><button type="button" class="btn btn-ghost builder-back" data-builder-back="regiao">‹ Regiões</button></div>
          <div class="builder-filters v6-builder-search"><label class="search-inline">${svg('search')}<input type="search" id="exerciseSearch" placeholder="Pesquisar exercício nesta região..." aria-label="Pesquisar exercício"></label></div>
          <p class="exercise-filter-summary" id="filterResultCount" aria-live="polite"></p>
          <div class="exercise-catalog" id="exerciseCatalog">${db.exercicios.map(exercise=>`<article class="exercise-card" data-exercise-name="${esc(exercise.nome.toLocaleLowerCase('pt-BR'))}" data-exercise-group="${esc(exercise.grupo_muscular||'')}" data-exercise-region="${esc(exercise.regiao||'')}">
            <div class="exercise-main-row">${exerciseImageHTML(exercise,'exercise-card-image')}
              <label class="exercise-pick"><input type="checkbox" class="exercise-checkbox" value="${Number(exercise.id)}"><span class="exercise-checkmark">${svg('check')}</span><span><strong>${esc(exercise.nome)}</strong><small>${esc(exercise.grupo_muscular||'Geral')} / <em>${esc(exercise.regiao||'Ênfase geral')}</em></small></span></label>
            </div><div class="exercise-fields"><label>Séries <input class="form-control exercise-series" type="number" min="1" max="20" value="3" aria-label="Séries para ${esc(exercise.nome)}"></label><label>Repetições <input class="form-control exercise-reps" type="text" maxlength="30" value="12" aria-label="Repetições para ${esc(exercise.nome)}"></label></div>
          </article>`).join('')}</div>
          <p class="builder-no-results" id="exerciseNoResults" hidden>Nenhum exercício com esse nome nesta região. Tente outra busca.</p>
          <button type="button" class="btn btn-ghost builder-more" data-builder-back="grupo">${svg('plus')} Adicionar de outro grupo muscular</button>
        </section>
      </div>
      <div class="panel builder-details"><div class="builder-sticky"><span class="eyebrow">NOVA FICHA PESSOAL</span><h2>Monte sua ficha</h2><p class="panel-caption">Seu treino é montado com exercícios de diferentes grupos e regiões.</p>
      <label class="form-field">Nome do treino<input class="form-control" id="studentWorkoutName" name="nome" maxlength="80" placeholder="Ex.: Treino A • Peito e tríceps" required></label>
      <label class="form-field">Observações gerais<textarea class="form-control" id="studentWorkoutNotes" name="descricao" maxlength="500" rows="3" placeholder="Anotações para sua ficha"></textarea></label>
      <div class="builder-preview"><strong>Exercícios escolhidos</strong><span><b id="builderCount">0</b> no treino</span></div>
      <div id="selectedExercisePreview" class="selected-exercise-preview"><p>Seu treino está vazio. Selecione exercícios no catálogo.</p></div>
      <button class="btn btn-primary builder-save" type="submit">${svg('check')} Salvar meu treino</button><p class="builder-disclaimer">Protótipo: os dados ficam apenas neste navegador. O destaque em dourado mostra a região de ênfase — os músculos não trabalham isoladamente.</p></div></div>
    </form>${footer()}
  </div>`;
}

let selectedExerciseGroup='';
let selectedExerciseRegion='';
function updateRegionFilters(){
  const groupStep=$('#groupStep'),regionStep=$('#regionStep'),exerciseStep=$('#exerciseStep');
  const container=$('#muscleRegionCards');if(!groupStep||!regionStep||!exerciseStep||!container)return;
  const group=selectedExerciseGroup,region=selectedExerciseRegion;
  groupStep.hidden=Boolean(group);
  regionStep.hidden=!group||Boolean(region);
  exerciseStep.hidden=!group||!region;
  $$('#builderPath .path-step').forEach((step,index)=>{
    const active=region?index===2:group?index===1:index===0;
    step.classList.toggle('current',active);
    step.classList.toggle('completed',!active&&((region&&index<2)||(group&&index===0)));
  });
  if(group){
    $('#regionStepDescription').textContent=`Grupo: ${group}. Clique na imagem da região desejada.`;
    container.innerHTML=SG_REGIONS.filter(r=>r.grupo===group).map(r=>`<button type="button" data-region="${esc(r.regiao)}" class="muscle-region-button" aria-label="Selecionar ${esc(r.regiao)}"><img loading="lazy" src="${esc(r.imagem)}" alt="Destaque anatômico de ${esc(r.regiao)}"><span><strong>${esc(r.regiao)}</strong><small>${db.exercicios.filter(e=>e.grupo_muscular===r.grupo&&e.regiao===r.regiao).length} exercícios</small></span><span class="region-card-arrow" aria-hidden="true">›</span></button>`).join('');
  } else container.innerHTML='';
  if(group&&region){
    $('#exerciseStageTitle').textContent=region;
    $('#selectedMuscleLabel').textContent=`${group} • Selecione os exercícios que deseja incluir na ficha.`;
    const input=$('#exerciseSearch');if(input)input.value='';
  }
  studentExerciseFilters();
}

function studentMembershipPage(){
  const memberships=studentEnrollments(),student=currentStudent();
  const current=memberships.find(m=>m.status==='Ativa')||memberships[0];
  const plan=current?find('planos',current.plano_id):null;
  return `<div class="main-area student-main">
    ${titleArea('Minha matrícula','Aqui você visualiza exclusivamente as matrículas vinculadas ao seu perfil.',`<span class="demo-tag"><i></i> Acesso somente de leitura</span>`,'calendar','ÁREA DO ALUNO')}
    <div class="student-membership-grid">
      <article class="panel membership-feature"><div class="panel-header"><div><span class="eyebrow">RESUMO DA MATRÍCULA</span><h2>${esc(plan?.nome||'Nenhum plano vinculado')}</h2></div>${studentStatusCard(current)}</div>
        ${current?`<div class="membership-metrics"><div><span>Início</span><strong>${esc(ptDate(current.data_inicio))}</strong></div><div><span>Término</span><strong>${esc(ptDate(current.data_fim))}</strong></div><div><span>Valor do plano</span><strong>${money(plan?.valor)}</strong></div><div><span>Identificação</span><strong>#${Number(current.id).toString().padStart(4,'0')}</strong></div></div>`:`<p class="student-message">Ainda não há matrícula vinculada a este aluno. Entre no ambiente do administrador para realizar o cadastro.</p>`}
      </article>
      <article class="panel student-account"><span class="avatar student-big-avatar">${esc(initials(student?.nome))}</span><h2>${esc(student?.nome||'Aluno')}</h2><p>${esc(student?.email||'E-mail não cadastrado')}</p><span class="demo-tag"><i></i> Perfil selecionado para teste</span><p class="student-account-note">Informações de outros alunos não aparecem nesta página.</p></article>
    </div>
    ${memberships.length>1?`<article class="panel membership-history"><h2>Histórico das suas matrículas</h2><div class="table-scroll"><table class="panel-table"><thead><tr><th>Plano</th><th>Início</th><th>Término</th><th>Status</th></tr></thead><tbody>${memberships.map(m=>`<tr><td>${esc(label('planos',m.plano_id))}</td><td>${esc(ptDate(m.data_inicio))}</td><td>${esc(ptDate(m.data_fim))}</td><td>${fmtStatus(m.status)}</td></tr>`).join('')}</tbody></table></div></article>`:''}
    ${footer()}
  </div>`;
}
function renderStudentPage(page){
  if(!currentStudent()) return `<div class="main-area"><h1>Aluno não encontrado</h1><button class="btn btn-primary" id="returnToPortal" data-student-action="switch">Escolher perfil</button></div>`;
  if(page==='aluno_treinos')return studentWorkoutsPage();
  if(page==='aluno_montar')return studentBuilderPage();
  if(page==='aluno_matricula')return studentMembershipPage();
  return studentOverview();
}
function openStudentWorkout(id,custom){
  const t=custom ? studentCustomWorkouts().find(t=>Number(t.id)===id) : studentAssignedWorkouts().find(t=>Number(t.id)===id);
  if(!t)return showToast('Treino não encontrado neste perfil.','error');
  const exercises=custom?(t.itens||[]):db.treino_exercicios.filter(e=>Number(e.treino_id)===id).sort((a,b)=>Number(a.ordem)-Number(b.ordem));
  const rows=exercises.map((item,index)=>{
    const exercise=find('exercicios',item.exercicio_id);
    return `<div class="workout-detail-item"><span class="workout-detail-index">${index+1}</span>${exerciseImageHTML(exercise,'detail-muscle-image')}<div><strong>${esc(exercise?.nome||'Exercício removido do catálogo')}</strong><p>${esc(exercise?.grupo_muscular||'—')} • ${esc(exercise?.regiao||'Ênfase geral')}</p><div class="detail-pills"><span>${Number(item.series)} séries</span><span>${esc(item.repeticoes)} repetições</span></div>${item.observacoes?`<p class="workout-note">${esc(item.observacoes)}</p>`:''}</div></div>`;
  }).join('');
  modal(`${modalHeading(t.nome,custom?'Treino pessoal criado por você.':'Treino prescrito pelo professor para este aluno.')}
    <div class="student-workout-detail"><p class="detail-description">${esc(t.descricao||'Ficha de exercícios')}</p>
    <div class="detail-author">${svg('user')} ${esc(custom?'Criado por você':`Professor: ${label('professores',t.professor_id)}`)}</div>
    ${rows||'<div class="student-empty-inline">Nenhum exercício cadastrado nesta ficha.</div>'}</div>
    <div class="form-actions"><button class="btn btn-primary" data-student-action="close">${svg('check')} Entendi</button></div>`);
}
function saveStudentWorkout(form){
  if(userSession?.role!=='aluno'||!currentStudent())return;
  if(!form.reportValidity())return;
  const exercises=$$('.exercise-card',form).filter(card=>$('.exercise-checkbox',card)?.checked);
  if(!exercises.length)return showToast('Selecione pelo menos um exercício para montar seu treino.','error');
  const itens=[];
  for(const [index,card] of exercises.entries()){
    const exerciseId=Number($('.exercise-checkbox',card).value);
    const serie=Number($('.exercise-series',card).value);
    const reps=$('.exercise-reps',card).value.trim();
    if(!find('exercicios',exerciseId)||!Number.isInteger(serie)||serie<1||serie>20||!reps){showToast('Confira as séries e repetições dos exercícios selecionados.','error');return;}
    itens.push({exercicio_id:exerciseId,series:serie,repeticoes:reps,ordem:index+1,observacoes:''});
  }
  const title=String(new FormData(form).get('nome')||'').trim();
  if(!title)return showToast('Informe o nome do treino.','error');
  const id=Math.max(0,...db.treinos_aluno.map(t=>Number(t.id)||0))+1;
  db.treinos_aluno.push({id,aluno_id:userSession.alunoId,nome:title,descricao:String(new FormData(form).get('descricao')||'').trim(),data_criacao:localDate(0),itens});
  saveData();showToast('Seu treino foi salvo neste navegador!');navigate('aluno_treinos');
}
function removeStudentWorkout(id){
  const target=studentCustomWorkouts().find(t=>Number(t.id)===id);
  if(!target)return showToast('Treino não encontrado neste perfil.','error');
  modal(`${modalHeading('Excluir meu treino','Essa exclusão será feita somente nos dados demonstrativos do navegador.')}
    <p class="confirm-message">Deseja excluir o treino <strong>${esc(target.nome)}</strong> que você montou? Os treinos dos professores não serão modificados.</p>
    <div class="form-actions"><button class="btn btn-ghost" data-student-action="close">Cancelar</button><button class="btn btn-danger" data-student-action="remove-confirm" data-id="${id}">${svg('trash')} Excluir meu treino</button></div>`);
}
function studentExerciseFilters(){
  const search=($('#exerciseSearch')?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase('pt-BR');
  let visible=0;
  $$('.exercise-card').forEach(card=>{
    const normalized=`${card.dataset.exerciseName} ${card.dataset.exerciseRegion}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
    const show=Boolean(selectedExerciseGroup && selectedExerciseRegion) && normalized.includes(search) && selectedExerciseGroup===card.dataset.exerciseGroup && selectedExerciseRegion===card.dataset.exerciseRegion;
    card.hidden=!show;if(show)visible++;
  });
  if($('#exerciseNoResults'))$('#exerciseNoResults').hidden=visible>0;
  if($('#filterResultCount'))$('#filterResultCount').textContent=`${visible} exercício${visible===1?'':'s'} disponível${visible===1?'':'eis'} em ${selectedExerciseRegion||'esta região'}`;
}
function updateStudentSelectedCount(){
  const chosen=$$('.exercise-checkbox:checked');
  if($('#selectedCount'))$('#selectedCount').textContent=String(chosen.length);
  if($('#builderCount'))$('#builderCount').textContent=String(chosen.length);
  $$('.exercise-card').forEach(card=>card.classList.toggle('selected',$('.exercise-checkbox',card).checked));
  const target=$('#selectedExercisePreview');
  if(target){target.innerHTML=chosen.length?chosen.map(input=>{
    const exercise=find('exercicios',Number(input.value));
    return `<div class="chosen-workout-item">${exerciseImageHTML(exercise)}<div><strong>${esc(exercise.nome)}</strong><small>${esc(exercise.regiao||exercise.grupo_muscular)} • ${esc($('.exercise-series',input.closest('.exercise-card')).value||'3')} séries × ${esc($('.exercise-reps',input.closest('.exercise-card')).value||'12')} reps</small></div><button type="button" aria-label="Remover ${esc(exercise.nome)}" class="remove-selected-exercise" data-unselect-exercise="${Number(exercise.id)}">×</button></div>`;
  }).join(''):'<p>Seu treino está vazio. Selecione exercícios no catálogo.</p>';}
}
// Galeria anatômica do administrador: imagem de grupo -> região -> filtro da tabela.
function adminMuscleGallery(){
  const group=state.exerciseGroup;
  const regions=SG_REGIONS.filter(r=>r.grupo===group);
  const groups=SG_GROUPS.filter(g=>db.exercicios.some(e=>e.grupo_muscular===g.nome));
  return `<section class="panel admin-muscle-gallery"><div class="panel-header"><div><h2>Mapa muscular interativo</h2><p class="panel-caption">Escolha uma imagem para filtrar os exercícios. Clique em outra região para trocar.</p></div>${group?`<button class="btn btn-ghost" type="button" data-admin-muscle-reset>${svg('reset')} Todos os grupos</button>`:''}</div>
  ${!group?`<div class="group-image-grid">${groups.map(g=>`<button class="group-image-button" type="button" data-admin-group="${esc(g.nome)}"><img src="${esc(g.imagem)}" loading="lazy" alt="Grupo ${esc(g.nome)}"><span class="group-card-caption"><strong>${esc(g.nome)}</strong><small>${db.exercicios.filter(e=>e.grupo_muscular===g.nome).length} exercícios</small></span><span class="group-card-arrow">›</span></button>`).join('')}</div>`:`<p class="muscle-gallery-breadcrumb">Grupo selecionado: <strong>${esc(group)}</strong> · Escolha uma região:</p><div class="region-image-grid">${regions.map(r=>`<button type="button" class="muscle-region-button ${state.exerciseRegion===r.regiao?'muscle-active':''}" data-admin-region="${esc(r.regiao)}"><img src="${esc(r.imagem)}" loading="lazy" alt="Região ${esc(r.regiao)}"><span><strong>${esc(r.regiao)}</strong><small>${db.exercicios.filter(e=>e.grupo_muscular===group&&e.regiao===r.regiao).length} exercícios</small></span><span class="region-card-arrow">›</span></button>`).join('')}</div>`}
  </section>`;
}
function currentTeacher(){return userSession?.role==='professor'?find('professores',userSession.professorId):null;}
function teacherWorkouts(){return db.treinos.filter(t=>Number(t.professor_id)===Number(userSession?.professorId));}
function teacherOverview(){
  const t=teacherWorkouts();
  return `<div class="main-area student-main">${titleArea(`Olá, ${currentTeacher()?.nome?.split(' ')[0]||'Professor'}!`,'Prepare fichas de treino e acompanhe os alunos.',`<button class="btn btn-primary" data-teacher-page="prof_montar">${svg('plus')} Prescrever treino</button>`,'badge','ÁREA DO PROFESSOR')}
  <div class="teacher-stats"><article class="panel"><strong>${db.alunos.length}</strong><span>Alunos cadastrados</span></article><article class="panel"><strong>${t.length}</strong><span>Treinos prescritos por você</span></article><article class="panel"><strong>${new Set(t.map(x=>Number(x.aluno_id))).size}</strong><span>Alunos com suas fichas</span></article></div>
  <div class="panel teacher-welcome"><h2>Seu espaço profissional</h2><p>Monte uma ficha usando as imagens musculares, selecione o aluno pelo nome e salve. O aluno verá a ficha na área Treinos prontos.</p><button class="btn btn-primary" data-teacher-page="prof_montar">${svg('dumbbell')} Criar prescrição</button></div>${footer()}</div>`;
}
function teacherWorkoutsPage(){
  const t=teacherWorkouts();
  return `<div class="main-area student-main">${titleArea('Treinos prescritos','Fichas que você preparou para os alunos.',`<button class="btn btn-primary" data-teacher-page="prof_montar">${svg('plus')} Novo treino</button>`,'dumbbell','ÁREA DO PROFESSOR')}
  <div class="workout-grid">${t.map(row=>`<article class="workout-tile"><div class="tile-top"><span class="tile-icon">${svg('dumbbell')}</span><span class="tiny-tag">PROFISSIONAL</span></div><h3>${esc(row.nome)}</h3><p>${esc(row.descricao||'Ficha de exercícios')}</p><div class="tile-meta"><span>${svg('user')} ${esc(label('alunos',row.aluno_id))}</span><span>${svg('activity')} ${db.treino_exercicios.filter(e=>Number(e.treino_id)===Number(row.id)).length} exercícios</span></div><div class="teacher-tile-actions"><button type="button" class="btn btn-ghost" data-teacher-action="view" data-id="${Number(row.id)}">Visualizar</button><button type="button" class="btn btn-ghost" data-teacher-action="delete" data-id="${Number(row.id)}">Excluir</button></div></article>`).join('')||'<div class="panel student-empty"><h3>Você ainda não prescreveu treinos.</h3><p>Crie sua primeira ficha para um aluno.</p></div>'}</div>${footer()}</div>`;
}
function teacherStudentsPage(){
  return `<div class="main-area student-main">${titleArea('Alunos','Escolha um aluno para preparar uma ficha individual.','','users','ÁREA DO PROFESSOR')}
  <div class="teacher-students">${[...db.alunos].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR')).map(a=>`<article class="panel teacher-student"><span class="avatar">${esc(initials(a.nome))}</span><div><h3>${esc(a.nome)}</h3><p>${esc(a.email||'Sem e-mail')}</p></div><button type="button" class="btn btn-primary" data-teacher-for="${Number(a.id)}">Prescrever treino</button></article>`).join('')}</div>${footer()}</div>`;
}
let preselectedTeacherStudent=0;
function teacherBuilderPage(){
  const studentOptions=[...db.alunos].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR')).map(a=>`<option value="${Number(a.id)}" ${Number(a.id)===preselectedTeacherStudent?'selected':''}>${esc(a.nome)}</option>`).join('');
  let html=studentBuilderPage();
  html=html.replace('id="studentWorkoutForm"','id="teacherWorkoutForm"')
    .replace('Montar treino','Prescrever treino')
    .replace('Escolha um grupo muscular, toque na região do corpo e adicione os exercícios desejados.','Selecione o aluno e escolha as regiões musculares para prescrever os exercícios.')
    .replace('ÁREA DO ALUNO','ÁREA DO PROFESSOR')
    .replace('data-student-page="aluno_treinos"','data-teacher-page="prof_treinos"')
    .replace('Meus treinos','Treinos prescritos')
    .replace('NOVA FICHA PESSOAL','NOVA PRESCRIÇÃO PROFISSIONAL')
    .replace('Seu treino é montado com exercícios de diferentes grupos e regiões.','Sua ficha será atribuída ao aluno selecionado.')
    .replace('<label class="form-field">Nome do treino',`<label class="form-field">Aluno destinatário<select class="form-control" id="teacherStudentSelect" name="aluno_id" required><option value="">Selecione um aluno</option>${studentOptions}</select></label><label class="form-field">Nome do treino`)
    .replace('Salvar meu treino','Salvar prescrição')
    .replace('Protótipo: os dados ficam apenas neste navegador.','Protótipo: prescrições salvas apenas neste navegador.');
  return html;
}
function renderTeacherPage(page){
  if(!currentTeacher())return '<div class="main-area"><h1>Professor não encontrado.</h1></div>';
  if(page==='prof_montar')return teacherBuilderPage();
  if(page==='prof_treinos')return teacherWorkoutsPage();
  if(page==='prof_alunos')return teacherStudentsPage();
  return teacherOverview();
}
function saveTeacherWorkout(form){
  if(userSession?.role!=='professor'||!form.reportValidity())return;
  const fd=new FormData(form),alunoId=Number(fd.get('aluno_id'));
  if(!find('alunos',alunoId))return showToast('Selecione um aluno válido.','error');
  const selected=$$('.exercise-card',form).filter(card=>$('.exercise-checkbox',card)?.checked);
  if(!selected.length)return showToast('Escolha pelo menos um exercício.','error');
  const items=[];
  for(const [i,card] of selected.entries()){
    const exercicio_id=Number($('.exercise-checkbox',card).value),series=Number($('.exercise-series',card).value),repeticoes=$('.exercise-reps',card).value.trim();
    if(!find('exercicios',exercicio_id)||!Number.isInteger(series)||series<1||series>20||!repeticoes)return showToast('Revise séries e repetições.','error');
    items.push({exercicio_id,series,repeticoes,ordem:i+1,observacoes:''});
  }
  const nome=String(fd.get('nome')||'').trim();if(!nome)return showToast('Informe o nome do treino.','error');
  const id=Math.max(0,...db.treinos.map(t=>Number(t.id)||0))+1;
  db.treinos.push({id,nome,aluno_id:alunoId,professor_id:userSession.professorId,descricao:String(fd.get('descricao')||'').trim(),data_criacao:localDate(0)});
  let nextId=Math.max(0,...db.treino_exercicios.map(t=>Number(t.id)||0))+1;
  items.forEach(it=>db.treino_exercicios.push({id:nextId++,treino_id:id,...it}));
  preselectedTeacherStudent=0;saveData();showToast(`Treino atribuído a ${label('alunos',alunoId)}!`);navigate('prof_treinos');
}
function teacherViewWorkout(id){
  const t=teacherWorkouts().find(x=>Number(x.id)===id);if(!t)return;
  const items=db.treino_exercicios.filter(x=>Number(x.treino_id)===id).sort((a,b)=>a.ordem-b.ordem);
  modal(`${modalHeading(t.nome,`Aluno: ${label('alunos',t.aluno_id)}`)}<div class="student-workout-detail">${items.map(it=>{const ex=find('exercicios',it.exercicio_id);return `<div class="workout-detail-item">${exerciseImageHTML(ex,'detail-muscle-image')}<div><strong>${esc(ex?.nome||'Exercício excluído')}</strong><p>${esc(it.series)} séries × ${esc(it.repeticoes)} repetições</p></div></div>`;}).join('')}</div><div class="form-actions"><button class="btn btn-primary" data-teacher-action="close">Fechar</button></div>`);
}
function teacherDeleteWorkout(id){
  const t=teacherWorkouts().find(x=>Number(x.id)===id);if(!t)return;
  modal(`${modalHeading('Excluir prescrição',`Aluno: ${label('alunos',t.aluno_id)}`)}<p class="confirm-message">Excluir a ficha <strong>${esc(t.nome)}</strong>?</p><div class="form-actions"><button class="btn btn-ghost" data-teacher-action="close">Cancelar</button><button class="btn btn-danger" data-teacher-action="confirm-delete" data-id="${id}">Confirmar exclusão</button></div>`);
}
const DEMO_LOGIN_PASSWORD='demo123';
let pendingLoginRole=null;
function findDemoAccountByName(role, name){
  const collection=role==='aluno'?db.alunos:role==='professor'?db.professores:[];
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
  return collection.find(account=>normalize(account.nome)===normalize(name))||null;
}
function resetPortalToRoles(){
  pendingLoginRole=null;
  $('#portalRoleStep').hidden=false;
  $('#portalLoginStep').hidden=true;
  $('#portalLoginForm').reset();
  $('#portalLoginError').hidden=true;
  $('#portalPassword').type='password';
  $('#portalTogglePassword').textContent='Mostrar';
  $('#portalTogglePassword').setAttribute('aria-pressed','false');
  $('#portalTogglePassword').setAttribute('aria-label','Mostrar senha');
}
function showLoginForRole(role){
  if(!['aluno','professor','admin'].includes(role))return;
  pendingLoginRole=role;
  $('#portalRoleStep').hidden=true;
  $('#portalLoginStep').hidden=false;
  $('#portalLoginForm').reset();
  $('#portalLoginError').hidden=true;
  const labels={aluno:'Aluno',professor:'Professor',admin:'Administrador'};
  $('#portalLoginTitle').textContent=`Login do ${labels[role]}`;
  $('#portalLoginDescription').textContent=role==='admin'?'Acesse o painel administrativo de demonstração.':`Digite o nome cadastrado para acessar a área de ${labels[role].toLowerCase()}.`;
  $('#portalAccountPicker').hidden=role==='admin';
  $('#portalAdminAccount').hidden=role!=='admin';
  $('#portalPersonName').required=role!=='admin';
  (role==='admin'?$('#portalPassword'):$('#portalPersonName')).focus();
}
function submitDemoLogin(event){
  event.preventDefault();
  if(!pendingLoginRole)return;
  const pass=$('#portalPassword').value;
  if(pass!==DEMO_LOGIN_PASSWORD){
    $('#portalLoginError').textContent='Senha demonstrativa incorreta. Utilize demo123.';
    $('#portalLoginError').hidden=false;
    $('#portalPassword').focus();
    return;
  }
  if(pendingLoginRole!=='admin'){
    const account=findDemoAccountByName(pendingLoginRole,$('#portalPersonName').value);
    if(!account){
      $('#portalLoginError').textContent='Nome não encontrado nos cadastros demonstrativos. Confira a grafia ou cadastre o usuário na área administrativa.';
      $('#portalLoginError').hidden=false;
      $('#portalPersonName').focus();
      return;
    }
    chooseDemoRole(pendingLoginRole,account.id);
    return;
  }
  chooseDemoRole('admin',null);
}
function refreshMenuForRole(){
  if(!userSession)return;
  const student=userSession.role==='aluno',teacher=userSession.role==='professor';
  const nav=student?studentPages:teacher?teacherPages:pages;
  $('#navMenu').innerHTML=nav.map(([key,label,icon])=>`<button class="nav-item" data-page="${key}">${svg(icon)}<span>${esc(label)}</span></button>`).join('');
  $('#sidebarName').textContent=student ? currentStudent()?.nome||'Aluno':teacher?currentTeacher()?.nome||'Professor':'Administrador';
  $('#sidebarSubtitle').textContent=student?'Área de treinos e matrícula':teacher?'Prescrição de treinos':'Gestor da academia';
  $('#sidebarAvatar').textContent=$('#topAvatar').textContent=student?initials(currentStudent()?.nome):teacher?initials(currentTeacher()?.nome):'AD';
  $('#topProfileName').textContent=student?(currentStudent()?.nome?.split(' ')[0]||'Aluno'):teacher?(currentTeacher()?.nome?.split(' ')[0]||'Professor'):'Admin';
  $('.nav-category').textContent=student?'ÁREA DO ALUNO':teacher?'ÁREA DO PROFESSOR':'MENU PRINCIPAL';
  $('.sidebar-note strong').textContent=student?'Seu espaço pessoal':teacher?'Espaço profissional':'Versão demonstrativa';
  $('.sidebar-note span').textContent=student?'Visualize suas fichas e monte treinos. Dados de exemplo.':teacher?'Prescreva treinos para seus alunos. Dados locais.':'Os dados ficam neste navegador até a integração com Flask.';
  document.body.classList.toggle('student-mode',student);document.body.classList.toggle('teacher-mode',teacher);
  const progress=$('#routeProgress');if(progress)progress.classList.remove('progress-playing');
}
function chooseDemoRole(role,studentId){
  if(role==='aluno'){
    const aluno=db.alunos.find(a=>Number(a.id)===Number(studentId));
    if(!aluno)return showToast('Escolha um aluno válido para testar.','error');
    userSession={role:'aluno',alunoId:Number(aluno.id)};
  }else if(role==='professor'){const prof=find('professores',studentId);if(!prof)return showToast('Escolha um professor válido.','error');userSession={role:'professor',professorId:Number(prof.id)};}else userSession={role:'admin'};
  try{sessionStorage.setItem(PROFILE_KEY,JSON.stringify(userSession));}catch(e){}
  $('#portalScreen').hidden=true;
  refreshMenuForRole();
  navigate(role==='aluno'?'aluno_inicio':role==='professor'?'prof_inicio':'dashboard');
  $('#mainContent').focus({preventScroll:true});
  showToast(role==='aluno'?`Área do aluno: ${currentStudent()?.nome}.`:role==='professor'?`Área do professor: ${currentTeacher()?.nome}.`:'Acesso de demonstração: administrador.');
}
function switchDemoRole(){
  closeSidebar();closeModal();closeNotification();
  try{sessionStorage.removeItem(PROFILE_KEY);}catch(e){}
  userSession=null;
  $('#portalScreen').hidden=false;
  document.body.classList.remove('student-mode','teacher-mode');
  resetPortalToRoles();
  $('[data-login-role="aluno"]').focus();
}

// O administrador também pode consultar e excluir treinos pessoais
// criados pelos alunos no ambiente de demonstração.
function openAdminPersonalWorkout(id){
  if(userSession?.role!=='admin')return;
  const t=db.treinos_aluno.find(row=>Number(row.id)===id);
  if(!t)return showToast('Treino pessoal não encontrado.','error');
  const items=(t.itens||[]).map((item,i)=>{
    const exercise=find('exercicios',item.exercicio_id);
    return `<div class="workout-detail-item"><span class="workout-detail-index">${i+1}</span>${exerciseImageHTML(exercise,'detail-muscle-image')}<div><strong>${esc(exercise?.nome||'Exercício removido')}</strong><p>${esc(exercise?.grupo_muscular||'—')} • ${esc(exercise?.regiao||'Ênfase geral')}</p><div class="detail-pills"><span>${Number(item.series)} séries</span><span>${esc(item.repeticoes)} repetições</span></div></div></div>`;
  }).join('');
  modal(`${modalHeading(t.nome,`Treino pessoal de ${label('alunos',t.aluno_id)}`)}<div class="student-workout-detail"><p class="detail-description">${esc(t.descricao||'Sem descrição.')}</p>${items||'<p class="student-message">Ainda sem exercícios.</p>'}</div><div class="form-actions"><button class="btn btn-primary" data-action="close-modal">Fechar</button></div>`);
}
function removeAdminPersonalWorkout(id){
  if(userSession?.role!=='admin')return;
  const t=db.treinos_aluno.find(row=>Number(row.id)===id);
  if(!t)return showToast('Treino pessoal não encontrado.','error');
  modal(`${modalHeading('Excluir treino montado',`Treino pessoal de ${label('alunos',t.aluno_id)}`)}<p class="confirm-message">Deseja excluir <strong>${esc(t.nome)}</strong>? Essa ação não apaga o aluno nem seus treinos prescritos.</p><div class="form-actions"><button class="btn btn-ghost" data-action="close-modal">Cancelar</button><button class="btn btn-danger" data-action="confirm-remove-personal" data-id="${id}">${svg('trash')} Confirmar exclusão</button></div>`);
}
function confirmRemoveAdminPersonalWorkout(id){
  if(userSession?.role!=='admin')return;
  db.treinos_aluno=db.treinos_aluno.filter(t=>Number(t.id)!==id);
  saveData();closeModal();navigate('treinos',{preserveFilter:true});showToast('Treino pessoal excluído dos dados demonstrativos.');
}

// Eventos do portal e da área do aluno.
document.querySelectorAll('[data-login-role]').forEach(button=>button.addEventListener('click',()=>showLoginForRole(button.dataset.loginRole)));
$('#portalBackRoles').addEventListener('click',resetPortalToRoles);
$('#portalLoginForm').addEventListener('submit',submitDemoLogin);
$('#portalTogglePassword').addEventListener('click',()=>{
  const field=$('#portalPassword'),show=field.type==='password';
  field.type=show?'text':'password';
  $('#portalTogglePassword').textContent=show?'Ocultar':'Mostrar';
  $('#portalTogglePassword').setAttribute('aria-pressed',String(show));
  $('#portalTogglePassword').setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');
});
$('#switchProfileTop').addEventListener('click',switchDemoRole);
$('#switchProfileSidebar').addEventListener('click',switchDemoRole);
document.addEventListener('click',event=>{
  const ag=event.target.closest('[data-admin-group]');
  if(ag&&userSession?.role==='admin'){state.exerciseGroup=ag.dataset.adminGroup;state.exerciseRegion='';navigate('exercicios',{preserveFilter:true});return;}
  const ar=event.target.closest('[data-admin-region]');
  if(ar&&userSession?.role==='admin'){state.exerciseRegion=ar.dataset.adminRegion;navigate('exercicios',{preserveFilter:true});return;}
  if(event.target.closest('[data-admin-muscle-reset]')&&userSession?.role==='admin'){state.exerciseGroup='';state.exerciseRegion='';navigate('exercicios',{preserveFilter:true});return;}
  const tnav=event.target.closest('[data-teacher-page]');
  if(tnav&&userSession?.role==='professor'){navigate(tnav.dataset.teacherPage);return;}
  const tfor=event.target.closest('[data-teacher-for]');
  if(tfor&&userSession?.role==='professor'){preselectedTeacherStudent=Number(tfor.dataset.teacherFor);navigate('prof_montar');return;}
  const tact=event.target.closest('[data-teacher-action]');
  if(tact&&userSession?.role==='professor'){
    const id=Number(tact.dataset.id),action=tact.dataset.teacherAction;
    if(action==='view')teacherViewWorkout(id);
    if(action==='delete')teacherDeleteWorkout(id);
    if(action==='close')closeModal();
    if(action==='confirm-delete'&&teacherWorkouts().some(t=>Number(t.id)===id)){
      db.treinos=db.treinos.filter(t=>Number(t.id)!==id);
      db.treino_exercicios=db.treino_exercicios.filter(x=>Number(x.treino_id)!==id);
      saveData();closeModal();navigate('prof_treinos');showToast('Prescrição excluída.');
    }
    return;
  }
  if(userSession?.role!=='aluno'&&userSession?.role!=='professor')return;
  const back=event.target.closest('[data-builder-back]');
  if(back){if(back.dataset.builderBack==='grupo'){selectedExerciseGroup='';selectedExerciseRegion='';}else{selectedExerciseRegion='';}updateRegionFilters();return;}
  const tab=event.target.closest('[data-exercise-tab]');
  if(tab){selectedExerciseGroup=tab.dataset.exerciseTab;selectedExerciseRegion='';updateRegionFilters();return;}
  const region=event.target.closest('[data-region]');
  if(region){selectedExerciseRegion=region.dataset.region;updateRegionFilters();return;}
  const remove=event.target.closest('[data-unselect-exercise]');
  if(remove){const input=$(`.exercise-checkbox[value="${Number(remove.dataset.unselectExercise)}"]`);if(input){input.checked=false;updateStudentSelectedCount();}return;}
  if(userSession?.role!=='aluno')return;
  const nav=event.target.closest('[data-student-page]');
  if(nav){navigate(nav.dataset.studentPage);return;}
  const button=event.target.closest('[data-student-action]');
  if(!button)return;
  const action=button.dataset.studentAction,id=Number(button.dataset.id);
  if(action==='open-assigned')openStudentWorkout(id,false);
  if(action==='open-custom')openStudentWorkout(id,true);
  if(action==='remove-custom')removeStudentWorkout(id);
  if(action==='remove-confirm'){
    if(studentCustomWorkouts().some(t=>Number(t.id)===id)){
      db.treinos_aluno=db.treinos_aluno.filter(t=>!(Number(t.id)===id&&Number(t.aluno_id)===userSession.alunoId));
      saveData();closeModal();navigate('aluno_treinos');showToast('Seu treino foi excluído.');
    }
  }
  if(action==='close')closeModal();
  if(action==='switch')switchDemoRole();
});
document.addEventListener('submit',event=>{
  if(event.target.id==='teacherWorkoutForm'){event.preventDefault();saveTeacherWorkout(event.target);}
  if(event.target.id==='studentWorkoutForm'){
    event.preventDefault();saveStudentWorkout(event.target);
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='exerciseSearch')studentExerciseFilters();
  if(event.target.classList.contains('exercise-series')||event.target.classList.contains('exercise-reps'))updateStudentSelectedCount();
  if(event.target.classList.contains('exercise-checkbox'))updateStudentSelectedCount();
});
document.addEventListener('change',event=>{
  if(event.target.id==='exerciseGroup'){selectedExerciseGroup=event.target.value;selectedExerciseRegion='';updateRegionFilters();}
  if(event.target.id==='exerciseRegion'){selectedExerciseRegion=event.target.value;updateRegionFilters();}
});

function initDemoPortal(){
  const valid=userSession?.role==='admin' || (userSession?.role==='aluno'&&Boolean(currentStudent())) || (userSession?.role==='professor'&&Boolean(currentTeacher()));
  if(!valid){userSession=null;$('#portalScreen').hidden=false;resetPortalToRoles();return;}
  $('#portalScreen').hidden=true;
  refreshMenuForRole();
  const hash=location.hash.slice(1);
  navigate(userSession.role==='aluno'?(studentPageLabels[hash]?hash:'aluno_inicio'):userSession.role==='professor'?(teacherPageLabels[hash]?hash:'prof_inicio'):(pageLabels[hash]?hash:'dashboard'),{skipHash:true});
}
initDemoPortal();
