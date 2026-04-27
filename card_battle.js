// ============================================================
// メタデータ定義（実績・アンロック・永続強化）
// ============================================================
const META_DEFS={
  achievements:{
    first_blood:{name:'初陣',desc:'初めて戦闘に勝利する'},
    slayer:{name:'スレイヤー',desc:'ボスを撃破する'},
    untouchable:{name:'無傷の生還',desc:'ダメージを受けずに戦闘に勝利する'},
    poison_master:{name:'毒の支配者',desc:'敵に毒を100以上付与する'},
    iron_fortress:{name:'難攻不落',desc:'ブロックを100以上積む'},
    speedrunner:{name:'スピードスター',desc:'ボスを5ターン以内に撃破する'},
    relic_hunter:{name:'遺物コレクター',desc:'1回のランで遺物を7個以上集める'},
    gambler:{name:'ギャンブラー',desc:'ルーレットで大当たりを引く'},
    blood_price:{name:'血の代償',desc:'血の祭壇でHPを捧げる'},
    minimalist:{name:'ミニマリスト',desc:'デッキ10枚以下でクリア'},
    magician:{name:'手品師',desc:'1ターンに15枚以上ドローする'},
    overkill:{name:'オーバーキル',desc:'1回の攻撃で99以上のダメージ'},
    close_call:{name:'首の皮一枚',desc:'残りHP1で戦闘に勝利する'},
    sleepless:{name:'不眠不休',desc:'休憩せずにクリアする'},
    elite_hunter:{name:'エリートハンター',desc:'エリートを3体以上撃破する'},
    purifier:{name:'断捨離',desc:'1回のランで5枚以上削除する'},
    legion:{name:'百鬼夜行',desc:'デッキ30枚以上でクリア'},
    ascendant1:{name:'登り詰める者',desc:'挑戦レベル1をクリア'},
    ascendant5:{name:'真の達人',desc:'挑戦レベル5をクリア'},
    infinite_loop:{name:'無限ループ',desc:'1ターンに20枚以上プレイ'}
  },
  unlocks:{
    vamp_fang:{req:'playCount',val:3,type:'relic',name:'吸血牙'},
    demon_forge:{req:'bossKills',val:1,type:'event',name:'悪魔の鍛冶屋'},
    executioner:{req:'maxDamage',val:50,type:'card',name:'処刑人の斧'},
    noxious_fumes:{req:'maxPoison',val:30,type:'card',name:'致死毒'},
    barricade:{req:'maxBlock',val:100,type:'relic',name:'バリケード'},
    spinning_top:{req:'maxPlay',val:15,type:'relic',name:'独楽'}
  },
  upgrades:{
    max_hp:{name:'生命の器',desc:'初期最大HP+2 (最大5段階)',maxLevel:5,cost:10},
    upgrade_chance:{name:'戦士の勘',desc:'強化済みカード出現率+2% (最大5段階)',maxLevel:5,cost:20},
    heal_boost:{name:'癒やしの焚き火',desc:'休憩時の回復量+2 (最大3段階)',maxLevel:3,cost:15},
    boss_relic_choice:{name:'幸運のお守り',desc:'ボス遺物が2択から選べる',maxLevel:1,cost:100}
  }
};

let saveData = {
  playCount: 0,
  bossKills: 0,
  maxDamage: 0,
  maxPoison: 0,
  maxBlock: 0,
  maxPlay: 0,
  souls: 0,
  achievements: [],
  unlocked: [],
  upgrades: { max_hp:0, upgrade_chance:0, heal_boost:0, boss_relic_choice:0 },
  maxAscension: 0
};

function loadMeta(){
  const s = localStorage.getItem('neonDeckSave');
  if(s) saveData = {...saveData, ...JSON.parse(s)};
}
function saveMeta(){
  localStorage.setItem('neonDeckSave', JSON.stringify(saveData));
}
function unlockCheck(){
  Object.keys(META_DEFS.unlocks).forEach(k=>{
    if(saveData.unlocked.includes(k)) return;
    const u = META_DEFS.unlocks[k];
    if(saveData[u.req] >= u.val){
      saveData.unlocked.push(k);
      alert(`【アンロック】${u.name} が解放されました！`);
    }
  });
  saveMeta();
}
function unlockAchievement(id){
  if(!saveData.achievements.includes(id)){
    saveData.achievements.push(id);
    alert(`🏆 実績解除: ${META_DEFS.achievements[id].name}\n${META_DEFS.achievements[id].desc}`);
    saveMeta();
  }
}
loadMeta();

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
  modoku:{name:'猛毒化',cost:2,type:'skill',value:0,icon:'🧪',cls:'poison',desc:'敵の毒を2倍',synergy:'catalyst',up:{name:'猛毒化+',cost:1,value:0,desc:'(1コス)毒を2倍'}},
  erosion:{name:'侵食',cost:1,type:'skill',value:2,icon:'💀',cls:'poison',desc:'毒2, 所持時毒ダメ+3',synergy:'erosion',up:{name:'侵食+',value:3,desc:'毒3, 所持時毒ダメ+5'}},
  spikedArmor:{name:'トゲ装甲',cost:1,type:'skill',value:5,icon:'🦔',cls:'block',desc:'5盾, ブロック時5反射',synergy:'spiked_armor',up:{name:'トゲ装甲+',value:8,desc:'8盾, ブロック時8反射'}},
  ironWall:{name:'鉄壁',cost:2,type:'skill',value:0,icon:'🧱',cls:'block',desc:'ブロックを2倍',synergy:'entrench',up:{name:'鉄壁+',cost:1,value:0,desc:'(1コス)ブロックを2倍'}},
  accelerate:{name:'加速',cost:0,type:'skill',value:0,icon:'⏩',cls:'draw',desc:'2枚ドロー(廃棄)',synergy:'accelerate',up:{name:'加速+',value:0,desc:'3枚ドロー(廃棄)'}},
  chainStrike:{name:'連鎖',cost:1,type:'attack',value:3,icon:'🌪️',cls:'attack',desc:'3dmg×ドロー枚数',synergy:'chain_strike',up:{name:'連鎖+',value:4,desc:'4dmg×ドロー枚数'}}
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
  {id:'spinning_top',name:'独楽',icon:'🌀',desc:'手札が0枚になった時1枚ドロー',hook:'passive'},
  {id:'poison_flask',name:'毒瓶',icon:'🧪',desc:'戦闘開始時 敵に毒3',hook:'battleStart'},
  {id:'amplifier',name:'増幅器',icon:'📡',desc:'毒ダメージ+50%',hook:'passive'},
  {id:'reflect_shield',name:'反射盾',icon:'🪞',desc:'ブロックの30%をダメージとして返す',hook:'onHit'},
  {id:'heavy_armor',name:'重装化',icon:'🛡️',desc:'ターン開始時 ブロック+3',hook:'turnStart'},
  {id:'hyper_focus',name:'過集中',icon:'👁️',desc:'ドローするたび攻撃+1',hook:'onDraw'}
];

