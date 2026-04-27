// ============================================================
// カード定義（シナジー・アップグレード対応）
// ============================================================
const CARD_DEFS={
  attack:{name:'攻撃',cost:1,type:'attack',value:6,icon:'⚔️',cls:'attack',desc:'6ダメージ',up:{name:'攻撃+',value:9,desc:'9ダメージ'}},
  block:{name:'防御',cost:1,type:'block',value:5,icon:'🛡️',cls:'block',desc:'5ブロック',up:{name:'防御+',value:8,desc:'8ブロック'}},
  heal:{name:'回復',cost:1,type:'heal',value:5,icon:'💖',cls:'heal',desc:'HP5回復',up:{name:'回復+',value:8,desc:'HP8回復'}},
  hAttack:{name:'強攻撃',cost:2,type:'attack',value:10,icon:'🗡️',cls:'attack',desc:'10ダメージ',up:{name:'強攻撃+',value:14,desc:'14ダメージ'}},
  hBlock:{name:'強防御',cost:2,type:'block',value:10,icon:'🏰',cls:'block',desc:'10ブロック',up:{name:'強防御+',value:14,desc:'14ブロック'}},
  drawC:{name:'ドロー',cost:1,type:'draw',value:2,icon:'🃏',cls:'draw',desc:'2枚引く',up:{name:'ドロー+',value:3,desc:'3枚引く'}},
  poison:{name:'毒',cost:1,type:'poison',value:3,icon:'☠️',cls:'poison',desc:'毒3付与',up:{name:'毒+',value:5,desc:'毒5付与'}},
  weak:{name:'弱体',cost:1,type:'weak',value:2,icon:'💫',cls:'debuff',desc:'弱体2付与',up:{name:'弱体+',value:3,desc:'弱体3付与'}},
  venomStrike:{name:'毒撃',cost:1,type:'attack',value:4,icon:'🐍',cls:'poison',desc:'4dmg+毒2',synergy:'poison_hit',up:{name:'毒撃+',value:6,desc:'6dmg+毒3'}},
  shieldBash:{name:'盾撃',cost:1,type:'attack',value:3,icon:'🔰',cls:'attack',desc:'3dmg+block分追加',synergy:'block_atk',up:{name:'盾撃+',value:5,desc:'5dmg+block分追加'}},
  drain:{name:'吸血',cost:2,type:'attack',value:6,icon:'🩸',cls:'attack',desc:'6dmg+HP回復',synergy:'lifesteal',up:{name:'吸血+',value:9,desc:'9dmg+HP回復'}},
  doubleStrike:{name:'連撃',cost:1,type:'attack',value:3,icon:'⚡',cls:'attack',desc:'3dmg×2回',synergy:'double',up:{name:'連撃+',value:4,desc:'4dmg×2回'}},
  catalyst:{name:'触媒',cost:2,type:'skill',value:0,icon:'🧪',cls:'poison',desc:'敵の毒を2倍',synergy:'catalyst',up:{name:'触媒+',cost:1,value:0,desc:'(1コス)毒を2倍'}},
  toxicCloud:{name:'毒霧',cost:1,type:'skill',value:4,icon:'💨',cls:'poison',desc:'毒4+弱体1',synergy:'toxic_cloud',up:{name:'毒霧+',value:6,desc:'毒6+弱体1'}},
  bodySlam:{name:'ボディスラム',cost:1,type:'attack',value:0,icon:'💥',cls:'attack',desc:'ブロック値分のdmg',synergy:'body_slam',up:{name:'ボディスラム+',cost:0,value:0,desc:'(0コス)ブロック分のdmg'}},
  entrench:{name:'塹壕',cost:2,type:'skill',value:0,icon:'🧱',cls:'block',desc:'ブロックを2倍',synergy:'entrench',up:{name:'塹壕+',cost:1,value:0,desc:'(1コス)ブロックを2倍'}},
  adrenaline:{name:'アドレナリン',cost:0,type:'skill',value:0,icon:'⚡',cls:'draw',desc:'+1エナジー,2ドロー',synergy:'adrenaline',up:{name:'アドレナリン+',value:0,desc:'+2エナジー,2ドロー'}},
  flurry:{name:'連撃の嵐',cost:1,type:'attack',value:2,icon:'🌪️',cls:'attack',desc:'2dmg×プレイ枚数',synergy:'flurry',up:{name:'連撃の嵐+',value:3,desc:'3dmg×プレイ枚数'}}
};

// ============================================================
// 敵定義
// ============================================================
const ENEMY_DEFS={
  slime:{name:'スライム',icon:'🟢',hp:30,actions:[{name:'攻撃',type:'attack',value:4,icon:'⚔️'},{name:'攻撃',type:'attack',value:6,icon:'⚔️'},{name:'防御',type:'block',value:4,icon:'🛡️'}]},
  skeleton:{name:'スケルトン',icon:'💀',hp:35,actions:[{name:'攻撃',type:'attack',value:6,icon:'⚔️'},{name:'強攻撃',type:'attack',value:10,icon:'🗡️'},{name:'攻撃',type:'attack',value:7,icon:'⚔️'}]},
  golem:{name:'ゴーレム',icon:'🗿',hp:55,actions:[{name:'攻撃',type:'attack',value:5,icon:'⚔️'},{name:'防御',type:'block',value:8,icon:'🛡️'},{name:'防御',type:'block',value:6,icon:'🛡️'}]},
  spider:{name:'毒蜘蛛',icon:'🕷️',hp:28,poisonImmune:true,actions:[{name:'攻撃',type:'attack',value:4,icon:'⚔️'},{name:'毒噛み',type:'poison_atk',value:3,icon:'☠️'},{name:'攻撃',type:'attack',value:6,icon:'⚔️'}]},
  vampire:{name:'ヴァンパイア',icon:'🧛',hp:40,actions:[{name:'吸血',type:'drain_atk',value:6,icon:'🩸'},{name:'攻撃',type:'attack',value:7,icon:'⚔️'},{name:'攻撃',type:'attack',value:5,icon:'⚔️'}]},
  ninja:{name:'暗殺者',icon:'🥷',hp:60,elite:true,actions:[{name:'急所突き',type:'attack',value:8,icon:'🗡️'},{name:'毒の刃',type:'poison_atk',value:5,icon:'☠️'},{name:'防御',type:'block',value:10,icon:'🛡️'}]},
  oni:{name:'赤鬼',icon:'👹',hp:75,elite:true,actions:[{name:'金棒',type:'attack',value:12,icon:'💥'},{name:'大暴れ',type:'attack',value:9,icon:'⚔️'},{name:'威圧',type:'weak_atk',value:4,icon:'💫'}]},
  dragon:{name:'ドラゴン',icon:'🐉',hp:80,boss:true,actions:[{name:'火炎',type:'attack',value:10,icon:'🔥'},{name:'爪撃',type:'attack',value:7,icon:'⚔️'},{name:'防御',type:'block',value:8,icon:'🛡️'},{name:'猛攻',type:'attack',value:13,icon:'💥'}]},
  demon:{name:'魔王',icon:'👹',hp:90,boss:true,actions:[{name:'闇撃',type:'attack',value:9,icon:'⚫'},{name:'強攻撃',type:'attack',value:12,icon:'🗡️'},{name:'弱体波',type:'weak_atk',value:5,icon:'💫'},{name:'防御',type:'block',value:10,icon:'🛡️'}]}
};

