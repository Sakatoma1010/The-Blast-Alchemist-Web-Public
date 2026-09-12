"use strict";
/* The Blast Alchemist - file:// compatible bundle */
(()=>{

/* ===== config.js ===== */
const QUESTION_REQUIREMENT_COLOR_ID = 5;
const UNIVERSAL_MANA_COLOR_ID = 5;
const UNIVERSAL_MANA_CARD_ID = 0;

const COLORS = [
  {id:0,key:'red',name:'火',symbol:'◆'},
  {id:1,key:'blue',name:'水',symbol:'◆'},
  {id:2,key:'green',name:'風',symbol:'◆'},
  {id:3,key:'yellow',name:'光',symbol:'◆'},
  {id:4,key:'earth',name:'土',symbol:'◆'},
  {id:5,key:'any',name:'万能',symbol:'★'}
];

const DIFFICULTIES = {
  beginner:{
    id:0,key:'beginner',label:'初級',normalColorCount:4,manaValueTypes:3,copiesPerNormal:4,
    normalManaTotal:48,wildCount:6,deckTotal:54,wildValue:3,blastThreshold:8,blastLifeLoss:1,
    initialLife:3,initialRequestCount:3,calamityInterval:12,requestCapacity:100,
    specialPositions:[6,11],questionAmountBonus:1,questionAmountMax:7,drawMin:1,drawMax:3,
    publicSetCount:2,publicSetCardCount:2,questionRandomBase:96,minPublicRequests:3,
    calamityCountPerInterval:1,subtractDeckAtFinish:false,recordBest:true,adlib:false
  },
  advanced:{
    id:1,key:'advanced',label:'上級',normalColorCount:5,manaValueTypes:3,copiesPerNormal:4,
    normalManaTotal:60,wildCount:6,deckTotal:66,wildValue:3,blastThreshold:8,blastLifeLoss:1,
    initialLife:3,initialRequestCount:3,calamityInterval:10,requestCapacity:100,
    specialPositions:[8,12],questionAmountBonus:1,questionAmountMax:7,drawMin:1,drawMax:3,
    publicSetCount:2,publicSetCardCount:2,questionRandomBase:100,minPublicRequests:3,
    calamityCountPerInterval:1,subtractDeckAtFinish:false,recordBest:true,adlib:false
  },
  adlib:{
    id:2,key:'adlib',label:'アドリブ',normalColorCount:5,manaValueTypes:3,copiesPerNormal:4,
    normalManaTotal:60,wildCount:6,deckTotal:66,wildValue:3,blastThreshold:8,blastLifeLoss:1,
    initialLife:3,initialRequestCount:3,calamityInterval:10,requestCapacity:100,
    specialPositions:[8,12],questionAmountBonus:0,questionAmountMax:7,drawMin:1,drawMax:3,
    publicSetCount:2,publicSetCardCount:2,questionRandomBase:100,minPublicRequests:3,
    calamityCountPerInterval:1,subtractDeckAtFinish:false,recordBest:false,adlib:true
  }
};

const WEB_CONFIG = {
  bestStorageKey:'the-blast-alchemist-best-records-v1',
  questImageBase:'img/cards/quest/',
  logoPath:'img/basic/logo.png',
  questionThresholds:[12,32,50],
  requirementColorBag:{perActiveColor:7},
  calamity:{overdriveDrawCount:5,badOmenLifeLoss:1,poisonFogSecondSlotAdd:2},
  ui:{expiringTurns:2,manaGroupCount:6,manaGroupCapacity:10,initialFreeDraw:3},
  resultRatings:{
    beginner:[{min:61,label:'FANTASTIC!'},{min:58,label:'EXCELLENT!'},{min:53,label:'GREAT!'},{min:48,label:'GOOD!'},{min:-Infinity,label:'NICE TRY!'}],
    advanced:[{min:74,label:'FANTASTIC!'},{min:67,label:'EXCELLENT!'},{min:57,label:'GREAT!'},{min:46,label:'GOOD!'},{min:-Infinity,label:'NICE TRY!'}]
  },
  timing:{turnDelay:180,blastFlash:460,questComplete:910,toast:1600,drawFlipHalf:130,drawSlide:190,publicSlide:230,drawStagger:45}
};

/* ===== master.js ===== */
const REQUEST_CATEGORIES = [
  {id:0,key:'normal3',score:3,failScore:-1,penalty:null},
  {id:1,key:'normal4',score:4,failScore:-1,penalty:null},
  {id:2,key:'special',score:8,failScore:0,penalty:null},
  {id:3,key:'disaster',score:3,failScore:-1,penalty:'master'}
];

const REQUESTS = [
  {id:0,key:'outskirts_bandit',name:'郊外のならず者',category:0,base:[3,3,0],turns:10,penalty:null,icon:'🥤',flavor:'俺は裕福になりたいわけじゃねえんだよ。貧しい者に安心して飲める水と少しの食料があれば、それでええ。'},
  {id:1,key:'star_witch',name:'星詠みの魔女',category:0,base:[4,2,0],turns:9,penalty:null,icon:'🌙',flavor:'晴れた夜空の下、惑星と星座の座標関係で予想される運命。雲が多い日や雨の日には、彼女が姿を現すことはない。'},
  {id:2,key:'sun_merchant',name:'太陽の国の商人',category:0,base:[5,0,0],turns:10,penalty:null,icon:'☀️',flavor:'やっほー！ ウチの国で採れる資材は限られとってな！ あんたがここで作ってくれる薬、めっちゃ重宝してんねん！'},
  {id:3,key:'shepherd_girl',name:'羊牧場の娘',category:0,base:[3,2,0],turns:9,penalty:null,icon:'🐑',flavor:'ねぇねぇ、都会から来たの？ 都会ってヒツジさんいないんだよね…？'},
  {id:4,key:'magic_student',imageKey:'magic_academy_student',name:'魔術学院の学生',category:0,base:[2,2,1],turns:10,penalty:null,icon:'📘',flavor:'山を見て、風を聞いて、魔力を感じとる……。先生はそう言ってたんだけどな。'},
  {id:5,key:'snow_magistrate',name:'雪の国の法官',category:1,base:[6,0,0],turns:10,penalty:null,icon:'❄️',flavor:'雪は、どんな景色も白く染めてくれるのに……。人の罪まで白くできるほど、世界は単純ではないものね。'},
  {id:6,key:'ruins_doctor',name:'遺跡調査の博士',category:1,base:[4,3,0],turns:10,penalty:null,icon:'🏺',flavor:'彼女の報告と一致しない。また分からないことが増えた。……順調だな。'},
  {id:7,key:'flower_curator',name:'花の村の学芸員',category:1,base:[3,3,1],turns:10,penalty:null,icon:'🌼',flavor:'花ですか？好きですよ。学名も開花時期も分かれば、なおさらね。'},
  {id:8,key:'operation_day',name:'作戦決行の日',category:2,base:[6,3,0],turns:6,penalty:null,icon:'⚔️',flavor:'「チャンスは一度だけだ。」「分かってるって。失敗するつもりもないよ」'},
  {id:9,key:'church_rebuild',name:'教会再建計画',category:2,base:[5,3,1],turns:6,penalty:null,icon:'⛪',flavor:'「奇跡を待つだけでは、教会は建ちませんもの」'},
  {id:10,key:'overdrive',name:'オーバードライブ',category:3,base:[4,3,0],turns:5,penalty:'overdrive',icon:'⚡',flavor:'出力を上げろ。壊れなければ、まだ力が足りないってことさ！'},
  {id:11,key:'bad_omen',name:'不幸の予兆',category:3,base:[3,3,1],turns:5,penalty:'life',icon:'☠️',flavor:'彼は沼に足を運んだ。昨日は森に足を運んだ。明日はどこに行こうか。'},
  {id:12,key:'poison_fog',name:'毒の濃霧',category:3,base:[5,1,0],turns:4,penalty:'poisonFog',icon:'☁️',flavor:'えへへ、何？ ちょっと霧を濃くしただけじゃない。'}
];

function manaCardId(colorId,value){ return colorId*10+value; }
function getManaDef(cardId){
  if(cardId===0) return {id:0,colorId:5,key:'any',name:'万能',value:3,wild:true};
  const colorId=Math.floor(cardId/10), value=cardId%10;
  const keys=['red','blue','green','yellow','earth'];
  const names=['火','水','風','光','土'];
  return {id:cardId,colorId,key:keys[colorId],name:names[colorId],value,wild:false};
}
function questImage(master,state='normal'){
  const prefix=String(master.id+1).padStart(3,'0');
  return `img/cards/quest/q${prefix}_${master.imageKey||master.key}_${state}.png`;
}

/* ===== core.js ===== */

const clone=o=>structuredClone(o);
const rint=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=rint(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};

class BlastGame{
  constructor(){ this.state=null; this.uid=1; }

  newGame(mode){
    const tutorial=mode==='tutorial';
    const difficulty=tutorial?DIFFICULTIES.beginner:DIFFICULTIES[mode];
    this.uid=1;
    this.state={
      mode, tutorial, difficultyKey:difficulty.key, rules:clone(difficulty), status:'playing', turn:1,
      life:difficulty.initialLife, lifeLost:0, score:0, finalScore:null, rating:null,
      deck:[], deckPosition:0, publicSets:Array.from({length:difficulty.publicSetCount},()=>[]),
      hand:[], requests:[], selectedRequestUid:null, selectedManaUids:[],
      nextRequestNo:1, progressionAdded:0, completed:0, failed:0, blastCount:0, perfectCount:0,
      calamitySpawnedCycles:0, lastPrimaryColor:-1,
      colorBag:{remaining:[0,0,0,0,0],total:0},
      lastEvent:null, pendingEffects:[], message:'', endReason:null, tutorialStep:tutorial?0:null
    };
    this.buildDeck();
    this.refillPublicSet(0); this.refillPublicSet(1);
    for(let i=0;i<difficulty.initialRequestCount;i++) this.addRequestByCategory(0,false);
    if(tutorial) this.state.message='まずは山札から3枚引いてみましょう。';
    return this.state;
  }

  buildDeck(){
    const s=this.state,r=s.rules,deck=[];
    for(let c=0;c<r.normalColorCount;c++) for(let v=1;v<=r.manaValueTypes;v++) for(let n=0;n<r.copiesPerNormal;n++) deck.push(manaCardId(c,v));
    for(let n=0;n<r.wildCount;n++) deck.push(UNIVERSAL_MANA_CARD_ID);
    shuffle(deck); s.deck=deck; s.deckPosition=0;
  }
  deckRemaining(){return this.state.deck.length-this.state.deckPosition;}
  drawOne(){if(this.deckRemaining()<=0)return null;return this.state.deck[this.state.deckPosition++];}
  addMana(cardId,source='draw'){const d=getManaDef(cardId);const card={uid:this.uid++,cardId,...d,source};this.state.hand.push(card);return card;}
  initialDraw(count=WEB_CONFIG.ui.initialFreeDraw){
    const s=this.state;if(s.status!=='playing')return {ok:false,reason:'ended'};
    const n=Math.min(count,this.deckRemaining()),gained=[];
    for(let i=0;i<n;i++)gained.push(this.addMana(this.drawOne(),'initial'));
    const blast=this.resolveBlasts();
    return {ok:true,type:'initial',gained,blast,ended:s.status!=='playing'};
  }

  drawMana(count){
    const s=this.state; if(s.status!=='playing')return {ok:false,reason:'ended'};
    if(s.selectedRequestUid)return {ok:false,reason:'deliveryMode'};
    if(count<1||count>s.rules.drawMax||count>this.deckRemaining())return {ok:false,reason:'drawCount'};
    const gained=[];for(let i=0;i<count;i++)gained.push(this.addMana(this.drawOne(),'draw'));
    const blast=this.resolveBlasts();
    return this.finishAction({type:'draw',gained,blast});
  }

  refillPublicSet(setId){
    const s=this.state,set=s.publicSets[setId];set.length=0;
    const n=Math.min(s.rules.publicSetCardCount,this.deckRemaining());
    for(let i=0;i<n;i++)set.push(this.drawOne());
    return n;
  }
  takePublicSet(setId){
    const s=this.state;if(s.status!=='playing')return {ok:false,reason:'ended'};
    if(s.selectedRequestUid)return {ok:false,reason:'deliveryMode'};
    const set=s.publicSets[setId];if(!set||!set.length)return {ok:false,reason:'emptySet'};
    const gained=set.map(id=>this.addMana(id,'public'));
    set.length=0;
    const blast=this.resolveBlasts();
    const remainingBeforeRefill=this.deckRemaining();
    const filled=this.refillPublicSet(setId);
    if(remainingBeforeRefill<s.rules.publicSetCardCount){
      this.endGame('deck');
      return {ok:true,type:'public',gained,blast,filled,ended:true};
    }
    return this.finishAction({type:'public',gained,blast,filled});
  }

  totals(){
    const out=Array(6).fill(0);for(const c of this.state.hand){const group=c.wild?5:c.colorId;out[group]+=c.value;}return out;
  }
  resolveBlasts(){
    const s=this.state,totals=this.totals(),groups=[];
    for(let g=0;g<6;g++)if(totals[g]>=s.rules.blastThreshold)groups.push(g);
    if(!groups.length)return {occurred:false,groups:[],lost:[]};
    const lost=s.hand.filter(c=>groups.includes(c.wild?5:c.colorId));
    const lostSet=new Set(lost.map(c=>c.uid));s.hand=s.hand.filter(c=>!lostSet.has(c.uid));
    s.selectedManaUids=s.selectedManaUids.filter(uid=>!lostSet.has(uid));
    s.life-=s.rules.blastLifeLoss;s.lifeLost+=s.rules.blastLifeLoss;s.blastCount++;
    s.lastEvent={type:'blast',groups,lostCount:lost.length};
    return {occurred:true,groups,lost};
  }

  resetColorBag(){
    const s=this.state,n=s.rules.normalColorCount,per=WEB_CONFIG.requirementColorBag.perActiveColor;
    s.colorBag.remaining=[0,0,0,0,0];for(let i=0;i<n;i++)s.colorBag.remaining[i]=per;
    s.colorBag.total=per*n;
  }
  bagDraw(usedSet,exclude=-1){
    const s=this.state;
    const candidates=()=>{const out=[];for(let c=0;c<s.rules.normalColorCount;c++)if(!usedSet.has(c)&&c!==exclude&&s.colorBag.remaining[c]>0)out.push(c);return out;};
    if(s.colorBag.total<=0)this.resetColorBag();
    let eligible=candidates();
    if(!eligible.length){this.resetColorBag();eligible=candidates();}
    if(!eligible.length)return -1;
    const weight=eligible.reduce((sum,c)=>sum+s.colorBag.remaining[c],0);let n=rint(1,weight),chosen=eligible[0];
    for(const c of eligible){if(n<=s.colorBag.remaining[c]){chosen=c;break;}n-=s.colorBag.remaining[c];}
    s.colorBag.remaining[chosen]--;s.colorBag.total--;
    return chosen;
  }

  chooseMaster(category){
    const s=this.state;let pool=REQUESTS.filter(q=>q.category===category);
    const last=s.requests.at(-1)?.masterId;
    if(pool.length>1&&last!=null&&REQUESTS[last]?.category===category)pool=pool.filter(q=>q.id!==last);
    return pool[rint(0,pool.length-1)];
  }
  generateRequirements(master){
    const s=this.state,r=s.rules,reqs=[];
    if(r.adlib){for(const base of master.base){if(base<=0)break;reqs.push({color:QUESTION_REQUIREMENT_COLOR_ID,amount:base});}return reqs;}
    let used=new Set(),forceQuestion=false,questionBonusUsed=false;
    let firstExclude=master.category<=2?s.lastPrimaryColor:-1;let primary=-1;
    for(let slot=0;slot<3;slot++){
      const base=master.base[slot];if(base<=0)break;
      let color,amount=base;
      if(forceQuestion){
        color=QUESTION_REQUIREMENT_COLOR_ID;
        if(!questionBonusUsed){amount=Math.min(r.questionAmountMax,amount+r.questionAmountBonus);questionBonusUsed=true;}
      }else{
        const threshold=WEB_CONFIG.questionThresholds[slot];
        const makeQ=rint(1,r.questionRandomBase)<=threshold;
        if(makeQ){color=QUESTION_REQUIREMENT_COLOR_ID;forceQuestion=true;if(!questionBonusUsed){amount=Math.min(r.questionAmountMax,amount+r.questionAmountBonus);questionBonusUsed=true;}}
        else{
          color=this.bagDraw(used,slot===0?firstExclude:-1);if(color<0){const eligible=[];for(let c=0;c<r.normalColorCount;c++)if(!used.has(c)&&(slot!==0||c!==firstExclude))eligible.push(c);color=eligible[rint(0,eligible.length-1)];}
          used.add(color);if(slot===0)primary=color;
        }
      }
      reqs.push({color,amount});firstExclude=-1;
    }
    if(master.category<=2&&primary>=0)s.lastPrimaryColor=primary;
    return reqs;
  }
  addRequestByCategory(category,progression=true){
    const s=this.state;if(s.requests.length>=s.rules.requestCapacity)return null;
    const master=this.chooseMaster(category),cat=REQUEST_CATEGORIES[category];
    const turns=s.rules.adlib&&category<=1?Math.max(1,master.turns-1):master.turns;
    const req={uid:this.uid++,instanceNo:s.nextRequestNo++,masterId:master.id,category,score:cat.score,turns,requirements:this.generateRequirements(master),createdTurn:s.turn};
    s.requests.push(req);return req;
  }
  progressionCategory(number){
    const sp=this.state.rules.specialPositions;if(sp.includes(number))return 2;return number%2===1?0:1;
  }
  replenishRequests(){
    const s=this.state;while(s.requests.length<s.rules.minPublicRequests&&s.requests.length<s.rules.requestCapacity){s.progressionAdded++;this.addRequestByCategory(this.progressionCategory(s.progressionAdded),true);}
  }
  spawnPendingCalamities(){
    const s=this.state;const reached=Math.floor(s.turn/s.rules.calamityInterval);let pending=reached-s.calamitySpawnedCycles;
    while(pending>0&&s.requests.length<s.rules.requestCapacity){this.addRequestByCategory(3,false);s.calamitySpawnedCycles++;pending--;}
  }

  toggleRequest(uid){
    const s=this.state;if(s.status!=='playing')return;
    if(s.selectedRequestUid===uid){this.cancelSelection();return;}
    s.selectedRequestUid=uid;s.selectedManaUids=[];
  }
  toggleMana(uid){
    const s=this.state;if(!s.selectedRequestUid)return {ok:false,reason:'selectQuest'};
    const i=s.selectedManaUids.indexOf(uid);if(i>=0)s.selectedManaUids.splice(i,1);else s.selectedManaUids.push(uid);return {ok:true};
  }
  cancelSelection(){this.state.selectedRequestUid=null;this.state.selectedManaUids=[];}
  selectedCards(excludeUid=null){const ids=new Set(this.state.selectedManaUids.filter(x=>x!==excludeUid));return this.state.hand.filter(c=>ids.has(c.uid));}
  selectedRequest(){return this.state.requests.find(q=>q.uid===this.state.selectedRequestUid)||null;}

  findAllocation(request,cards,{requireExact=false}={}){
    if(!request||!cards.length)return null;
    const reqs=request.requirements;
    const normalColors=new Set(reqs.filter(r=>r.color!==QUESTION_REQUIREMENT_COLOR_ID).map(r=>r.color));
    const qIdx=reqs.map((r,i)=>r.color===QUESTION_REQUIREMENT_COLOR_ID?i:-1).filter(i=>i>=0);
    const available=[];for(let c=0;c<this.state.rules.normalColorCount;c++)if(!normalColors.has(c))available.push(c);
    const mappings=[];
    const rec=(pos,arr,used)=>{if(pos===qIdx.length){mappings.push(arr.slice());return;}for(const c of available)if(!used.has(c)){used.add(c);arr.push(c);rec(pos+1,arr,used);arr.pop();used.delete(c);}};
    rec(0,[],new Set());if(!qIdx.length)mappings.push([]);
    for(const map of mappings){
      const resolved=reqs.map(r=>r.color);qIdx.forEach((idx,k)=>resolved[idx]=map[k]);
      const totals=Array(reqs.length).fill(0),wild=[];let invalid=false;
      for(const card of cards){
        if(card.wild){wild.push(card);continue;}
        const idx=resolved.indexOf(card.colorId);if(idx<0){invalid=true;break;}totals[idx]+=card.value;
      }
      if(invalid)continue;
      const dfs=(wi)=>{
        if(wi===wild.length){const good=totals.every((v,i)=>requireExact?v===reqs[i].amount:v>=reqs[i].amount);return good?totals.slice():null;}
        for(let i=0;i<reqs.length;i++){totals[i]+=wild[wi].value;const got=dfs(wi+1);if(got)return got;totals[i]-=wild[wi].value;}return null;
      };
      const found=dfs(0);if(found)return {resolvedColors:resolved,totals:found};
    }
    return null;
  }
  validateDelivery(){
    const request=this.selectedRequest(),cards=this.selectedCards();if(!request)return {ok:false,reason:'selectQuest'};if(!cards.length)return {ok:false,reason:'selectMana'};
    const allocation=this.findAllocation(request,cards);if(!allocation)return {ok:false,reason:'requirements'};
    const redundant=[];for(const c of cards)if(this.findAllocation(request,this.selectedCards(c.uid)))redundant.push(c.uid);
    if(redundant.length)return {ok:false,reason:'redundant',redundant};
    const perfect=!!this.findAllocation(request,cards,{requireExact:true});
    return {ok:true,allocation,perfect};
  }
  deliver(){
    const s=this.state,v=this.validateDelivery();if(!v.ok)return v;
    const request=this.selectedRequest(),cards=this.selectedCards(),used=new Set(cards.map(c=>c.uid));
    s.hand=s.hand.filter(c=>!used.has(c.uid));
    let gain=request.score+(v.perfect?1:0);s.score+=gain;s.completed++;if(v.perfect)s.perfectCount++;
    const idx=s.requests.findIndex(q=>q.uid===request.uid);s.requests.splice(idx,1);this.cancelSelection();
    return this.finishAction({type:'deliver',gain,perfect:v.perfect,request});
  }

  finishAction(result){
    const s=this.state;s.pendingEffects=[];
    if(s.status!=='playing')return {...result,ok:true,ended:true,effects:[]};
    this.endTurn();const effects=s.pendingEffects.splice(0);
    return {...result,ok:true,ended:s.status!=='playing',effects};
  }
  endTurn(){
    const s=this.state;if(s.status!=='playing')return;
    // Every completed action advances deadlines by one.
    for(const q of s.requests)q.turns=Math.max(0,q.turns-1);
    for(let i=s.requests.length-1;i>=0;i--)if(s.requests[i].turns<=0)this.failRequest(i);
    if(s.life<=0){this.endGame('life');return;}
    this.replenishRequests();this.spawnPendingCalamities();s.turn++;
  }
  failRequest(index){
    const s=this.state,q=s.requests[index],m=REQUESTS[q.masterId],cat=REQUEST_CATEGORIES[q.category];
    s.failed++;s.score+=cat.failScore;
    if(q.category===3)this.applyCalamity(m.penalty,index);
    s.requests.splice(index,1);
  }
  applyCalamity(penalty,selfIndex){
    const s=this.state;
    if(penalty==='life'){s.life-=WEB_CONFIG.calamity.badOmenLifeLoss;s.lifeLost+=WEB_CONFIG.calamity.badOmenLifeLoss;s.lastEvent={type:'calamity',kind:'life'};return;}
    if(penalty==='poisonFog'){
      let changed=0;for(let i=0;i<s.requests.length;i++){if(i===selfIndex)continue;const q=s.requests[i];if(!q)continue;
        if(q.requirements.length<2)q.requirements.push({color:QUESTION_REQUIREMENT_COLOR_ID,amount:WEB_CONFIG.calamity.poisonFogSecondSlotAdd});else{q.requirements[1].amount=Math.min(s.rules.questionAmountMax,q.requirements[1].amount+WEB_CONFIG.calamity.poisonFogSecondSlotAdd);}changed++;}
      s.lastEvent={type:'calamity',kind:'poisonFog',changed};return;
    }
    if(penalty==='overdrive'){
      const n=Math.min(WEB_CONFIG.calamity.overdriveDrawCount,this.deckRemaining()),gained=[];for(let i=0;i<n;i++)gained.push(this.addMana(this.drawOne(),'overdrive'));
      const blast=this.resolveBlasts();s.lastEvent={type:'calamity',kind:'overdrive',gained,blast};s.pendingEffects.push({type:'manaGain',source:'deck',gained,blast});
      if(n<WEB_CONFIG.calamity.overdriveDrawCount)this.endGame(s.life<=0?'life':'deck');
    }
  }
  endGame(reason){
    const s=this.state;if(s.status==='ended')return;
    s.status='ended';s.endReason=reason;s.finalScore=s.score;
    const list=WEB_CONFIG.resultRatings[s.difficultyKey];s.rating=list?list.find(x=>s.finalScore>=x.min).label:'RESULT';
  }
  clearRate(){const s=this.state;return Math.min(100,Math.floor((s.deckPosition/s.deck.length)*100));}
  remainingDeckCounts(){const out=new Map();for(let i=this.state.deckPosition;i<this.state.deck.length;i++){const id=this.state.deck[i];out.set(id,(out.get(id)||0)+1);}return out;}
}

/* ===== ui.js ===== */

class UI{
  constructor(game,sound){
    this.game=game;this.sound=sound;this.lastMode='beginner';this.redundant=[];this.pendingManaUids=new Set();this.pendingPublicSetId=null;this.animating=false;this.actions=null;this.visualHandOverride=null;this.blastVisualGroups=new Set();
    this.el={
      start:document.querySelector('#start-screen'),game:document.querySelector('#game-screen'),best:document.querySelector('#best-summary'),
      sound:document.querySelector('#sound-button'),rule:document.querySelector('#rule-button'),life:document.querySelector('#life-value'),stage:document.querySelector('#stage-value'),score:document.querySelector('#score-value'),
      quests:document.querySelector('#quest-grid'),deck:document.querySelector('#deck-button'),deckCount:document.querySelector('#deck-count'),sets:document.querySelector('#public-sets'),hand:document.querySelector('#mana-hand'),
      count:document.querySelector('#count-button'),message:document.querySelector('#message'),drawZone:document.querySelector('.draw-zone'),
      drawDialog:document.querySelector('#draw-dialog'),drawButtons:document.querySelector('#draw-buttons'),ruleDialog:document.querySelector('#rule-dialog'),countDialog:document.querySelector('#count-dialog'),countBody:document.querySelector('#count-body'),
      resultDialog:document.querySelector('#result-dialog'),resultRating:document.querySelector('#result-rating'),resultBody:document.querySelector('#result-body'),retry:document.querySelector('#retry-button'),menu:document.querySelector('#menu-button'),
      tutorialDialog:document.querySelector('#tutorial-dialog'),tutorialTitle:document.querySelector('#tutorial-title'),tutorialText:document.querySelector('#tutorial-text'),tutorialNext:document.querySelector('#tutorial-next'),
      effect:document.querySelector('#effect-layer')
    };
  }
  bind(actions){
    this.actions=actions;
    document.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>actions.start(b.dataset.start)));
    this.el.sound.addEventListener('click',()=>{this.sound.toggle();this.el.sound.textContent=this.sound.enabled?'🔊':'🔇';this.sound.beep('click');});
    this.el.rule.addEventListener('click',()=>this.el.ruleDialog.showModal());
    this.el.deck.addEventListener('click',()=>actions.openDraw());
    this.el.count.addEventListener('click',()=>actions.showCount());
    this.el.retry.addEventListener('click',()=>actions.start(this.lastMode));
    this.el.menu.addEventListener('click',()=>actions.menu());
    this.el.tutorialNext.addEventListener('click',()=>actions.tutorialNext());
    document.addEventListener('contextmenu',e=>e.preventDefault());
  }
  showGame(mode){this.lastMode=mode;this.el.start.classList.add('hidden');this.el.game.classList.remove('hidden');}
  showMenu(){this.el.game.classList.add('hidden');this.el.start.classList.remove('hidden');if(this.el.resultDialog.open)this.el.resultDialog.close();}
  currentValidation(){
    const s=this.game.state;if(!s?.selectedRequestUid){this.redundant=[];return {ok:false,reason:'selectQuest'};}
    const v=this.game.validateDelivery();this.redundant=v.reason==='redundant'?(v.redundant||[]):[];return v;
  }
  render(){
    const s=this.game.state;if(!s)return;const validation=this.currentValidation();
    this.el.life.textContent='◆'.repeat(Math.max(0,s.life))||'—';this.el.stage.textContent=s.tutorial?'チュートリアル':s.rules.label;this.el.score.textContent=s.score;
    const deliveryMode=!!s.selectedRequestUid;
    this.el.deckCount.textContent=this.game.deckRemaining();this.el.deck.disabled=this.animating||deliveryMode||s.status!=='playing'||this.game.deckRemaining()<=0;this.el.count.disabled=this.animating||deliveryMode||s.status!=='playing';
    this.renderQuests(validation);this.renderSets();this.renderQuestGuide();this.renderHand();this.el.message.textContent=s.message||'';
  }
  renderQuests(validation){
    const s=this.game.state;this.el.quests.innerHTML='';
    for(const q of s.requests){
      const m=REQUESTS[q.masterId],type=q.category===2?'special':q.category===3?'disaster':'normal',selected=s.selectedRequestUid===q.uid,expiring=q.turns<=WEB_CONFIG.ui.expiringTurns;
      const slot=document.createElement('article');slot.className=`quest-slot ${type}${selected?' selected':''}${expiring?' expiring':''}`;slot.dataset.uid=q.uid;
      const card=document.createElement('button');card.type='button';card.className='quest-card';card.dataset.uid=q.uid;card.setAttribute('aria-label',`${m.name}、${q.score}点、あと${q.turns}ターン`);
      card.innerHTML=`<div class="quest-art"><img src="${questImage(m,'normal')}" alt="" data-quest-art><span class="quest-art-fallback"><b>${m.icon}</b></span></div><span class="quest-score">${q.score}</span>${selected?'<span class="quest-selected-badge">選択中</span>':''}`;
      const img=card.querySelector('[data-quest-art]');
      const syncCardRatio=()=>{if(img.naturalWidth&&img.naturalHeight)card.style.aspectRatio=`${img.naturalWidth} / ${img.naturalHeight}`;};
      img.addEventListener('load',syncCardRatio);if(img.complete)syncCardRatio();
      img.addEventListener('error',()=>{img.style.display='none';const fallback=card.querySelector('.quest-art-fallback');if(fallback)fallback.style.display='grid';});
      card.addEventListener('click',()=>{if(this.animating)return;selected?this.game.cancelSelection():this.game.toggleRequest(q.uid);s.message=this.game.state.selectedRequestUid?'マナを選んで納品してください。':'';this.redundant=[];this.sound.beep('click');this.render();});
      const meta=document.createElement('div');meta.className='quest-meta';
      const req=document.createElement('div');req.className='quest-reqs';req.innerHTML=q.requirements.map((r,i)=>{const c=r.color===5?{key:'question',name:'？'}:COLORS[r.color];return `<span class="req-text ${c.key}">${c.name}${r.amount}</span>${i<q.requirements.length-1?'<span class="req-sep">/</span>':''}`;}).join('');
      const turn=document.createElement('div');turn.className='quest-turn';turn.innerHTML=`あと <strong>${q.turns}</strong> ターン`;
      meta.append(req,turn);
      const controls=document.createElement('div');controls.className=`quest-controls${selected?'':' empty'}`;
      if(selected){
        const cancel=document.createElement('button');cancel.type='button';cancel.className='quest-cancel secondary';cancel.textContent='取消';cancel.disabled=this.animating;cancel.addEventListener('click',()=>this.actions?.cancel());controls.appendChild(cancel);
        if(validation.ok||validation.reason==='redundant'){
          const deliver=document.createElement('button');deliver.type='button';deliver.className='quest-deliver primary';deliver.textContent='納品';deliver.disabled=this.animating||!validation.ok;deliver.addEventListener('click',()=>this.actions?.deliver());controls.appendChild(deliver);
        }
      }
      meta.appendChild(controls);
      slot.append(card,meta);this.el.quests.appendChild(slot);
    }
  }
  renderSets(){
    const s=this.game.state;this.el.sets.innerHTML='';
    s.publicSets.forEach((set,i)=>{
      const refilling=this.pendingPublicSetId===i;
      const b=document.createElement('button');b.className=`public-set${refilling?' refilling':''}`;b.dataset.setId=i;b.disabled=this.animating||!!s.selectedRequestUid||s.status!=='playing'||!set.length;
      b.setAttribute('aria-label',`公開セット${i+1}`);
      b.innerHTML=refilling?'<span class="public-set-wait" aria-hidden="true"></span>':set.map((id,j)=>this.miniMana(id,j)).join('');
      b.addEventListener('click',()=>{
        if(this.animating)return;
        const sourceRects=[...b.querySelectorAll('.mini-mana')].map(x=>this.rectData(x.getBoundingClientRect()));
        this.pendingPublicSetId=i;this.sound.beep('draw');const r=this.game.takePublicSet(i);r.sourceRects=sourceRects;r.source='public';r.publicSetId=i;this.afterAction(r);
      });
      this.el.sets.appendChild(b);
    });
  }
  miniMana(id,index=0){const d=getManaDef(id);return `<span class="mini-mana ${d.key}" data-set-card="${index}"><span>${d.wild?'★':d.value}</span><small>${d.name}</small></span>`;}
  questGuideData(request){
    if(!request)return null;const master=REQUESTS[request.masterId];
    if(request.category===2)return {kind:'特別',main:'難易度は高いが高得点',sub:'失敗ペナルティなし'};
    if(request.category===3){
      const effect=master.penalty==='overdrive'?'失敗時：山札から5枚ドロー':master.penalty==='life'?'失敗時：ライフ -1':master.penalty==='poisonFog'?'失敗時：他のクエストの2色目要求 +2':'失敗時：災い効果';
      return {kind:'災い',main:effect,sub:'失敗すると -1点'};
    }
    return {kind:'通常',main:'達成時：左上の得点を獲得',sub:'失敗すると -1点'};
  }
  hideQuestGuide(){this.el.drawZone?.querySelector('.quest-guide')?.remove();}
  renderQuestGuide(){
    if(!this.el.drawZone)return;
    const request=this.game.selectedRequest(),existing=this.el.drawZone.querySelector('.quest-guide');
    if(!request){existing?.remove();return;}
    const data=this.questGuideData(request),uid=String(request.uid);
    if(existing?.dataset.uid===uid){
      const kind=existing.querySelector('.quest-guide-kind'),main=existing.querySelector('.quest-guide-main'),sub=existing.querySelector('.quest-guide-sub');
      if(kind&&kind.textContent!==data.kind)kind.textContent=data.kind;
      if(main&&main.textContent!==data.main)main.textContent=data.main;
      if(sub&&sub.textContent!==data.sub)sub.textContent=data.sub;
      return;
    }
    existing?.remove();
    const guide=document.createElement('div');guide.className='quest-guide';guide.dataset.uid=uid;guide.setAttribute('role','note');guide.setAttribute('aria-label',`${data.kind}クエストの説明`);guide.innerHTML=`<strong class="quest-guide-kind">${data.kind}</strong><span class="quest-guide-main">${data.main}</span><span class="quest-guide-sub">${data.sub}</span>`;this.el.drawZone.appendChild(guide);
  }
  renderHand(){
    const s=this.game.state,hand=this.visualHandOverride||s.hand,totals=Array(6).fill(0),selected=new Set(s.selectedManaUids);for(const c of hand)totals[c.wild?5:c.colorId]+=c.value;this.el.hand.innerHTML='';
    const groups=[...Array(s.rules.normalColorCount).keys(),5];
    for(const group of groups){
      const color=COLORS[group],cards=hand.filter(c=>(c.wild?5:c.colorId)===group);
      const row=document.createElement('div');row.className=`mana-row ${color.key}${totals[group]>=s.rules.blastThreshold-1?' danger':''}${this.blastVisualGroups.has(group)?' blast-pending':''}`;row.dataset.manaGroup=group;row.setAttribute('aria-label',`${color.name}マナ ${totals[group]}/${s.rules.blastThreshold-1}`);
      const total=document.createElement('div');total.className='mana-total-inline';total.textContent=`${totals[group]}/${s.rules.blastThreshold-1}`;
      const stack=document.createElement('div');stack.className='mana-row-stack';
      cards.forEach((c,i)=>{
        const b=document.createElement('button');b.className=`mana-card ${c.key}${selected.has(c.uid)?' selected':''}${this.redundant.includes(c.uid)?' redundant':''}${this.pendingManaUids.has(c.uid)?' pending-gain':''}`;
        b.dataset.manaUid=c.uid;b.style.zIndex=String(cards.length-i);b.setAttribute('aria-label',`${c.name}${c.value}`);
        b.innerHTML=`<span class="mana-value">${c.wild?'★':c.value}</span>`;
        b.addEventListener('click',()=>{if(this.animating)return;const r=this.game.toggleMana(c.uid);if(!r?.ok){s.message='先にクエストを選んでください。';this.sound.beep('error');}else{s.message='';this.sound.beep('click');}this.render();});
        stack.appendChild(b);
      });
      row.append(total,stack);this.el.hand.appendChild(row);
    }
  }
  rectData(r){return {left:r.left,top:r.top,width:r.width,height:r.height,right:r.right,bottom:r.bottom};}
  setAnimating(on){this.animating=on;this.el.game.classList.toggle('is-animating',on);}
  manaTargetRect(card){
    const el=this.el.hand.querySelector(`[data-mana-uid="${card.uid}"]`);if(el)return this.rectData(el.getBoundingClientRect());
    const g=card.wild?5:card.colorId,row=this.el.hand.querySelector(`[data-mana-group="${g}"]`);if(row){const r=row.getBoundingClientRect();return {left:r.left+48,top:r.top+3,width:52,height:52,right:r.left+100,bottom:r.top+55};}
    return this.rectData(this.el.hand.getBoundingClientRect());
  }
  makeFlyingMana(card,sourceRect){
    const el=document.createElement('div');el.className=`flying-mana ${card.key}`;el.style.left=`${sourceRect.left}px`;el.style.top=`${sourceRect.top}px`;el.style.width=`${Math.max(34,Math.min(54,sourceRect.width||48))}px`;el.style.height=el.style.width;
    el.innerHTML=`<div class="flying-inner"><div class="flying-back"></div><div class="flying-front"><span>${card.wild?'★':card.value}</span><small>${card.name}</small></div></div>`;document.body.appendChild(el);return el;
  }
  async animateOneMana(card,sourceRect,destRect,{flip=true,duration=WEB_CONFIG.timing.drawSlide}={}){
    const el=this.makeFlyingMana(card,sourceRect),inner=el.querySelector('.flying-inner');
    const sx=sourceRect.left,sy=sourceRect.top,dx=destRect.left,dy=destRect.top;
    const scale=Math.max(.72,Math.min(1.15,(destRect.width||48)/(sourceRect.width||48)));
    const total=flip?WEB_CONFIG.timing.drawFlipHalf*2+duration:duration;
    const move=el.animate([{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${(dx-sx)*.18}px,${(dy-sy)*.18}px) scale(1.08)`,offset:flip?.48:.18},{transform:`translate(${dx-sx}px,${dy-sy}px) scale(${scale})`,offset:1}],{duration:total,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'});
    if(flip)inner.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(0deg)',offset:.18},{transform:'rotateY(180deg)',offset:.58},{transform:'rotateY(180deg)'}],{duration:total,easing:'ease-in-out',fill:'forwards'});else inner.classList.add('face-up');
    await move.finished.catch(()=>{});el.remove();
  }
  async animateManaGain(result,{initial=false}={}){
    const gained=result?.gained||[];if(!gained.length)return;
    const blast=result.blast?.occurred?result.blast:null,gainedUids=new Set(gained.map(c=>c.uid));
    const start=[...this.game.state.hand.filter(c=>!gainedUids.has(c.uid)),...(blast?.lost||[]).filter(c=>!gainedUids.has(c.uid))];
    const seen=new Set(),visual=[];for(const c of start)if(!seen.has(c.uid)){seen.add(c.uid);visual.push(c);}
    this.visualHandOverride=visual;this.blastVisualGroups.clear();this.setAnimating(true);this.render();
    const deckVisual=this.el.deck.querySelector('.deck-stack')||this.el.deck;const deckRect=this.rectData(deckVisual.getBoundingClientRect());
    for(let i=0;i<gained.length;i++){
      const card=gained[i],source=result.source==='public'&&result.sourceRects?.[i]?result.sourceRects[i]:deckRect,dest=this.manaTargetRect(card);
      await this.animateOneMana(card,source,dest,{flip:result.source!=='public',duration:result.source==='public'?WEB_CONFIG.timing.publicSlide:WEB_CONFIG.timing.drawSlide});
      if(!seen.has(card.uid)){seen.add(card.uid);visual.push(card);}this.visualHandOverride=visual.slice();this.renderHand();this.sound.beep(result.source==='public'?'click':'draw');
      if(WEB_CONFIG.timing.drawStagger)await new Promise(r=>setTimeout(r,WEB_CONFIG.timing.drawStagger));
    }
    if(blast){
      this.blastVisualGroups=new Set(blast.groups);this.renderHand();this.sound.beep('blast');
      await new Promise(r=>setTimeout(r,WEB_CONFIG.timing.blastFlash));
    }
    this.visualHandOverride=null;this.blastVisualGroups.clear();this.pendingManaUids.clear();this.pendingPublicSetId=null;this.setAnimating(false);this.render();
  }
  openDraw(){
    if(this.animating||this.game.state?.selectedRequestUid)return;const s=this.game.state,max=Math.min(s.rules.drawMax,this.game.deckRemaining());this.el.drawButtons.innerHTML='';
    for(let n=1;n<=max;n++){const b=document.createElement('button');b.type='button';b.className='primary';b.textContent=`${n}枚`;b.addEventListener('click',()=>{this.el.drawDialog.close();const r=this.game.drawMana(n);r.source='deck';this.afterAction(r);});this.el.drawButtons.appendChild(b);}if(max>0)this.el.drawDialog.showModal();
  }
  async animateQuestComplete(request,perfect=false){
    if(!request||!this.el.effect)return;
    const master=REQUESTS[request.masterId],type=request.category===2?'special':request.category===3?'disaster':'normal';
    const questTurn=perfect?this.el.quests.querySelector(`[data-uid="${request.uid}"] .quest-turn`):null;
    const turnRect=questTurn?.getBoundingClientRect(),layerRect=this.el.effect.getBoundingClientRect();
    const wrap=document.createElement('div');wrap.className='quest-complete-fx';
    const card=document.createElement('div');card.className=`quest-complete-card ${type}`;
    const img=document.createElement('img');img.src=questImage(master,'complete');img.alt='';
    const fallback=document.createElement('div');fallback.className='quest-fx-fallback';fallback.textContent=master.icon;
    img.addEventListener('error',()=>{img.style.display='none';fallback.style.display='grid';});
    const score=document.createElement('span');score.className='quest-score';score.textContent=request.score;
    card.append(img,fallback,score);wrap.appendChild(card);
    let perfectLabel=null;
    if(perfect){
      const fx=document.createElement('div');fx.className='perfect-fx';
      for(let i=0;i<16;i++){const p=document.createElement('i');p.className='perfect-particle';p.style.setProperty('--angle',`${i*22.5}deg`);p.style.setProperty('--distance',`${150+(i%4)*22}px`);p.style.setProperty('--delay',`${(i%5)*24}ms`);fx.appendChild(p);}wrap.appendChild(fx);
      perfectLabel=document.createElement('div');perfectLabel.className='perfect-label';perfectLabel.textContent='PERFECT!';
      if(turnRect){perfectLabel.style.left=`${turnRect.left+turnRect.width/2-layerRect.left}px`;perfectLabel.style.top=`${turnRect.bottom-layerRect.top+3}px`;}
      else{perfectLabel.classList.add('perfect-label-fallback');}
    }
    this.el.effect.appendChild(wrap);if(perfectLabel)this.el.effect.appendChild(perfectLabel);
    await new Promise(resolve=>setTimeout(resolve,WEB_CONFIG.timing.questComplete));
    wrap.remove();perfectLabel?.remove();
  }
  async afterAction(result){
    const s=this.game.state;if(!result?.ok){this.pendingPublicSetId=null;s.message=this.reasonText(result?.reason);this.sound.beep('error');this.render();return;}
    if(result.type==='deliver'){
      this.hideQuestGuide();
      s.message=`${result.gain}点獲得${result.perfect?' PERFECT!':''}`;this.sound.beep('complete');
      this.setAnimating(true);
      await this.animateQuestComplete(result.request,result.perfect);
      this.setAnimating(false);
    }
    if(result.gained?.length)await this.animateManaGain(result);
    for(const fx of result.effects||[]){if(fx.type==='manaGain'&&fx.gained?.length)await this.animateManaGain({...fx,source:'deck'});}
    if(result.blast?.occurred){s.message=`BLAST! ${result.blast.groups.map(g=>COLORS[g].name).join('・')}のマナを失いました。`;}
    else if(result.type!=='deliver')s.message='ターンを進めました。';
    this.redundant=[];this.pendingPublicSetId=null;this.render();
    if(s.status==='ended')setTimeout(()=>this.showResult(),180);
    this.advanceTutorialAfterAction(result);
  }
  reasonText(r){return ({selectQuest:'先にクエストを選んでください。',selectMana:'納品するマナを選んでください。',requirements:'要求を満たしていません。',redundant:'余剰なカードが含まれています。',drawCount:'その枚数は引けません。',emptySet:'この公開セットは空です。',deliveryMode:'納品選択中はカードを引けません。'})[r]||'その操作はできません。';}
  showCount(){
    const counts=this.game.remainingDeckCounts(),remaining=this.game.deckRemaining();this.el.countBody.innerHTML='';
    if(!counts.size){this.el.countBody.innerHTML='<div class="count-empty">山札は空です。</div>';this.el.countDialog.showModal();return;}
    const summary=document.createElement('div');summary.className='count-summary';summary.innerHTML=`残り <strong>${remaining}</strong> 枚`;this.el.countBody.appendChild(summary);
    const table=document.createElement('div');table.className='count-table';table.setAttribute('role','table');table.setAttribute('aria-label','山札の属性・マナ値別残り枚数');
    const head=document.createElement('div');head.className='count-row count-head';head.innerHTML='<span>属性</span><strong>1</strong><strong>2</strong><strong>3</strong>';table.appendChild(head);
    const groups=[...Array(this.game.state.rules.normalColorCount).keys(),5];
    for(const group of groups){
      const color=COLORS[group],row=document.createElement('div');row.className='count-row';
      const label=document.createElement('span');label.className='count-color';label.innerHTML=`<i class="count-dot ${color.key}"></i><b>${color.name}</b>`;row.appendChild(label);
      for(let value=1;value<=3;value++){
        const cell=document.createElement('strong');cell.className='count-cell';
        const n=group===5?(value===3?(counts.get(0)||0):null):(counts.get(group*10+value)||0);
        cell.textContent=n===null?'—':String(n);if(n===0)cell.classList.add('zero');row.appendChild(cell);
      }
      table.appendChild(row);
    }
    this.el.countBody.appendChild(table);this.el.countDialog.showModal();
  }
  showResult(){const s=this.game.state;this.el.resultRating.textContent=s.rating;const reason=s.endReason==='life'?'ライフが0になりました':'山札を使い切りました';this.el.resultBody.innerHTML=`<div class="result-row"><span>最終スコア</span><strong>${s.finalScore}</strong></div><div class="result-row"><span>クエスト達成</span><strong>${s.completed}</strong></div><div class="result-row"><span>PERFECT</span><strong>${s.perfectCount}</strong></div><div class="result-row"><span>BLAST</span><strong>${s.blastCount}</strong></div><div class="result-row"><span>終了</span><strong>${reason}</strong></div>`;if(!this.el.resultDialog.open)this.el.resultDialog.showModal();}
  updateBestSummary(best){const b=best.beginner??'—',a=best.advanced??'—';this.el.best.innerHTML=`SELF BEST　初級 <strong>${b}</strong>　/　上級 <strong>${a}</strong>`;}
  showTutorial(title,text){this.el.tutorialTitle.textContent=title;this.el.tutorialText.textContent=text;if(!this.el.tutorialDialog.open)this.el.tutorialDialog.showModal();}
  advanceTutorialAfterAction(result){const s=this.game.state;if(!s.tutorial||s.status==='ended')return;const step=s.tutorialStep;
    if(step===1&&result.type==='draw'){s.tutorialStep=2;setTimeout(()=>this.showTutorial('公開セット','次は公開セットを1組タップしてください。見えている2枚をまとめて入手できます。'),220);}
    else if(step===2&&result.type==='public'){s.tutorialStep=3;setTimeout(()=>this.showTutorial('クエストと納品','クエストをタップすると納品モードになります。要求を満たすマナを選び、「納品」を押してください。\n\n選択をやめたいときは「取消」を使えます。'),220);}
    else if(step===3&&result.type==='deliver'){s.tutorialStep=4;setTimeout(()=>this.showTutorial('BLAST','同じ属性の合計が8以上になるとBLASTし、その属性のマナをすべて失ってライフが1減ります。画面のマナ合計は常に確認できます。'),220);}
  }
}

/* ===== main.js ===== */

class Sound{
  constructor(){this.enabled=true;this.ctx=null;}
  toggle(){this.enabled=!this.enabled;}
  ensure(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;}
  beep(kind='click'){if(!this.enabled)return;const ctx=this.ensure(),o=ctx.createOscillator(),g=ctx.createGain();const map={click:[520,.035,.04],draw:[330,.055,.06],complete:[780,.12,.08],blast:[120,.18,.11],error:[170,.07,.05]};const [f,d,v]=map[kind]||map.click;o.frequency.value=f;o.type=kind==='blast'?'sawtooth':'square';g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+d);}
}

const game=new BlastGame(),sound=new Sound(),ui=new UI(game,sound);
let best=loadBest();
function loadBest(){try{return JSON.parse(localStorage.getItem(WEB_CONFIG.bestStorageKey))||{beginner:null,advanced:null};}catch{return {beginner:null,advanced:null};}}
function saveBest(){try{localStorage.setItem(WEB_CONFIG.bestStorageKey,JSON.stringify(best));}catch{}}
function recordBest(){const s=game.state;if(!s||s.tutorial||s.finalScore==null||s.rules.recordBest===false)return;const k=s.difficultyKey;if(best[k]==null||s.finalScore>best[k]){best[k]=s.finalScore;saveBest();ui.updateBestSummary(best);}}
function monitorEnd(){if(game.state?.status==='ended')recordBest();}
const originalShowResult=ui.showResult.bind(ui);ui.showResult=()=>{monitorEnd();originalShowResult();};

const actions={
  start(mode){if(ui.el.resultDialog.open)ui.el.resultDialog.close();game.newGame(mode);ui.showGame(mode);ui.render();sound.beep('click');if(mode==='tutorial'){game.state.tutorialStep=0;setTimeout(()=>ui.showTutorial('目的','マナを集め、公開されているクエストを達成してスコアを伸ばす一人用ゲームです。\n\nこのWeb版はタップだけで遊べます。'),120);}},
  menu(){ui.showMenu();ui.updateBestSummary(best);},
  openDraw(){ui.openDraw();},
  showCount(){ui.showCount();},
  cancel(){game.cancelSelection();game.state.message='納品選択を取り消しました。';ui.redundant=[];sound.beep('click');ui.render();},
  deliver(){const r=game.deliver();ui.afterAction(r);},
  tutorialNext(){const s=game.state;if(ui.el.tutorialDialog.open)ui.el.tutorialDialog.close();if(!s?.tutorial)return;if(s.tutorialStep===0){s.tutorialStep=1;s.message='山札をタップし、3枚引いてください。';ui.render();}else if(s.tutorialStep===2||s.tutorialStep===3){ui.render();}else if(s.tutorialStep===4){s.tutorialStep=99;s.message='ここからは自由にプレイできます。';ui.render();}}
};
ui.bind(actions);ui.updateBestSummary(best);

window.addEventListener('resize',()=>document.documentElement.style.setProperty('--vh',`${window.innerHeight*.01}px`));

})();