// ============================================================
// イベント定義
// ============================================================
const EVENT_DEFS=[
  {id:'demon_forge',title:'悪魔の鍛冶屋',icon:'👿',text:'すべての武器を極限まで鍛え上げるが、呪いが混入する。',
    choices:[{label:'鍛える（全攻撃カード強化、呪い追加）',action:'demon_forge'},{label:'立ち去る',action:'skip'}]},
  {id:'contract',title:'禁断の契約',icon:'📜',text:'HPを半分捧げれば、稀なる遺物を授けよう。',
    choices:[{label:'契約する（現在HP半減、遺物獲得）',action:'contract'},{label:'立ち去る',action:'skip'}]},
  {title:'謎の薬',icon:'🧪',text:'怪しげな薬が置かれている。',
    choices:[{label:'飲む（最大HP+10 or ランダム弱体）',action:'mystery_potion'},{label:'立ち去る',action:'skip'}]},
  {title:'呪われた宝箱',icon:'🧰',text:'開ければ強力な力を得られるが、呪いも引き受けることになる。',
    choices:[{label:'開ける（強カード入手、呪い追加）',action:'cursed_chest'},{label:'立ち去る',action:'skip'}]}
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
      case 'poison_flask': applyPoison(3);addLog('遺物[毒瓶] 敵に毒3','psn');break;
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
  const floors=[];
  const totalFloors = 10;
  
  const pickType = (weights) => {
    let total = Object.keys(weights).reduce((a,k)=>a+weights[k], 0);
    let r = Math.random() * total;
    for(let k in weights){ r -= weights[k]; if(r <= 0) return k; }
    return 'battle';
  };

  for(let f=0; f<totalFloors; f++){
    const nodes=[];
    let nodeCount = 3;
    if(f===0 || f===totalFloors-1) nodeCount = 1;
    else if(f===4 || f===8) nodeCount = 2;
    else nodeCount = Math.random()>0.5 ? 2 : 3;

    for(let i=0; i<nodeCount; i++){
      nodes.push({ id: f+'-'+i, type:'', icon:'', label:'', next:[] });
    }
    floors.push(nodes);
  }
  
  for(let f=0; f<totalFloors-1; f++){
    const curNodes = floors[f];
    const nextNodes = floors[f+1];
    curNodes.forEach(n => n.next = []);
    
    if(curNodes.length === 1){
      nextNodes.forEach((_, ni) => curNodes[0].next.push(ni));
    } else if(nextNodes.length === 1){
      curNodes.forEach(n => n.next.push(0));
    } else {
      if(curNodes.length === 2 && nextNodes.length === 2){
        curNodes[0].next.push(0); curNodes[1].next.push(1);
        if(Math.random()>0.5) curNodes[0].next.push(1);
        if(Math.random()>0.5) curNodes[1].next.push(0);
      } else if(curNodes.length === 2 && nextNodes.length === 3){
        curNodes[0].next.push(0, 1); curNodes[1].next.push(1, 2);
      } else if(curNodes.length === 3 && nextNodes.length === 2){
        curNodes[0].next.push(0); curNodes[1].next.push(0, 1); curNodes[2].next.push(1);
      } else if(curNodes.length === 3 && nextNodes.length === 3){
        curNodes[0].next.push(0); curNodes[1].next.push(1); curNodes[2].next.push(2);
        if(Math.random()>0.5) curNodes[0].next.push(1);
        if(Math.random()>0.5) curNodes[1].next.push(0, 2);
        if(Math.random()>0.5) curNodes[2].next.push(1);
      }
    }
    // duplicate remove
    curNodes.forEach(n => n.next = [...new Set(n.next)]);
  }

  const asc = state.activeAscension || 0;
  for(let f=0; f<totalFloors; f++){
    let bgType = (f<5) ? 'forest' : 'cave';
    floors[f].forEach((n, ni) => {
      n.bg = bgType;
      if(f===0) { n.type='battle'; n.icon='⚔️'; n.label='入口'; }
      else if(f===totalFloors-1) { n.type='boss'; n.icon='💀'; n.label='ボス'; n.bg='boss'; }
      else if(f===4 || f===8) { 
        if(Math.random()>0.3) { n.type='rest'; n.icon='🏕️'; n.label='休憩所'; }
        else { n.type='treasure'; n.icon='🧰'; n.label='宝箱'; }
      }
      else {
        let weights = { battle:50, event:30, elite:15, rest:5 };
        if(asc >= 1) weights.elite = 25;
        if(f===1) weights.elite = 0; // f1 no elite
        
        let type = pickType(weights);
        n.type = type;
        if(type==='battle'){ n.icon='⚔️'; n.label='戦闘'; }
        else if(type==='event'){ n.icon='❓'; n.label='謎'; }
        else if(type==='elite'){ n.icon='👹'; n.label='強敵'; }
        else if(type==='rest'){ n.icon='🏕️'; n.label='休憩'; }
      }
    });
  }
  
  for(let f=1; f<totalFloors; f++){
    floors[f].forEach((n, ni) => {
      if(n.type==='elite'){
        let parents = floors[f-1].filter((p) => p.next.includes(ni));
        if(parents.some(p => p.type==='elite')){
          n.type='battle'; n.icon='⚔️'; n.label='戦闘';
        }
      }
    });
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
  
  let h = '<div class="map-container" style="position:relative; padding-bottom: 50px;">';
  
  for(let f=state.map.length-1; f>=0; f--){
    if(f<state.map.length-1) h += '<div class="map-connector-space" style="height:40px;"></div>';
    let row=`<div class="map-floor" id="floor-${f}"><div class="fl-label">${(f===state.map.length-1?'BOSS':'F'+(f+1))}</div>`;
    state.map[f].forEach((node,ni)=>{
      const done=f<state.currentFloor;
      const current=f===state.currentFloor;
      
      let clickable = false;
      if(current){
        if(f===0) clickable = true;
        else if(state.map[f-1][state.currentNode].next.includes(ni)) clickable = true;
      }
      
      let cls='map-node';
      if(done){
        cls+=' done';
        if(state.pathHistory[f] === ni) cls+=' current-path';
      }
      else if(current && clickable) cls+=' current';
      else if(!clickable) cls+=' locked';
      if(node.type==='elite') cls+=' elite';
      
      const click=clickable?` onclick="selectNode(${f},${ni})"`:''
      row+=`<div class="${cls}" id="node-${f}-${ni}"${click}><div class="n-icon">${node.icon}</div><div class="n-label">${node.label}</div></div>`;
    });
    row+='</div>';h+=row;
  }
  h += '<svg id="map-svg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;"></svg>';
  h += '</div>';
  mv.innerHTML += h;
  updateTopBar();
  setTimeout(drawMapLines, 50);
}

function drawMapLines(){
  const svg = el('map-svg');
  if(!svg) return;
  const container = document.querySelector('.map-container');
  const cRect = container.getBoundingClientRect();
  
  let lines = '';
  for(let f=0; f<state.map.length-1; f++){
    state.map[f].forEach((node, ni) => {
      const elA = el(`node-${f}-${ni}`);
      if(!elA) return;
      const rectA = elA.getBoundingClientRect();
      const xA = rectA.left + rectA.width/2 - cRect.left;
      const yA = rectA.top + rectA.height/2 - cRect.top;
      
      node.next.forEach(nextIdx => {
        const elB = el(`node-${f+1}-${nextIdx}`);
        if(!elB) return;
        const rectB = elB.getBoundingClientRect();
        const xB = rectB.left + rectB.width/2 - cRect.left;
        const yB = rectB.top + rectB.height/2 - cRect.top;
        
        let color = 'rgba(255,255,255,0.15)';
        let isPath = state.pathHistory[f] === ni && state.pathHistory[f+1] === nextIdx;
        let isAvailable = false;
        
        if(f === state.currentFloor - 1 && state.currentNode === ni) {
          color = 'rgba(56, 189, 248, 0.6)';
          isAvailable = true;
        } else if (isPath) {
          color = 'rgba(16, 185, 129, 0.5)';
        }
        
        lines += `<line x1="${xA}" y1="${yA}" x2="${xB}" y2="${yB}" stroke="${color}" stroke-width="${isPath||isAvailable?4:2}" stroke-dasharray="${isPath?'none':'6,6'}" />`;
      });
    });
  }
  svg.innerHTML = lines;
}

function selectNode(floor,ni){
  if(floor!==state.currentFloor) return;
  if(floor>0 && !state.map[floor-1][state.currentNode].next.includes(ni)) return;

  state.currentNode = ni;
  state.pathHistory[floor] = ni;
  const node=state.map[floor][ni];
  switch(node.type){
    case 'battle':case 'boss':case 'elite':startBattle(node.type, node.bg);break;
    case 'event':startEvent();break;
    case 'rest':startRest();break;
    case 'treasure':startTreasure();break;
  }
}

function advanceFloor(){
  state.currentFloor++;
  if(state.currentFloor>=state.map.length){showGameClear();return}
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
function drawCards(n){
  for(let i=0;i<n;i++){
    const c=drawCard();if(!c) break;
    state.hand.push(c);
    if(hasRelic('hyper_focus')){ state.playerStatus.strength = (state.playerStatus.strength||0)+1; addLog('遺物[過集中] 攻撃力+1','buf'); }
    state.cardsDrawnThisTurn = (state.cardsDrawnThisTurn||0) + 1;
    if(state.cardsDrawnThisTurn >= 15) unlockAchievement('magician');
  }
}

function applyDamage(target,amount){
  if(target==='player'){
    let d=amount;
    const initialBlock = state.block;
    if(state.block>0){
      if(state.block>=d){state.block-=d;addLog(`ブロックで${d}防御！`,'blk');showDmgPopup('p-unit','🛡'+d,'block-pop');d=0}
      else{d-=state.block;addLog(`ブロック${state.block}消費、${d}貫通！`,'blk');state.block=0}
    }
    const blockedAmt = initialBlock - state.block;
    if(blockedAmt > 0){
      if(hasRelic('reflect_shield')){
        const ref = Math.floor(blockedAmt * 0.3);
        if(ref>0){ addLog(`遺物[反射盾] ${ref}ダメージ反射！`,'dmg'); setTimeout(()=>applyDamage('enemy',ref), 300); }
      }
      if(state.spikedArmorActive){
        const ref = state.spikedArmorActive;
        addLog(`[トゲ装甲] ${ref}ダメージ反射！`,'dmg'); setTimeout(()=>applyDamage('enemy',ref), 300);
      }
    }
    if(d>0){
      state.playerHP=Math.max(0,state.playerHP-d);addLog(`プレイヤーに${d}ダメージ！`,'dmg');showDmgPopup('p-unit','-'+d,'dmg-pop');flashUnit('p-unit');playerHitAnim();
      state.tookDamageThisBattle = true;
    }
  }else{
    let d=amount + (state.playerStatus.strength||0);
    if(state.enemyBlock>0){if(state.enemyBlock>=d){state.enemyBlock-=d;addLog(`敵ブロックが${d}防御！`,'blk');showDmgPopup('e-unit','🛡'+d,'block-pop');d=0}else{d-=state.enemyBlock;addLog(`敵ブロック貫通、${d}ダメージ！`,'blk');state.enemyBlock=0}}
    if(d>0){
      state.enemyHP=Math.max(0,state.enemyHP-d);addLog(`敵に${d}ダメージ！`,'dmg');showDmgPopup('e-unit','-'+d,'dmg-pop');flashUnit('e-unit');
      if(d > saveData.maxDamage){ saveData.maxDamage = d; saveMeta(); }
      if(d >= 99) unlockAchievement('overkill');
    }
  }
}
function applyBlock(n){
  state.block+=n;
  if(state.block > saveData.maxBlock){ saveData.maxBlock = state.block; saveMeta(); }
  if(state.block >= 100) unlockAchievement('iron_fortress');
}
function applyPoison(n){
  if(state.currentEnemy&&state.currentEnemy.poisonImmune){addLog('敵は毒無効！','dim');return}
  let amt = n + (hasRelic('snake_skull') ? 1 : 0);
  state.enemyStatus.poison+=amt;addLog(`敵に毒${amt}付与！`,'psn');
  if(state.enemyStatus.poison > saveData.maxPoison){ saveData.maxPoison = state.enemyStatus.poison; saveMeta(); }
  if(state.enemyStatus.poison >= 100) unlockAchievement('poison_master');
}
function applyWeak(n){state.enemyStatus.weak+=n;addLog(`敵に弱体${n}付与！`,'dbf')}
function applyStatusEffects(){
  const s=state.enemyStatus;
  if(s.poison>0){
    let pd = s.poison+(state.poisonBonus||0);
    if(hasRelic('amplifier')) pd = Math.floor(pd * 1.5);
    const hasErosion = [...state.hand, ...state.drawPile, ...state.discardPile].some(c=>c.defKey==='erosion');
    if(hasErosion){
      const upg = [...state.hand, ...state.drawPile, ...state.discardPile].find(c=>c.defKey==='erosion').upgraded;
      pd += (upg ? 5 : 3);
      addLog('侵食効果で毒ダメージ増加！', 'psn');
    }
    state.enemyHP=Math.max(0,state.enemyHP-pd);addLog(`毒で敵に${pd}ダメージ！`,'psn');s.poison--;shakeUnit('e-unit')
  }
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
  else if(card.synergy==='erosion'){applyPoison(val);addLog(`${card.name}！毒${val}付与`,'psn');showDmgPopup('e-unit','☠+'+val,'poison-pop')}
  else if(card.synergy==='spiked_armor'){applyBlock(val);state.spikedArmorActive = val;addLog(`${card.name}！ブロック+${val} トゲ展開！`,'blk');showDmgPopup('p-unit','+🛡'+val,'block-pop')}
  else if(card.synergy==='toxic_cloud'){applyPoison(val);applyWeak(1);addLog(`${card.name}！毒${val}+弱体1`,'psn');showDmgPopup('e-unit','☠+'+val,'poison-pop')}
  else if(card.synergy==='body_slam'){playerAttackAnim();const dmg=state.block;applyDamage('enemy',dmg);addLog(`${card.name}！ ブロック分の${dmg}ダメージ！`,'dmg');shakeUnit('e-unit')}
  else if(card.synergy==='entrench'){applyBlock(state.block);addLog(`${card.name}！ブロックが2倍に！`,'blk');showDmgPopup('p-unit','+🛡'+state.block,'block-pop')}
  else if(card.synergy==='accelerate'){drawCards(card.upgraded?3:2);addLog(`${card.name}！ドロー`,'drw')}
  else if(card.synergy==='adrenaline'){const eBonus=card.upgraded?2:1;state.energy=Math.min(state.maxEnergy+2,state.energy+eBonus);drawCards(2);addLog(`${card.name}！${eBonus}回復+2枚ドロー`,'drw')}
  else if(card.synergy==='chain_strike'){playerAttackAnim();const hits=state.cardsPlayedThisTurn;const dmg=val*hits;if(dmg>0)applyDamage('enemy',dmg);addLog(`${card.name}！ ${val}×${hits} = ${dmg}dmg`,'dmg');shakeUnit('e-unit')}
  else if(card.synergy==='flurry'){playerAttackAnim();const hits=state.cardsPlayedThisTurn;for(let i=0;i<=hits;i++) applyDamage('enemy',val);addLog(`${card.name}！ ${val}dmg×${hits+1}回`,'dmg');shakeUnit('e-unit')}
  else switch(card.type){
    case 'attack':playerAttackAnim();applyDamage('enemy',val);addLog(`${card.name}！`,'dmg');shakeUnit('e-unit');break;
    case 'block':applyBlock(val);addLog(`${card.name}！ ブロック+${val}`,'blk');showDmgPopup('p-unit','+🛡'+val,'block-pop');break;
    case 'heal':state.playerHP=Math.min(state.playerMaxHP,state.playerHP+val);addLog(`${card.name}！ HP${val}回復`,'hel');showDmgPopup('p-unit','+'+val,'heal-pop');break;
    case 'draw':addLog(`${card.name}！ ${val}枚ドロー`,'drw');drawCards(val);break;
    case 'poison':applyPoison(val);showDmgPopup('e-unit','☠+'+val,'poison-pop');break;
    case 'weak':applyWeak(val);break;
  }
  if(card.synergy!=='adrenaline' && card.synergy!=='accelerate') state.discardPile.push(card); // Adrenaline and Accelerate are exhaust
  
  state.cardsPlayedThisTurn++;
  if(state.cardsPlayedThisTurn > saveData.maxPlay){ saveData.maxPlay = state.cardsPlayedThisTurn; saveMeta(); }
  if(state.cardsPlayedThisTurn >= 20) unlockAchievement('infinite_loop');
  
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
  if(hasRelic('heavy_armor')) applyBlock(3);
  state.cardsPlayedThisTurn=0;
  state.cardsDrawnThisTurn=0;
  state.spikedArmorActive=0;
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
  const ed=JSON.parse(JSON.stringify(ENEMY_DEFS[ek]));
  if(state.activeAscension >= 2 && !isBoss){
    ed.hp = Math.floor(ed.hp * 1.15);
    ed.actions.forEach(a => { if(a.value) a.value = Math.floor(a.value * 1.15); });
  }
  if(state.activeAscension >= 4 && isBoss) ed.hp = Math.floor(ed.hp * 1.3);
  
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
  state.tookDamageThisBattle = false;
  startPlayerTurn();setBtnState(true);
}

function checkBattleEnd(){
  if(state.enemyHP<=0){
    triggerRelics('enemyKill');
    unlockAchievement('first_blood');
    if(!state.tookDamageThisBattle) unlockAchievement('untouchable');
    if(state.playerHP === 1) unlockAchievement('close_call');
    if(state.currentEnemy && state.currentEnemy.boss && state.turnCount <= 5) unlockAchievement('speedrunner');
    
    if(state.currentEnemy && state.currentEnemy.elite){
      addLog('エリートを撃破！遺物をドロップした！', 'success');
      state.elitesKilled = (state.elitesKilled || 0) + 1;
      if(state.elitesKilled >= 3) unlockAchievement('elite_hunter');
      
      const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id) && !(['vamp_fang','barricade','spinning_top'].includes(r.id) && !saveData.unlocked.includes(r.id)));
      if(avail.length>0){
        let r=pick(avail);
        if(saveData.upgrades.boss_relic_choice){
           const avail2=avail.filter(x=>x.id!==r.id);
           if(avail2.length>0) r = Math.random()>0.5 ? pick(avail2) : r; // 雑だが2択相当の挙動（実際はUIなし自動選択の確率アップ）
        }
        state.relics.push(r);
        addLog(`遺物[${r.name}]を獲得！`);
      }
    }
    setTimeout(showReward,500);return true;
  }
  if(state.playerHP<=0){showGameOver();return true}
  return false;
}