// ============================================================
// 遺物定義
// ============================================================
const RELIC_DEFS=[
  {id:'iron_shield',name:'鉄の盾',icon:'🛡️',desc:'戦闘開始時ブロック+5',hook:'battleStart'},
  {id:'sage_tome',name:'賢者の書',icon:'📖',desc:'ターン開始時+1ドロー',hook:'turnStart'},
  {id:'vamp_fang',name:'吸血牙',icon:'🧛',desc:'敵撃破時HP5回復',hook:'enemyKill'},
  {id:'energy_gem',name:'力の宝石',icon:'💎',desc:'最大エネルギー+1',hook:'passive'},
  {id:'poison_ring',name:'毒の指輪',icon:'💍',desc:'戦闘開始時 敵に毒2',hook:'battleStart'},
  {id:'toxic_coat',name:'毒の外套',icon:'☣️',desc:'毒ダメージ+1',hook:'passive'},
  {id:'card_master',name:'カードの達人',icon:'🎴',desc:'手札上限+1',hook:'passive'},
  {id:'war_drum',name:'戦太鼓',icon:'🥁',desc:'戦闘開始時+1エネルギー',hook:'battleStart'},
  {id:'lucky_coin',name:'幸運のコイン',icon:'🪙',desc:'報酬カード+1枚',hook:'passive'},
  {id:'snake_skull',name:'蛇の頭骨',icon:'💀',desc:'毒付与時、追加で+1',hook:'passive'},
  {id:'barricade',name:'バリケード',icon:'🚧',desc:'ターン終了時にブロックを維持',hook:'passive'},
  {id:'spinning_top',name:'独楽',icon:'🌀',desc:'手札が0枚になった時1枚ドロー',hook:'passive'}
];

// ============================================================
// イベント定義
// ============================================================
const EVENT_DEFS=[
  {title:'呪われた血の祭壇',icon:'🩸',text:'おぞましい祭壇がある。血を捧げれば力を得られそうだ。',
    choices:[{label:'血を捧げる（最大HP-30%, ボス遺物獲得）',action:'blood_altar'},{label:'立ち去る',action:'skip'}]},
  {title:'悪魔の鍛冶屋',icon:'👿',text:'悪魔が囁く。「すべての攻撃を強化してやろう。代償は...分かるな？」',
    choices:[{label:'契約する（全攻撃強化, 呪い追加）',action:'demon_forge'},{label:'断る',action:'skip'}]},
  {title:'狂気のルーレット',icon:'🎰',text:'回せば天国か地獄か。',
    choices:[{label:'回す（50%で遺物2個 or 現在HP半減）',action:'roulette'},{label:'立ち去る',action:'skip'}]},
  {title:'謎の注射器',icon:'💉',text:'怪しい薬が入っている。筋力が高まりそうだが...。',
    choices:[{label:'打つ（常時ダメージ+2, 毎ターン1ダメージ）',action:'syringe'},{label:'立ち去る',action:'skip'}]},
  {title:'忘却の泉',icon:'⛲',text:'記憶を消し去る泉。消した分だけ痛みを伴う。',
    choices:[{label:'カードを削除（最大3枚, 1枚につき8dmg）',action:'oblivion_purge'},{label:'泉の水を飲む（HP+10）',action:'fountain_heal'}]}
];

// ============================================================
// 状態 (State)
// ============================================================
let nextCardId=0;
const state={
  playerHP:0,playerMaxHP:50,enemyHP:0,enemyMaxHP:40,
  block:0,enemyBlock:0,energy:0,maxEnergy:3,
  drawPile:[],hand:[],discardPile:[],
  isPlayerTurn:false,enemyStatus:{poison:0,weak:0},enemyIntent:null,turnCount:0,
  // Phase 4
  currentFloor:0,map:[],relics:[],gamePhase:'title',deck:[],
  // Phase 5 & 6
  currentEnemy:null,playerStatus:{poison:0,strength:0,bleed:0},handSize:5,
  cardsPlayedThisTurn:0
};

// ============================================================
// ユーティリティ
// ============================================================
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function el(id){return document.getElementById(id)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function createCard(type,upgraded){
  const d=CARD_DEFS[type];const u=upgraded&&d.up;
  return{id:nextCardId++,name:u?d.up.name:d.name,cost:d.cost,type:d.type,value:u?d.up.value:d.value,icon:d.icon,cls:d.cls,desc:u?d.up.desc:d.desc,defKey:type,upgraded:!!upgraded,synergy:d.synergy||null}
}
function upgradeCard(card){
  const d=CARD_DEFS[card.defKey];if(!d.up||card.upgraded) return false;
  card.upgraded=true;card.name=d.up.name;card.value=d.up.value;card.desc=d.up.desc;return true;
}

// 白背景を透過処理する
function removeWhiteBg(src,targetSelector){
  const img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const d=ctx.getImageData(0,0,c.width,c.height);
    const px=d.data;const threshold=230;
    for(let i=0;i<px.length;i+=4){
      if(px[i]>threshold&&px[i+1]>threshold&&px[i+2]>threshold) px[i+3]=0;
    }
    ctx.putImageData(d,0,0);
    const url=c.toDataURL('image/png');
    document.querySelectorAll(targetSelector).forEach(e=>{e.style.backgroundImage=`url(${url})`});
  };
  img.src=src;
}

