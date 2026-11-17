/* ★ ここだけ書き換えればOK */
const C = {
  name: "オト",                           // ロゴ画像が無いときにヘッダーに出る文字
  circle: "オトヒバ",
  logo: "images/logo.png",                // ヘッダーのロゴ（TOP・ブログと同じ画像）
  home: "https://0t0784.github.io/home/", // TOPページのURL（ロゴとメニューの行き先）
  menu: [                                  // [名前, 行き先]。「#」で始まるものは TOP の同じ場所へ。行き先が空なら出ない
    ["私について", "https://0t0784.github.io/home/#about"],
    ["作品・活動", "https://0t0784.github.io/home/#works"],
    ["雑記", "https://0t0784.github.io/blog/"],                          // ← ブログのURLを入れると出る（例 "https://0t0784.github.io/ブログのリポジトリ名/"）
    ["リンク", "https://0t0784.github.io/home/#links"],
    ["お問い合わせ", "index.html"]
  ],

  title: "お問い合わせ",
  lead: "ご質問・ご依頼・ご感想などは、こちらのフォームからお送りください。",
  categories: ["ご質問", "お仕事のご依頼", "ご感想", "その他"],   // 空にすると「種類」の欄が出ない
  privacy: "いただいた内容は、ご返信など、お問い合わせへの対応のためだけに使います。",
  notes: [
    "返信までに、数日お時間をいただくことがあります。",
    "内容によっては、お返事できない場合があります。ご了承ください。"
  ],
  thanks: "送信しました。お問い合わせありがとうございます。",

  /* Googleフォームの送信先（setup.html で、ここに貼る文字を作れます） */
  form: {
    action: "",   // 例 "https://docs.google.com/forms/d/e/xxxxxxxx/formResponse"
    fields: { name: "", email: "", category: "", message: "" }   // 例 "entry.123456789"
  }
};