function showReward(){
  const cnt=hasRelic('lucky_coin')?4:3;
  
  // ドロップの重み付け計算
  const deckCounts = {};
  state.deck.forEach(c => {
    const cls = CARD_DEFS[c.defKey]?.cls;
    if(cls) deckCounts[cls] = (deckCounts[cls]||0) + 1;
  });
  
  const pool = [];
  Object.keys(CARD_DEFS).forEach(k => {
    if(['executioner','noxious_fumes'].includes(k) && !saveData.unlocked.includes(k)) return; // ロック中なら出ない
    const cls = CARD_DEFS[k].cls;
    let weight = 1 + (deckCounts[cls]||0); // 所持枚数分出やすくなる
    for(let i=0; i<weight; i++) pool.push(k);
  });
  
  const chosen=[];
  while(chosen.length<cnt){const k=pick(pool);if(!chosen.includes(k)) chosen.push(k)}
  
  const ov=el('overlay');
  let h=`<h1 style="color:var(--success)">勝利！</h1><div class="sub">報酬カードを1枚選択</div><div class="reward-area">`;
  chosen.forEach(k=>{const d=CARD_DEFS[k];
    h+=`<div class="reward-card ${d.cls}" onclick="pickReward('${k}')"><div class="c-cost" style="position:absolute;top:6px;left:6px;background:var(--accent);color:#000;font-weight:700;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem">${d.cost}</div><div class="c-icon">${d.icon}</div><div class="c-val">${d.value}</div><div class="c-name">${d.name}</div><div class="c-desc">${d.desc}</div></div>`;
  });
  h+=`</div><button class="obtn" onclick="skipReward()">スキップ</button>`;
  ov.innerHTML=h;ov.style.display='flex';
}
function pickReward(type){
  const upgRate = (saveData.upgrades.upgrade_chance||0) * 0.02;
  const c=createCard(type, Math.random() < upgRate);
  state.discardPile.push(c);addLog(`${c.name}を獲得！`,'drw');afterBattleWin()
}
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
  let availableEvents = EVENT_DEFS.filter(e => e.id!=='demon_forge' || saveData.unlocked.includes('demon_forge'));
  const evt=pick(availableEvents);
  const ov=el('overlay');
  let h=`<div class="event-box"><div style="font-size:2.5rem;margin-bottom:.5rem">${evt.icon}</div><h2>${evt.title}</h2><p>${evt.text}</p></div><div class="event-choices">`;
  evt.choices.forEach(ch=>{h+=`<button class="obtn${ch.action==='skip'?'':' primary'}" onclick="resolveEvent('${ch.action}')">${ch.label}</button>`});
  h+=`</div>`;ov.innerHTML=h;ov.style.display='flex';
}