// ============================================================
// SE（効果音）管理
// ============================================================
const SE={
  vols:{card:0.5, hit:0.5, damage:0.5, click:0.3, turn:0.4},
  play:function(name, delay=0){
    setTimeout(()=>{
      const a=new Audio(`se/${name}.mp3`);
      a.volume=this.vols[name]||0.5;
      a.play().catch(e=>console.log('Audio disabled/missing:',e));
    }, delay);
  }
};
document.addEventListener('click', e=>{
  if(e.target.closest('.obtn') || e.target.closest('#end-turn-btn')) SE.play('click');
  if(e.target.closest('.card') && state.gamePhase==='battle') SE.play('card');
  if(e.target.closest('.reward-card')) SE.play('card');
});

window.addEventListener('load',()=>{
  removeWhiteBg('images/player_sd.png','.char-player');
  removeWhiteBg('images/player_stand.png','.char-stand');
});
// ============================================================
// 演出システム
// ============================================================
function showDmgPopup(unitId,text,cls){
  const unit=document.getElementById(unitId);if(!unit) return;
  const pop=document.createElement('div');
  pop.className='dmg-popup '+cls;
  pop.textContent=text;
  pop.style.left=Math.random()*40+30+'%';
  pop.style.top='10px';
  unit.appendChild(pop);
  setTimeout(()=>pop.remove(),850);
}
function flashUnit(unitId){
  const u=document.getElementById(unitId);
  u.classList.remove('flash-red');void u.offsetWidth;u.classList.add('flash-red');
}
function showTurnBanner(isPlayer){
  const b=el('turn-banner');
  b.className='turn-banner '+(isPlayer?'player-turn':'enemy-turn');
  b.textContent=isPlayer?'⚡ あなたのターン':'💀 敵のターン';
  b.classList.remove('hide');
  setTimeout(()=>b.classList.add('hide'),1200);
}
function playerAttackAnim(){
  const c=el('p-char');if(!c) return;
  c.classList.remove('char-attack');void c.offsetWidth;
  c.classList.add('char-attack');
  // 溜め後の打撃タイミングでエフェクトとSE
  setTimeout(()=>{
    showSlashFX();
    triggerHitStop();
    triggerScreenShake();
    SE.play('hit');
  }, 220);
  setTimeout(()=>{c.classList.remove('char-attack')},550);
}
function playerHitAnim(){
  const c=el('p-char');if(!c) return;
  c.classList.remove('char-hit');void c.offsetWidth;
  c.classList.add('char-hit');
  
  triggerHitStop();
  triggerScreenShake();
  SE.play('damage');

  setBtnState(false);
  setTimeout(()=>{if(state.isPlayerTurn)setBtnState(true)},150);
  showSparkFX('p-unit');
  setTimeout(()=>{c.classList.remove('char-hit')},550);
}

// ヒットストップ ＆ スクリーンシェイク
function triggerHitStop(){
  const app=el('app');if(!app) return;
  app.style.transform='scale(0.97)';
  setTimeout(()=>app.style.transform='', 60);
}
function triggerScreenShake(){
  const app=el('app');if(!app) return;
  app.classList.remove('screen-shake');void app.offsetWidth;
  app.classList.add('screen-shake');
  setTimeout(()=>app.classList.remove('screen-shake'), 300);
}

// 斬撃線エフェクト
function showSlashFX(){
  const eUnit=document.getElementById('e-unit');if(!eUnit) return;
  const slash=document.createElement('div');
  slash.className='slash-fx';
  slash.innerHTML='<div class="slash-line"></div><div class="slash-line"></div><div class="slash-line"></div>';
  eUnit.appendChild(slash);
  void slash.offsetWidth;
  slash.classList.add('active');
  setTimeout(()=>slash.remove(),400);
}

// スパークエフェクト
function showSparkFX(unitId){
  const unit=document.getElementById(unitId);if(!unit) return;
  const container=document.createElement('div');
  container.className='spark-fx';
  container.style.left='50%';container.style.top='40%';
  for(let i=0;i<6;i++){
    const s=document.createElement('div');
    s.className='spark';
    const angle=Math.random()*Math.PI*2;
    const dist=20+Math.random()*30;
    s.style.setProperty('--sx',Math.cos(angle)*dist+'px');
    s.style.setProperty('--sy',Math.sin(angle)*dist+'px');
    s.style.animationDelay=Math.random()*0.1+'s';
    container.appendChild(s);
  }
  unit.appendChild(container);
  setTimeout(()=>container.remove(),600);
}

// ============================================================
// 遺物処理
// ============================================================
function hasRelic(id){return state.relics.some(r=>r.id===id)}
function triggerRelics(hook){
  state.relics.forEach(r=>{
    if(r.hook!==hook) return;
    switch(r.id){
      case 'iron_shield': state.block+=5;addLog('遺物[鉄の盾] ブロック+5','blk');break;
      case 'sage_tome': const c=drawCard();if(c){state.hand.push(c);addLog('遺物[賢者の書] +1ドロー','drw')}break;
      case 'vamp_fang': state.playerHP=Math.min(state.playerMaxHP,state.playerHP+5);addLog('遺物[吸血牙] HP5回復','hel');break;
      case 'poison_ring': state.enemyStatus.poison+=2;addLog('遺物[毒の指輪] 敵に毒2','psn');break;
      case 'war_drum': state.energy++;addLog('遺物[戦太鼓] +1エネルギー','drw');break;
    }
  });
}
function applyPassiveRelics(){
  if(hasRelic('energy_gem')&&state.maxEnergy===3) state.maxEnergy=4;
  if(hasRelic('card_master')) state.handSize=6;
  if(hasRelic('toxic_coat')) state.poisonBonus=1; else state.poisonBonus=0;
}

