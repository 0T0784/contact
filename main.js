const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
document.title=`${C.title} | ${C.name}`;
$("ttl").textContent=C.title;
$("lead").textContent=C.lead||"";

// ヘッダー（TOP・ブログと同じ形）
const H=(C.home||"").replace(/#.*$/,"");
const items=(C.menu||[]).map(([t,h])=>!h?null:h[0]==="#"?(H?[t,H+h]:null):[t,h]).filter(Boolean);
$("nav").innerHTML=`<a class="logo" href="${esc(H||"index.html")}" aria-label="${H?"ホームへ":"トップへ"}"><img src="${esc(C.logo)}" alt="" onerror="this.parentNode.textContent=C.name"></a>
  <ul>${items.map(([t,h])=>`<li><a href="${esc(h)}"${h==="index.html"?' class="on"':""}>${esc(t)}</a></li>`).join("")}</ul>`;
$("toHome").href=H||"index.html";
$("foot").innerHTML=`<p>© ${new Date().getFullYear()} ${esc(C.name)} / ${esc(C.circle)}</p>`;
$("notes").innerHTML=(C.notes||[]).map(n=>`<li>${esc(n)}</li>`).join("");
$("agreeTxt").textContent=(C.privacy?C.privacy+" ":"")+"上記に同意して送信します。";

// 種類
if((C.categories||[]).length)$("f-cat").innerHTML=C.categories.map(c=>`<option>${esc(c)}</option>`).join("");
else $("catBox").hidden=true;

// 送信先が未設定のとき
const F=C.form||{}, fields=F.fields||{}, READY=!!(F.action&&fields.name&&fields.email&&fields.message);
$("demo").hidden=READY;

// 文字数
const msg=$("f-msg");msg.addEventListener("input",()=>$("cnt").textContent=[...msg.value].length);

// 入力チェック
const RULES=[
  ["f-name",v=>v.trim()?"":"お名前を入力してください。"],
  ["f-email",v=>!v.trim()?"メールアドレスを入力してください。":/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?"":"メールアドレスの形式が正しくありません。"],
  ["f-msg",v=>v.trim().length<5?"メッセージを5文字以上で入力してください。":""],
  ["f-agree",(v,el)=>el.checked?"":"同意にチェックを入れてください。"]
];
function validate(){
  let first=null;
  RULES.forEach(([id,fn])=>{
    const el=$(id),box=el.closest(".fld"),m=fn(el.value,el);
    box.classList.toggle("bad",!!m);box.querySelector(".err").textContent=m;
    if(m&&!first)first=el;
  });
  if(first)first.focus();
  return !first;
}
RULES.forEach(([id])=>$(id).addEventListener("input",()=>{const b=$(id).closest(".fld");b.classList.remove("bad");b.querySelector(".err").textContent=""}));

// 送信
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const viewUrl=()=>F.action?F.action.replace(/\/formResponse.*$/,"/viewform"):"";
function done(){
  $("form").hidden=true;$("demo").hidden=true;$("thanks").hidden=false;$("tk").textContent=C.thanks;
  $("card").scrollIntoView({behavior:"smooth",block:"center"});
}
$("again").addEventListener("click",e=>{e.preventDefault();$("form").reset();$("cnt").textContent=0;$("form").hidden=false;$("thanks").hidden=true;$("demo").hidden=READY;$("send").disabled=false;$("send").textContent="送信する"});
$("form").addEventListener("submit",async e=>{
  e.preventDefault();
  const g=$("gerr");g.hidden=true;
  if($("f-hp").value){done();return}                    // スパム対策：見えない欄に入力があるときは、送ったふりをして何もしない
  if(!validate())return;
  try{const last=+localStorage.getItem("contact_last")||0;if(Date.now()-last<30000){g.textContent="続けての送信はできません。少し時間をおいてから、もう一度お試しください。";g.hidden=false;return}}catch(_){}
  const btn=$("send");btn.disabled=true;btn.textContent="送信中…";
  const cat=$("catBox").hidden?"":$("f-cat").value;
  let message=msg.value.trim();
  if(cat&&!fields.category)message=`【${cat}】\n`+message;   // Googleフォームに「種類」の欄が無いときは、本文の先頭に入れる
  try{
    if(READY){
      const body=new URLSearchParams();
      body.append(fields.name,$("f-name").value.trim());
      body.append(fields.email,$("f-email").value.trim());
      if(cat&&fields.category)body.append(fields.category,cat);
      body.append(fields.message,message);
      await fetch(F.action,{method:"POST",mode:"no-cors",body});   // 返事の中身は読めない（ブラウザの決まり）ので、通信できたら成功とみなす
    }else await sleep(700);
    try{localStorage.setItem("contact_last",Date.now())}catch(_){}
    done();
  }catch(err){
    g.innerHTML="送信できませんでした。通信を確認して、もう一度お試しください。"+(viewUrl()?`<br>うまくいかないときは、<a href="${esc(viewUrl())}" target="_blank" rel="noopener">こちらのフォーム</a>から直接お送りください。`:"");
    g.hidden=false;btn.disabled=false;btn.textContent="送信する";
  }
});

// 落ち葉・フェードイン
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  const L=$("leaves");
  for(let i=0;i<9;i++){const l=document.createElement("span");l.className="leaf";l.textContent=i%2?"🍂":"🍁";
    l.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*160-80)|0}px;--rot:${(Math.random()*540-270)|0}deg;animation-duration:${14+Math.random()*12}s;animation-delay:${-Math.random()*20}s;font-size:${14+Math.random()*14}px`;
    L.append(l)}
}
(function(){
  const els=[$("ttl"),$("lead"),$("card")];
  document.documentElement.classList.add("js");
  els.forEach((e,i)=>{e.classList.add("rv");e.style.setProperty("--d",(i*.12)+"s")});
  if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in"));return}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1});
  els.forEach(e=>io.observe(e));
})();