function resolveEvent(action){
  const ov=el('overlay');
  switch(action){
    case 'roulette':
      if(Math.random()<0.5){
        const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id));
        let r1, r2;
        if(avail.length>0){ r1=pick(avail); state.relics.push(r1); }
        const avail2=RELIC_DEFS.filter(r=>!hasRelic(r.id));
        if(avail2.length>0){ r2=pick(avail2); state.relics.push(r2); }
        const text = r1 ? `遺物「${r1.name}」${r2?'と「'+r2.name+'」':''}を獲得！` : '遺物は得られなかった。';
        ov.innerHTML=`<h1>🎰大当たり！</h1><div class="sub">${text}</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
        unlockAchievement('gambler');
      }else{
        const dmg = Math.floor(state.playerHP/2);
        state.playerHP -= dmg;
        ov.innerHTML=`<h1>💀大外れ...</h1><div class="sub">現在HPの半分（${dmg}ダメージ）を失った！</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      }
      break;
    case 'contract':
      const dmg = Math.floor(state.playerHP/2);
      state.playerHP -= dmg;
      const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id));
      let rText = 'もう得られる遺物はない...';
      if(avail.length>0){ const r=pick(avail); state.relics.push(r); rText=`遺物「${r.name}」を獲得！`; }
      ov.innerHTML=`<h1>📜</h1><div class="sub">HPを半分（${dmg}ダメージ）失った...<br>${rText}</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      unlockAchievement('blood_price');
      break;
    case 'mystery_potion':
      if(Math.random()<0.5){
        state.playerMaxHP += 10; state.playerHP += 10;
        ov.innerHTML=`<h1>🧪</h1><div class="sub">力がみなぎる！ 最大HP+10</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      }else{
        const mDmg = 15; state.playerHP = Math.max(1, state.playerHP - mDmg);
        ov.innerHTML=`<h1>💀</h1><div class="sub">毒だ！ ${mDmg}ダメージを受けた！</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
      }
      break;
    case 'cursed_chest':
      const strong = pick(['modoku','ironWall','accelerate','hAttack','hBlock']);
      const c1 = createCard(strong); state.deck.push(c1);
      const curse = createCard('weak'); curse.name='呪い'; curse.desc='引くと損をする';
      state.deck.push(curse);
      ov.innerHTML=`<h1>🧰</h1><div class="sub">${c1.name}を獲得！<br>...しかし「呪い」も混ざった。</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
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
  state.totalPurged = (state.totalPurged||0) + state.purgeCount;
  if(state.totalPurged >= 5) unlockAchievement('purifier');
}