// ============================================================
// マップ生成
// ============================================================
function generateMap(){
  const floors=[];const total=6; // 6 floors for faster pacing
  for(let f=0;f<total;f++){
    const nodes=[];
    let count = 3;
    if(f===total-1) count=1;
    else if(f===0) count=2;
    for(let n=0;n<count;n++){
      let type, bgType;
      bgType = (f<3) ? 'forest' : 'cave';
      if(f===total-1){ type='boss'; bgType='boss'; }
      else if(f===0){ type='battle'; }
      else{
        // Path A/B concept: at least one elite per floor after 1
        if(n===0) type = Math.random()<0.6 ? 'elite' : 'battle';
        else if(n===1) type = Math.random()<0.5 ? 'event' : 'rest';
        else type = Math.random()<0.4 ? 'elite' : (Math.random()<0.5?'battle':'event');
      }
      const icons={battle:'⚔️',event:'❓',rest:'🏕️',boss:'💀',elite:'👹'};
      const labels={battle:'戦闘',event:'イベント',rest:'休憩',boss:'ボス',elite:'エリート'};
      nodes.push({type,icon:icons[type],label:labels[type],bg:bgType});
    }
    floors.push(nodes);
  }
  return floors;
}

// ============================================================
// マップUI
// ============================================================
function showMap(){
  state.gamePhase='map';
  document.body.classList.remove('battle-bg');
  el('battle-view').classList.add('hide');
  const mv=el('map-view');mv.classList.remove('hide');
  mv.innerHTML='<div class="map-title">🗺️ ダンジョンマップ</div>';
  for(let f=0;f<state.map.length;f++){
    if(f>0) mv.innerHTML+='<div class="map-connector"></div>';
    let row='<div class="map-floor"><div class="fl-label">'+(f===state.map.length-1?'BOSS':'F'+(f+1))+'</div>';
    state.map[f].forEach((node,ni)=>{
      const done=f<state.currentFloor;
      const current=f===state.currentFloor;
      const locked=f>state.currentFloor;
      let cls='map-node';
      if(done) cls+=' done';else if(current) cls+=' current';else if(locked) cls+=' locked';
      if(node.type==='elite') cls+=' elite';
      const click=current?` onclick="selectNode(${f},${ni})"`:''
      row+=`<div class="${cls}"${click}><div class="n-icon">${node.icon}</div><div class="n-label">${node.label}</div></div>`;
    });
    row+='</div>';mv.innerHTML+=row;
  }
  updateTopBar();
}

function selectNode(floor,ni){
  if(floor!==state.currentFloor) return;
  const node=state.map[floor][ni];
  switch(node.type){
    case 'battle':case 'boss':case 'elite':startBattle(node.type, node.bg);break;
    case 'event':startEvent();break;
    case 'rest':startRest();break;
  }
}

function advanceFloor(){
  state.currentFloor++;
  if(state.currentFloor>=state.map.length){showVictory();return}
  showMap();
}

// ============================================================
// 初期デッキ
// ============================================================
function initializeDeck(){
  nextCardId=0;const deck=[];
  for(let i=0;i<5;i++) deck.push(createCard('attack'));
  for(let i=0;i<5;i++) deck.push(createCard('block'));
  for(let i=0;i<2;i++) deck.push(createCard('heal'));
  return deck;
}

// ============================================================
// 戦闘システム（Phase 2-3 維持）
// ============================================================
function drawCard(){
  if(state.drawPile.length===0){
    if(state.discardPile.length===0) return null;
    state.drawPile=shuffle(state.discardPile.splice(0));
    addLog('捨て札→山札にシャッフル','drw');
  }
  return state.drawPile.pop();
}
function drawHand(){const sz=state.handSize||5;while(state.hand.length<sz){const c=drawCard();if(!c) break;state.hand.push(c)}}
function drawCards(n){for(let i=0;i<n;i++){const c=drawCard();if(!c) break;state.hand.push(c)}}

function applyDamage(target,amount){
  if(target==='player'){
    let d=amount;
    if(state.block>0){if(state.block>=d){state.block-=d;addLog(`ブロックで${d}防御！`,'blk');showDmgPopup('p-unit','🛡'+d,'block-pop');d=0}else{d-=state.block;addLog(`ブロック${state.block}消費、${d}貫通！`,'blk');state.block=0}}
    if(d>0){state.playerHP=Math.max(0,state.playerHP-d);addLog(`プレイヤーに${d}ダメージ！`,'dmg');showDmgPopup('p-unit','-'+d,'dmg-pop');flashUnit('p-unit');playerHitAnim()}
  }else{
    let d=amount + (state.playerStatus.strength||0);
    if(state.enemyBlock>0){if(state.enemyBlock>=d){state.enemyBlock-=d;addLog(`敵ブロックが${d}防御！`,'blk');showDmgPopup('e-unit','🛡'+d,'block-pop');d=0}else{d-=state.enemyBlock;addLog(`敵ブロック貫通、${d}ダメージ！`,'blk');state.enemyBlock=0}}
    if(d>0){state.enemyHP=Math.max(0,state.enemyHP-d);addLog(`敵に${d}ダメージ！`,'dmg');showDmgPopup('e-unit','-'+d,'dmg-pop');flashUnit('e-unit')}
  }
}
function applyBlock(n){state.block+=n}
function applyPoison(n){
  if(state.currentEnemy&&state.currentEnemy.poisonImmune){addLog('敵は毒無効！','dim');return}
  let amt = n + (hasRelic('snake_skull') ? 1 : 0);
  state.enemyStatus.poison+=amt;addLog(`敵に毒${amt}付与！`,'psn');
}
function applyWeak(n){state.enemyStatus.weak+=n;addLog(`敵に弱体${n}付与！`,'dbf')}
function applyStatusEffects(){
  const s=state.enemyStatus;
  if(s.poison>0){const pd=s.poison+(state.poisonBonus||0);state.enemyHP=Math.max(0,state.enemyHP-pd);addLog(`毒で敵に${pd}ダメージ！`,'psn');s.poison--;shakeUnit('e-unit')}
  if(s.weak>0) s.weak--;
  if(state.playerStatus.poison>0){state.playerHP=Math.max(0,state.playerHP-state.playerStatus.poison);addLog(`毒で${state.playerStatus.poison}ダメージ！`,'psn');state.playerStatus.poison--;shakeUnit('p-unit')}
  if(state.playerStatus.bleed>0){state.playerHP=Math.max(0,state.playerHP-state.playerStatus.bleed);addLog(`出血で${state.playerStatus.bleed}ダメージ！`,'dmg');shakeUnit('p-unit')}
}

