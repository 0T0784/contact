const $=id=>document.getElementById(id);
function run(){
  const raw=$("u").value.trim(), res=$("res"), out=$("out"), cp=$("copy");
  out.hidden=cp.hidden=true;res.textContent="";res.className="";
  if(!raw)return;
  let u;try{u=new URL(raw)}catch(e){res.className="ng";res.textContent="URLの形になっていません。コピーしたリンクを、そのまま貼ってください。";return}
  const id=(u.pathname.match(/\/forms\/d\/e\/([^/]+)/)||[])[1];
  if(!id){res.className="ng";res.textContent="Googleフォームの事前入力リンク（…/forms/d/e/〜/viewform?…）ではないようです。";return}
  const map={},keys=["name","email","category","message"],unknown=[];
  u.searchParams.forEach((v,k)=>{
    if(!/^entry\.\d+$/.test(k))return;
    const w=v.trim().toLowerCase();
    if(keys.includes(w)&&!map[w])map[w]=k;else unknown.push(`${k}=${v}`);
  });
  const miss=["name","email","message"].filter(k=>!map[k]);
  const msgs=[];
  if(miss.length)msgs.push(`<span class="ng">足りない欄があります：${miss.join("、")}（その質問に、上の指定の文字を入力してやり直してください）</span>`);
  if(!map.category)msgs.push("「種類」の欄は無くてもOKです（その場合は、メッセージの先頭に入ります）。");
  if(unknown.length)msgs.push(`使われなかった入力：${unknown.map(x=>x.replace(/</g,"&lt;")).join("、")}`);
  if(!miss.length)msgs.unshift('<span class="ok">読み取れました。下の文字を config.js の form に貼り付けてください。</span>');
  res.innerHTML=msgs.join("<br>");
  if(miss.length)return;
  const q=s=>JSON.stringify(s);
  out.textContent=`form: {\n  action: ${q(`https://docs.google.com/forms/d/e/${id}/formResponse`)},\n  fields: { name: ${q(map.name)}, email: ${q(map.email)}, category: ${q(map.category||"")}, message: ${q(map.message)} }\n}`;
  out.hidden=cp.hidden=false;
}
$("u").addEventListener("input",run);
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("out").textContent);$("copy").textContent="コピーしました"}catch(e){const r=document.createRange();r.selectNodeContents($("out"));getSelection().removeAllRanges();getSelection().addRange(r)}});