function afterEvent(){el('overlay').style.display='none';advanceFloor()}

// ============================================================
// 休憩
// ============================================================
function startRest(){
  state.gamePhase='rest';el('map-view').classList.add('hide');
  let baseHeal=15;
  if(state.activeAscension >= 3) baseHeal = Math.floor(baseHeal / 2);
  let healAmt=Math.min(baseHeal,state.playerMaxHP-state.playerHP);
  healAmt += ((saveData.upgrades.heal_boost||0) * 2);
  const ov=el('overlay');
  let h = `<div class="rest-box"><h2>🏕️ 休憩所</h2><div class="sub">焚き火で何をしようか？</div><div class="event-choices">`;
  h += `<button class="obtn primary" onclick="doRest(${healAmt})">休む（HP+${healAmt}）</button>`;
  
  const upgradeable=state.deck.filter(c=>!c.upgraded&&CARD_DEFS[c.defKey].up);
  if(upgradeable.length > 0){
    h += `<button class="obtn primary" onclick="doRestUpgrade()">鍛練（カードを強化）</button>`;
  }
  
  h += `<button class="obtn" onclick="afterEvent()">すぐ出発</button></div></div>`;
  ov.innerHTML = h;
  ov.style.display='flex';
}
function doRestUpgrade(){
  showUpgradeUI();
}