function playCard(cardId){
  if(!state.isPlayerTurn) return;
  const idx=state.hand.findIndex(c=>c.id===cardId);if(idx===-1) return;
  const card=state.hand[idx];if(card.cost>state.energy) return;
  const cardEls=el('hand').querySelectorAll('.card');
  if(cardEls[idx]) cardEls[idx].classList.add('played');
  state.energy-=card.cost;state.hand.splice(idx,1);
  // シナジー処理
  let val=card.value;
  if(card.synergy==='poison_hit'){playerAttackAnim();applyDamage('enemy',val);addLog(`${card.name}！`,'dmg');shakeUnit('e-unit');const pv=card.upgraded?3:2;applyPoison(pv);showDmgPopup('e-unit','☠+'+pv,'poison-pop')}
  else if(card.synergy==='block_atk'){playerAttackAnim();const bonus=state.block;applyDamage('enemy',val+bonus);addLog(`${card.name}！ ${val}+ブロック${bonus}=${val+bonus}dmg`,'dmg');shakeUnit('e-unit')}
  else if(card.synergy==='lifesteal'){playerAttackAnim();applyDamage('enemy',val);const h=Math.floor(val/2);state.playerHP=Math.min(state.playerMaxHP,state.playerHP+h);addLog(`${card.name}！ ${val}dmg+HP${h}回復`,'dmg');shakeUnit('e-unit');showDmgPopup('p-unit','+'+h,'heal-pop')}
  else if(card.synergy==='double'){playerAttackAnim();applyDamage('enemy',val);applyDamage('enemy',val);addLog(`${card.name}！ ${val}×2回`,'dmg');shakeUnit('e-unit')}
  else if(card.synergy==='catalyst'){const amt=state.enemyStatus.poison;if(amt>0){applyPoison(amt);addLog(`${card.name}！毒が2倍に！`,'psn')}else{addLog(`${card.name}！しかし毒がない`,'dim')}}
  else if(card.synergy==='toxic_cloud'){applyPoison(val);applyWeak(1);addLog(`${card.name}！毒${val}+弱体1`,'psn');showDmgPopup('e-unit','☠+'+val,'poison-pop')}
  else if(card.synergy==='body_slam'){playerAttackAnim();const dmg=state.block;applyDamage('enemy',dmg);addLog(`${card.name}！ ブロック分の${dmg}ダメージ！`,'dmg');shakeUnit('e-unit')}
  else if(card.synergy==='entrench'){applyBlock(state.block);addLog(`${card.name}！ブロックが2倍に！`,'blk');showDmgPopup('p-unit','+🛡'+state.block,'block-pop')}
  else if(card.synergy==='adrenaline'){const eBonus=card.upgraded?2:1;state.energy=Math.min(state.maxEnergy+2,state.energy+eBonus);drawCards(2);addLog(`${card.name}！${eBonus}回復+2枚ドロー`,'drw')}
  else if(card.synergy==='flurry'){playerAttackAnim();const hits=state.cardsPlayedThisTurn;for(let i=0;i<=hits;i++) applyDamage('enemy',val);addLog(`${card.name}！ ${val}dmg×${hits+1}回`,'dmg');shakeUnit('e-unit')}
  else switch(card.type){
    case 'attack':playerAttackAnim();applyDamage('enemy',val);addLog(`${card.name}！`,'dmg');shakeUnit('e-unit');break;
    case 'block':applyBlock(val);addLog(`${card.name}！ ブロック+${val}`,'blk');showDmgPopup('p-unit','+🛡'+val,'block-pop');break;
    case 'heal':state.playerHP=Math.min(state.playerMaxHP,state.playerHP+val);addLog(`${card.name}！ HP${val}回復`,'hel');showDmgPopup('p-unit','+'+val,'heal-pop');break;
    case 'draw':addLog(`${card.name}！ ${val}枚ドロー`,'drw');drawCards(val);break;
    case 'poison':applyPoison(val);showDmgPopup('e-unit','☠+'+val,'poison-pop');break;
    case 'weak':applyWeak(val);break;
  }
  if(card.synergy!=='adrenaline') state.discardPile.push(card); // Adrenaline is exhaust
  
  state.cardsPlayedThisTurn++;
  if(state.hand.length===0 && hasRelic('spinning_top')){
    addLog('遺物[独楽] 1枚ドロー','drw');
    drawCards(1);
  }
  
  setTimeout(()=>updateBattleUI(),80);
  if(checkBattleEnd()) return;
}

function rollEnemyIntent(){
  const e=state.currentEnemy;state.enemyIntent=e?pick(e.actions):pick([{name:'攻撃',type:'attack',value:5,icon:'⚔️'}]);
}

function startPlayerTurn(){
  state.turnCount++;state.energy=state.maxEnergy;
  if(!hasRelic('barricade')) state.block=0;
  state.cardsPlayedThisTurn=0;
  applyStatusEffects();updateBattleUI();
  if(checkBattleEnd()) return;
  triggerRelics('turnStart');
  drawHand();state.isPlayerTurn=true;rollEnemyIntent();
  addLog(`── ターン${state.turnCount} ──`);updateBattleUI();
  showTurnBanner(true);
  SE.play('turn');
}

function endTurn(){
  if(!state.isPlayerTurn) return;
  state.isPlayerTurn=false;setBtnState(false);
  while(state.hand.length>0) state.discardPile.push(state.hand.pop());
  updateBattleUI();setTimeout(enemyTurn,600);
}

function enemyTurn(){
  showTurnBanner(false);
  const act=state.enemyIntent;state.enemyBlock=0;
  if(act.type==='attack'){
    let d=act.value;if(state.enemyStatus.weak>0){const r=Math.floor(d*.25);d-=r;addLog(`弱体で${r}減！`,'dbf')}
    addLog(`敵の${act.name}！`,'dmg');applyDamage('player',d);shakeUnit('p-unit');
  }else if(act.type==='block'){state.enemyBlock=act.value;addLog(`敵防御！ ブロック${act.value}`,'blk')}
  else if(act.type==='poison_atk'){let d=act.value;addLog(`敵の${act.name}！`,'psn');applyDamage('player',d);state.playerStatus.poison+=2;addLog('毒2付与された！','psn');shakeUnit('p-unit')}
  else if(act.type==='drain_atk'){let d=act.value;addLog(`敵の${act.name}！`,'dmg');applyDamage('player',d);const h=Math.floor(d/2);state.enemyHP=Math.min(state.enemyMaxHP,state.enemyHP+h);addLog(`敵HP${h}回復`,'hel');shakeUnit('p-unit')}
  else if(act.type==='weak_atk'){let d=act.value;addLog(`敵の${act.name}！`,'dbf');applyDamage('player',d);applyWeak(1);shakeUnit('p-unit')}
  updateBattleUI();
  if(checkBattleEnd()) return;
  setTimeout(()=>{startPlayerTurn();setBtnState(true)},700);
}

// ============================================================
// 戦闘開始 / 終了
// ============================================================
function startBattle(encounterType, bgType){
  const isBoss = encounterType === 'boss';
  const isElite = encounterType === 'elite';
  state.gamePhase='battle';
  document.body.style.setProperty('--battle-bg', `url('images/bg_${bgType||'forest'}.png')`);
  document.body.classList.add('battle-bg');
  el('map-view').classList.add('hide');el('battle-view').classList.remove('hide');
  // 敵選択
  const normals=Object.keys(ENEMY_DEFS).filter(k=>!ENEMY_DEFS[k].boss && !ENEMY_DEFS[k].elite);
  const bosses=Object.keys(ENEMY_DEFS).filter(k=>ENEMY_DEFS[k].boss);
  const elites=Object.keys(ENEMY_DEFS).filter(k=>ENEMY_DEFS[k].elite);
  const ek=isBoss?pick(bosses):(isElite?pick(elites):pick(normals));
  const ed=ENEMY_DEFS[ek];
  state.currentEnemy=ed;
  state.enemyMaxHP=ed.hp+Math.floor(Math.random()*10);state.enemyHP=state.enemyMaxHP;
  el('e-name').textContent=ed.name;el('e-icon').textContent=ed.icon;
  state.block=0;state.enemyBlock=0;state.enemyStatus={poison:0,weak:0};
  state.playerStatus={poison:0,strength:0,bleed:0};state.enemyIntent=null;state.turnCount=0;
  applyPassiveRelics();state.energy=state.maxEnergy;
  const all=[...state.drawPile,...state.hand,...state.discardPile];
  state.drawPile=shuffle(all);state.hand=[];state.discardPile=[];
  el('log').innerHTML='';
  addLog(isBoss?`⚠️ ${ed.name}が現れた！`:(isElite?`👹 強敵 ${ed.name} が現れた！`:`${ed.name}が現れた！`));
  triggerRelics('battleStart');
  startPlayerTurn();setBtnState(true);
}

function checkBattleEnd(){
  if(state.enemyHP<=0){
    triggerRelics('enemyKill');
    if(state.currentEnemy && state.currentEnemy.elite){
      addLog('エリートを撃破！遺物をドロップした！', 'success');
      const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id));
      if(avail.length>0){
        const r=pick(avail);state.relics.push(r);
        addLog(`遺物[${r.name}]を獲得！`);
      }
    }
    setTimeout(showReward,500);return true;
  }
  if(state.playerHP<=0){showGameOver();return true}
  return false;
}

function showReward(){
  const keys=Object.keys(CARD_DEFS);const chosen=[];const cnt=hasRelic('lucky_coin')?4:3;
  while(chosen.length<cnt){const k=pick(keys);if(!chosen.includes(k)) chosen.push(k)}
  const ov=el('overlay');
  let h=`<h1 style="color:var(--success)">勝利！</h1><div class="sub">報酬カードを1枚選択</div><div class="reward-area">`;
  chosen.forEach(k=>{const d=CARD_DEFS[k];
    h+=`<div class="reward-card ${d.cls}" onclick="pickReward('${k}')"><div class="c-cost" style="position:absolute;top:6px;left:6px;background:var(--accent);color:#000;font-weight:700;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem">${d.cost}</div><div class="c-icon">${d.icon}</div><div class="c-val">${d.value}</div><div class="c-name">${d.name}</div><div class="c-desc">${d.desc}</div></div>`;
  });
  h+=`</div><button class="obtn" onclick="skipReward()">スキップ</button>`;
  ov.innerHTML=h;ov.style.display='flex';
}
function pickReward(type){const c=createCard(type);state.discardPile.push(c);addLog(`${c.name}を獲得！`,'drw');afterBattleWin()}
function skipReward(){addLog('報酬スキップ');afterBattleWin()}
function afterBattleWin(){
  // save deck state
  state.deck=[...state.drawPile,...state.hand,...state.discardPile];
  el('overlay').style.display='none';advanceFloor();
}

// ============================================================
// イベント
// ============================================================
function startEvent(){
  state.gamePhase='event';el('map-view').classList.add('hide');
  const evt=pick(EVENT_DEFS);
  const ov=el('overlay');
  let h=`<div class="event-box"><div style="font-size:2.5rem;margin-bottom:.5rem">${evt.icon}</div><h2>${evt.title}</h2><p>${evt.text}</p></div><div class="event-choices">`;
  evt.choices.forEach(ch=>{h+=`<button class="obtn${ch.action==='skip'?'':' primary'}" onclick="resolveEvent('${ch.action}')">${ch.label}</button>`});
  h+=`</div>`;ov.innerHTML=h;ov.style.display='flex';
}