function startTreasure(){
  state.gamePhase='treasure';el('map-view').classList.add('hide');
  const ov=el('overlay');
  
  const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id) && !(['vamp_fang','barricade','spinning_top'].includes(r.id) && !saveData.unlocked.includes(r.id)));
  let rText = '宝箱は空だった...';
  if(avail.length>0){ 
    const r=pick(avail); state.relics.push(r); 
    rText=`遺物「${r.name}」を獲得！`; 
    addLog(rText, 'buf');
  }
  
  ov.innerHTML=`<h1>🧰 宝箱</h1><div class="sub">中には遺物が入っていた！<br>${rText}</div><button class="obtn primary" onclick="afterEvent()">続行</button>`;
  ov.style.display='flex';
}
function doRest(amt){
  state.usedRest = true;
  state.playerHP=Math.min(state.playerMaxHP,state.playerHP+amt);
  el('overlay').innerHTML=`<h1>🏕️</h1><div class="sub">HP ${amt} 回復！（${state.playerHP}/${state.playerMaxHP}）</div><button class="obtn primary" onclick="afterEvent()">出発</button>`;
}

// ============================================================
// ゲームオーバー / クリア
// ============================================================
function showGameOver(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--danger)">ゲームオーバー</h1><div class="sub">あなたの魂は輪廻に飲まれた...</div><button class="obtn primary" onclick="returnTitle()">タイトルへ戻る</button>`;
  ov.style.display='flex';
  saveData.souls += 5; // death compensation
  saveMeta();
}
function showVictory(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
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
  if(state.relics.length){
    const relicsHtml = state.relics.map(r => 
      `<span class="relic-icon" onmouseenter="showRelicTooltip(event, '${r.id}')" onmouseleave="hideRelicTooltip()" onclick="toggleRelicTooltip(event, '${r.id}')">${r.icon}</span>`
    ).join('');
    el('tb-relics').innerHTML = `遺物: ${relicsHtml}`;
  } else {
    el('tb-relics').textContent = '遺物: なし';
  }
}