function resolveEvent(action){
  const ov=el('overlay');
  switch(action){
    case 'blood_altar':
      const cost = Math.floor(state.playerMaxHP * 0.3);
      state.playerMaxHP -= cost;
      state.playerHP = Math.min(state.playerHP, state.playerMaxHP);
      const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id));
      let rText = 'もう得られる遺物はない...';
      if(avail.length>0){ const r=pick(avail); state.relics.push(r); rText=`遺物「${r.name}」を獲得！`; }
      ov.innerHTML=`<h1>🩸</h1><div class="sub">最大HPが${cost}減少した...<br>${rText}</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      break;
    case 'demon_forge':
      state.deck.forEach(c => { if(c.type==='attack') upgradeCard(c); });
      const curse = createCard('weak'); curse.name='呪い'; curse.desc='引くと損をする';
      state.deck.push(curse, curse);
      ov.innerHTML=`<h1>👿</h1><div class="sub">すべての攻撃カードが強化された！<br>...しかしデッキに呪いが2枚混ざった。</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      break;
    case 'roulette':
      if(Math.random()<0.5){
        const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id));
        let r1, r2;
        if(avail.length>0){ r1=pick(avail); state.relics.push(r1); }
        const avail2=RELIC_DEFS.filter(r=>!hasRelic(r.id));
        if(avail2.length>0){ r2=pick(avail2); state.relics.push(r2); }
        const text = r1 ? `遺物「${r1.name}」${r2?'と「'+r2.name+'」':''}を獲得！` : '遺物は得られなかった。';
        ov.innerHTML=`<h1>🎰大当たり！</h1><div class="sub">${text}</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      }else{
        const dmg = Math.floor(state.playerHP/2);
        state.playerHP -= dmg;
        ov.innerHTML=`<h1>💀大外れ...</h1><div class="sub">現在HPの半分（${dmg}ダメージ）を失った！</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      }
      break;
    case 'syringe':
      state.playerStatus.strength = (state.playerStatus.strength||0) + 2;
      state.playerStatus.bleed = (state.playerStatus.bleed||0) + 1;
      ov.innerHTML=`<h1>💉</h1><div class="sub">力が湧いてくる！（常時ダメージ+2）<br>しかし、毎ターン出血するようになった...。</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      break;
    case 'oblivion_purge':
      showPurgeUI(3);
      return;
    case 'fountain_heal':
      state.playerHP=Math.min(state.playerMaxHP,state.playerHP+10);
      ov.innerHTML=`<h1>⛲</h1><div class="sub">泉の水を飲んだ。HP+10回復！</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      break;
    case 'skip':default:afterEvent();return;
  }
}

function showUpgradeUI(){
  const ov=el('overlay');
  const upgradeable=state.deck.filter(c=>!c.upgraded&&CARD_DEFS[c.defKey].up);
  if(!upgradeable.length){ov.innerHTML=`<h1>⚒️</h1><div class="sub">強化できるカードがない</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;return}
  let h=`<h1>⚒️ カード強化</h1><div class="sub">強化するカードを選択</div><div class="deck-cards">`;
  upgradeable.forEach(c=>{
    const upd=CARD_DEFS[c.defKey].up;
    h+=`<div class="reward-card ${c.cls}" onclick="doUpgrade(${c.id})"><div class="c-icon">${c.icon}</div><div class="c-val">${c.value}→${upd.value}</div><div class="c-name">${c.name}</div><div class="c-desc">→${upd.name}</div></div>`;
  });
  h+=`</div><button class="obtn" onclick="afterEvent()">キャンセル</button>`;ov.innerHTML=h;
}
function doUpgrade(cardId){
  const card=state.deck.find(c=>c.id===cardId);
  if(card&&upgradeCard(card)){
    el('overlay').innerHTML=`<h1>⚒️</h1><div class="sub">${card.name}に強化！</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
  }
}

function showPurgeUI(maxCount=1){
  state.purgeCount = 0; state.maxPurge = maxCount; state.purgedList = [];
  renderPurgeUI();
}
function renderPurgeUI(){
  const ov=el('overlay');
  if(state.deck.length<=3){ov.innerHTML=`<h1>🔥</h1><div class="sub">デッキが少なすぎて削除できない</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;return}
  let h=`<h1>🔥 カード削除 (${state.purgeCount}/${state.maxPurge})</h1><div class="sub">削除するカードを選択してください（1枚につき8ダメージ）<br>現在: ${state.purgeCount*8}ダメージ予定</div><div class="deck-cards">`;
  state.deck.forEach((c,i)=>{h+=`<div class="reward-card ${c.cls}" onclick="purgeCard(${i})"><div class="c-icon">${c.icon}</div><div class="c-val">${c.value}</div><div class="c-name">${c.name}</div></div>`});
  h+=`</div><button class="obtn" onclick="finishPurge()">完了して進む</button>`;
  ov.innerHTML=h;
}
function purgeCard(idx){
  if(state.purgeCount>=state.maxPurge) return;
  const removed=state.deck.splice(idx,1)[0];
  state.purgedList.push(removed.name);
  state.purgeCount++;
  renderPurgeUI();
}
function finishPurge(){
  if(state.purgeCount===0){ afterEvent(); return; }
  const dmg = state.purgeCount * 8;
  state.playerHP = Math.max(1, state.playerHP - dmg);
  el('overlay').innerHTML=`<h1>🔥</h1><div class="sub">${state.purgedList.join(', ')}を削除した！<br>${dmg}ダメージを受けた...</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
}

function afterEvent(){el('overlay').style.display='none';advanceFloor()}

// ============================================================
// 休憩
// ============================================================
function startRest(){
  state.gamePhase='rest';el('map-view').classList.add('hide');
  const healAmt=Math.min(15,state.playerMaxHP-state.playerHP);
  const ov=el('overlay');
  ov.innerHTML=`<div class="rest-box"><h2>🏕️ 休憩所</h2><div class="sub">焚き火で体を休める</div><div class="event-choices"><button class="obtn primary" onclick="doRest(${healAmt})">休む（HP+${healAmt}）</button><button class="obtn" onclick="afterEvent()">すぐ出発</button></div></div>`;
  ov.style.display='flex';
}
function doRest(amt){
  state.playerHP=Math.min(state.playerMaxHP,state.playerHP+amt);
  el('overlay').innerHTML=`<h1>🏕️</h1><div class="sub">HP ${amt} 回復！（${state.playerHP}/${state.playerMaxHP}）</div><button class="obtn primary" onclick="afterEvent()">出発</button>`;
}

// ============================================================
// ゲームオーバー / クリア
// ============================================================
function showGameOver(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--danger)">GAME OVER</h1><div class="sub">階層 ${state.currentFloor+1} で倒れた...</div><button class="obtn primary" onclick="initGame()">最初から</button>`;
  ov.style.display='flex';
}
function showVictory(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--success)">🎉 ダンジョンクリア！</h1><div class="sub">全${state.map.length}階層を突破！<br>遺物: ${state.relics.map(r=>r.icon).join(' ')||'なし'}<br>デッキ: ${state.deck.length}枚</div><button class="obtn primary" onclick="startRun()">もう一度挑戦</button>`;
  ov.style.display='flex';
}

// ============================================================
// 戦闘UI
// ============================================================
function updateBattleUI(){
  el('p-hp').textContent=state.playerHP;el('e-hp').textContent=state.enemyHP;
  el('p-hp-max').textContent='/'+state.playerMaxHP;
  el('e-hp-max').textContent='/'+state.enemyMaxHP;
  el('e-name').textContent=state.currentEnemy?state.currentEnemy.name:'ENEMY';
  el('p-bar').style.width=`${(state.playerHP/state.playerMaxHP)*100}%`;
  el('e-bar').style.width=`${(state.enemyHP/state.enemyMaxHP)*100}%`;
  // HP low warning
  const pw=el('p-hp-wrap');pw.classList.toggle('hp-low',state.playerHP<=state.playerMaxHP*.3);
  // Energy pips
  let pips='';for(let i=0;i<state.maxEnergy;i++) pips+=`<span class="energy-pip ${i<state.energy?'full':'empty'}"></span>`;
  el('nrg-pips').innerHTML=pips;
  el('draw-c').textContent=state.drawPile.length;el('disc-c').textContent=state.discardPile.length;
  const bb=el('p-block');bb.textContent=`🛡${state.block}`;bb.classList.toggle('show',state.block>0);
  const ep=el('e-poison');ep.textContent=`☠${state.enemyStatus.poison}`;ep.classList.toggle('show',state.enemyStatus.poison>0);
  const ew=el('e-weak');ew.textContent=`💫${state.enemyStatus.weak}`;ew.classList.toggle('show',state.enemyStatus.weak>0);
  // Enemy intent with color
  const intent=el('e-intent');
  if(state.enemyIntent&&state.isPlayerTurn){
    intent.textContent=`次: ${state.enemyIntent.icon} ${state.enemyIntent.name}（${state.enemyIntent.value}）`;
    intent.className='enemy-intent intent-'+(state.enemyIntent.type==='attack'?'attack':'block');
  }else{intent.textContent='';intent.className='enemy-intent'}
  renderHand();updateTopBar();
}

function renderHand(){
  const h=el('hand');h.innerHTML='';
  state.hand.forEach((c,i)=>{
    const d=document.createElement('div');
    const ok=state.isPlayerTurn&&c.cost<=state.energy;
    d.className=`card ${c.cls}${ok?'':' disabled'}${c.upgraded?' upgraded':''}`;
    d.innerHTML=`<div class="c-cost">${c.cost}</div><div class="c-icon">${c.icon}</div><div class="c-val">${c.type==='draw'?'+'+c.value:c.value}</div><div class="c-name">${c.name}</div><div class="c-desc">${c.desc}</div>`;
    if(ok) d.onclick=()=>playCard(c.id);
    h.appendChild(d);
  });
}
function setBtnState(en){el('end-turn-btn').disabled=!en;el('hand').style.pointerEvents=en?'auto':'none'}
function addLog(msg,cls){const w=el('log');const e=document.createElement('div');e.className='log-e'+(cls?' '+cls:'');e.textContent='> '+msg;w.prepend(e)}
function shakeUnit(id){const u=document.getElementById(id);u.classList.remove('shake');void u.offsetWidth;u.classList.add('shake')}
function updateTopBar(){
  el('tb-floor').textContent=`階層: ${state.currentFloor+1}/${state.map.length}`;
  el('tb-hp').textContent=`HP: ${state.playerHP}/${state.playerMaxHP}`;
  el('tb-relics').textContent=state.relics.length?state.relics.map(r=>r.icon+r.name).join(' '):'遺物: なし';
}

// ============================================================
// ゲーム初期化
// ============================================================
function startRun(){
  el('title-view').classList.add('hide');
  el('top-bar').classList.remove('hide');
  initGame();
}
function initGame(){
  state.playerHP=state.playerMaxHP;state.block=0;state.enemyBlock=0;
  state.energy=state.maxEnergy=3;state.hand=[];state.discardPile=[];
  state.isPlayerTurn=false;state.enemyStatus={poison:0,weak:0};
  state.playerStatus={poison:0};state.enemyIntent=null;state.turnCount=0;
  state.currentFloor=0;state.relics=[];state.currentEnemy=null;state.handSize=5;
  state.deck=initializeDeck();state.drawPile=shuffle([...state.deck]);
  state.map=generateMap();state.gamePhase='map';
  el('overlay').style.display='none';
  el('battle-view').classList.add('hide');
  showMap();
}
function showGameOver(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--danger)">GAME OVER</h1><div class="sub">階層 ${state.currentFloor+1} で倒れた...<br>デッキ: ${state.deck.length}枚 | 遺物: ${state.relics.map(r=>r.icon).join(' ')||'なし'}</div><button class="obtn primary" onclick="startRun()">最初から</button>`;
  ov.style.display='flex';
}