let tooltipTimer = null;
let activeTooltipId = null;

function showRelicTooltip(e, id) {
  clearTimeout(tooltipTimer);
  const relic = RELIC_DEFS.find(r => r.id === id);
  if(!relic) return;
  const tt = el('relic-tooltip');
  const descHtml = relic.desc.replace(/(\d+%?)/g, '<strong>$1</strong>');
  tt.innerHTML = `<h3>${relic.name}</h3><p>${descHtml}</p>`;
  tt.classList.remove('hide');
  void tt.offsetWidth; // force reflow
  tt.classList.add('show');
  
  const rect = e.target.getBoundingClientRect();
  let top = rect.bottom + 10;
  let left = rect.left;
  
  if(left + 250 > window.innerWidth) left = window.innerWidth - 260; // 画面右端はみ出し防止
  if(top + 80 > window.innerHeight) top = rect.top - 90; // 画面下端はみ出し防止
  
  tt.style.top = top + 'px';
  tt.style.left = left + 'px';
}

function hideRelicTooltip() {
  const tt = el('relic-tooltip');
  tt.classList.remove('show');
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => {
    if(!tt.classList.contains('show')) tt.classList.add('hide');
  }, 200);
}

function toggleRelicTooltip(e, id) {
  if (activeTooltipId === id && el('relic-tooltip').classList.contains('show')) {
    hideRelicTooltip();
    activeTooltipId = null;
  } else {
    showRelicTooltip(e, id);
    activeTooltipId = id;
  }
}

// ============================================================
// ゲーム初期化
// ============================================================
function initRun(){
  if(saveData.playCount === 0){
    startRun();
    return;
  }
  // スタートボーナス表示
  el('title-view').classList.add('hide');
  const ov=el('overlay');
  let h=`<h1 style="color:var(--accent)">神秘なる声</h1><div class="sub">再び挑む者よ...恩恵を授けよう。</div><div class="event-choices">`;
  h+=`<button class="obtn primary" onclick="startRunWithBonus('hp')">安定：最大HP+10</button>`;
  h+=`<button class="obtn primary" onclick="startRunWithBonus('relic')">未知：ランダム遺物1つ獲得</button>`;
  h+=`<button class="obtn" onclick="startRunWithBonus('risk')" style="color:var(--danger)">危険：最大HP-20%、ボス遺物獲得</button>`;
  h+=`</div>`;
  ov.innerHTML=h;ov.style.display='flex';
}

function startRunWithBonus(type){
  startRun();
  if(type==='hp'){ state.playerMaxHP+=10; state.playerHP+=10; addLog('恩恵：最大HP+10','hel'); }
  else if(type==='relic'){
    const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id) && !(['vamp_fang','barricade','spinning_top'].includes(r.id) && !saveData.unlocked.includes(r.id)));
    if(avail.length>0){ const r=pick(avail); state.relics.push(r); addLog(`恩恵：遺物[${r.name}]を獲得！`,'buf'); }
  }
  else if(type==='risk'){
    const cost = Math.floor(state.playerMaxHP*0.2);
    state.playerMaxHP-=cost; state.playerHP = Math.min(state.playerHP, state.playerMaxHP);
    const avail=RELIC_DEFS.filter(r=>!hasRelic(r.id) && !(['vamp_fang','barricade','spinning_top'].includes(r.id) && !saveData.unlocked.includes(r.id)));
    if(avail.length>0){ const r=pick(avail); state.relics.push(r); addLog(`代償：最大HP-${cost}。遺物[${r.name}]を獲得！`,'dmg'); }
  }
  updateTopBar();
}

function startRun(){
  el('title-view').classList.add('hide');
  el('top-bar').classList.remove('hide');
  saveData.playCount++; saveMeta();
  initGame();
}
function initGame(){
  // 永続強化の適用
  const hpBonus = saveData.upgrades.max_hp * 2;
  state.playerMaxHP = 50 + hpBonus;
  state.playerHP=state.playerMaxHP;
  
  state.block=0;state.enemyBlock=0;
  state.energy=state.maxEnergy=3;state.hand=[];state.discardPile=[];
  state.isPlayerTurn=false;state.enemyStatus={poison:0,weak:0};
  state.playerStatus={poison:0};state.enemyIntent=null;state.turnCount=0;
  state.currentFloor=0;state.currentNode=0;state.pathHistory=[];state.relics=[];state.currentEnemy=null;state.handSize=5;
  
  // アセンション適用
  if(saveData.maxAscension >= 5){
    const curse = createCard('weak'); curse.name='呪い'; curse.desc='引くと損をする';
    state.deck=initializeDeck(); state.deck.push(curse);
  }else{
    state.deck=initializeDeck();
  }
  state.drawPile=shuffle([...state.deck]);
  state.map=generateMap();state.gamePhase='map';
  el('overlay').style.display='none';
  el('battle-view').classList.add('hide');
  showMap();
}
function showGameOver(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--danger)">ゲームオーバー</h1><div class="sub">階層 ${state.currentFloor+1} で倒れた...<br>あなたの魂は輪廻に飲まれた</div><button class="obtn primary" onclick="returnTitle()">タイトルへ戻る</button>`;
  ov.style.display='flex';
  saveData.souls += 5; // death compensation
  saveMeta();
}

function showGameClear(){
  document.body.classList.remove('battle-bg');
  const ov=el('overlay');
  ov.innerHTML=`<h1 style="color:var(--success)">ダンジョン踏破！</h1><div class="sub">あなたは輪廻を打ち破った！</div><button class="obtn primary" onclick="returnTitle()">タイトルへ戻る</button>`;
  ov.style.display='flex';
  unlockAchievement('slayer');
  if(!state.usedRest) unlockAchievement('sleepless');
  saveData.bossKills++;
  saveData.souls += 15;
  if(state.activeAscension === saveData.maxAscension) saveData.maxAscension++;
  if(state.activeAscension >= 1) unlockAchievement('ascendant1');
  if(state.activeAscension >= 5) unlockAchievement('ascendant5');
  if(state.deck.length <= 10) unlockAchievement('minimalist');
  if(state.deck.length >= 30) unlockAchievement('legion');
  saveMeta();
  unlockCheck();
}

function returnTitle(){
  el('overlay').style.display='none';el('battle-view').classList.add('hide');el('map-view').classList.add('hide');el('top-bar').classList.add('hide');
  el('title-view').classList.remove('hide');
  changeAscension(0);
}

// ============================================================
// メタUI (タイトル画面)
// ============================================================
function changeAscension(d){
  if(saveData.maxAscension===undefined) saveData.maxAscension=0;
  let val = parseInt(el('ascension-lv').textContent) || 0;
  val = Math.max(0, Math.min(val + d, saveData.maxAscension));
  el('ascension-lv').textContent = val;
  const descs = ['標準難易度','エリート敵が出現しやすくなる','敵のHPと攻撃力15%アップ','休憩での回復量が半減','ボスのHPが30%アップ','初期デッキに「呪い」が混ざる'];
  el('ascension-desc').textContent = descs[val] || '';
  state.activeAscension = val;
}
window.addEventListener('DOMContentLoaded', ()=>changeAscension(0));

function showAchievementsUI(){
  const ov=el('overlay');
  let h=`<h1>🏆 実績・アンロック状況</h1><div style="max-width:600px;max-height:80vh;overflow-y:auto;text-align:left;color:var(--text);font-size:0.9rem;display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;padding-right:1rem">`;
  
  h+=`<div style="width:100%"><h2 style="color:var(--accent);border-bottom:1px solid rgba(255,255,255,.2);margin-bottom:0.5rem">解放済み要素</h2><div style="display:flex;gap:0.5rem;flex-wrap:wrap">`;
  Object.keys(META_DEFS.unlocks).forEach(k=>{
    const u = META_DEFS.unlocks[k];
    const unlocked = saveData.unlocked.includes(k);
    h+=`<div style="padding:0.5rem;background:rgba(255,255,255,${unlocked?0.1:0.02});border:1px solid rgba(255,255,255,0.1);border-radius:6px;opacity:${unlocked?1:0.4}">
      ${u.name} <br><small style="color:var(--dim)">${unlocked?'解放済み':(u.req==='playCount'?'累計プレイ'+u.val+'回':u.req==='bossKills'?'ボス撃破':'特定条件達成')}</small>
    </div>`;
  });
  h+=`</div></div>`;

  h+=`<div style="width:100%;margin-top:1rem"><h2 style="color:var(--success);border-bottom:1px solid rgba(255,255,255,.2);margin-bottom:0.5rem">実績</h2><div style="display:flex;gap:0.5rem;flex-wrap:wrap">`;
  Object.keys(META_DEFS.achievements).forEach(k=>{
    const a = META_DEFS.achievements[k];
    const unlocked = saveData.achievements.includes(k);
    h+=`<div style="padding:0.5rem;background:rgba(255,255,255,${unlocked?0.1:0.02});border:1px solid rgba(255,255,255,0.1);border-radius:6px;width:calc(50% - 0.5rem);opacity:${unlocked?1:0.4}">
      <strong>${a.name}</strong> ${unlocked?'✅':''}<br><small style="color:var(--dim)">${a.desc}</small>
    </div>`;
  });
  h+=`</div></div>`;
  
  h+=`</div><button class="obtn" style="margin-top:1.5rem" onclick="closeOverlay()">閉じる</button>`;
  ov.innerHTML=h;ov.style.display='flex';
}

function showUpgradesUI(){
  const ov=el('overlay');
  let h=`<h1>✨ 魂の強化</h1><div class="sub">所持する魂: <span style="color:var(--accent);font-weight:bold">${saveData.souls}</span></div><div style="max-width:500px;text-align:left;display:flex;flex-direction:column;gap:1rem">`;
  
  Object.keys(META_DEFS.upgrades).forEach(k=>{
    const u = META_DEFS.upgrades[k];
    const clvl = saveData.upgrades[k] || 0;
    const isMax = clvl >= u.maxLevel;
    h+=`<div style="background:var(--card-bg);padding:1rem;border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-weight:bold;color:var(--accent)">${u.name} (Lv ${clvl}/${u.maxLevel})</div>
        <div style="font-size:0.8rem;color:var(--dim)">${u.desc}</div>
      </div>
      <div>
        ${isMax ? '<span style="color:var(--dim)">MAX</span>' : `<button class="obtn primary" onclick="buyUpgrade('${k}')">強化 (${u.cost}魂)</button>`}
      </div>
    </div>`;
  });
  
  h+=`</div><button class="obtn" style="margin-top:1.5rem" onclick="closeOverlay()">閉じる</button>`;
  ov.innerHTML=h;ov.style.display='flex';
}

function buyUpgrade(key){
  const u = META_DEFS.upgrades[key];
  if(saveData.souls >= u.cost && (saveData.upgrades[key]||0) < u.maxLevel){
    saveData.souls -= u.cost;
    saveData.upgrades[key] = (saveData.upgrades[key]||0) + 1;
    saveMeta();
    showUpgradesUI();
  }else{
    alert('魂が足りません！');
  }
}
function closeOverlay(){ el('overlay').style.display='none'; }
