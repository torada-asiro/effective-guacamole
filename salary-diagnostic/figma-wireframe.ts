// 期間工比較LP ワイヤーフレーム生成スクリプト
const page = figma.currentPage
for (const c of page.children) c.remove()

await figma.loadFontAsync({ family: "Inter", style: "Regular" })
await figma.loadFontAsync({ family: "Inter", style: "Bold" })

const W = 390, PAD = 20
let y = 0

function addRect(parent, x, yy, w, h, fill, stroke = null, radius = 0) {
  const r = figma.createRectangle()
  r.x = x; r.y = yy; r.resize(w, h)
  r.fills = [{type: 'SOLID', color: fill}]
  if (stroke) { r.strokes = [{type: 'SOLID', color: stroke}]; r.strokeWeight = 2 }
  if (radius) r.cornerRadius = radius
  parent.appendChild(r)
  return r
}

function addText(parent, str, x, yy, size, bold = false, w = W - PAD*2, color = {r:0,g:0,b:0}) {
  const t = figma.createText()
  t.fontName = { family: "Inter", style: bold ? "Bold" : "Regular" }
  t.characters = str
  t.fontSize = size
  t.x = x; t.y = yy
  t.resize(w, 10)
  t.textAutoResize = "HEIGHT"
  t.fills = [{type: 'SOLID', color: color}]
  parent.appendChild(t)
  return t
}

function addBtn(parent, str, yy, fill = {r:0.2,g:0.7,b:0.3}) {
  addRect(parent, PAD, yy, W-PAD*2, 52, fill, null, 8)
  addText(parent, str, PAD+10, yy+16, 14, true, W-PAD*2-20, {r:1,g:1,b:1})
}

function addImg(parent, x, yy, w, h, label) {
  addRect(parent, x, yy, w, h, {r:0.85,g:0.85,b:0.85}, null, 4)
  addText(parent, label, x+10, yy+h/2-6, 10, false, w-20, {r:0.5,g:0.5,b:0.5})
}

// Main frame
const f = figma.createFrame()
f.name = "期間工比較LP_ワイヤー"
f.resize(W, 4200)
f.fills = [{type:'SOLID', color:{r:1,g:1,b:1}}]
page.appendChild(f)

// ========== S1: FIRST VIEW ==========
addRect(f, 0, 0, W, 320, {r:0.15,g:0.15,b:0.15})
y = 15
addText(f, "PR", PAD, y, 10, false, 30, {r:0.7,g:0.7,b:0.7})
y = 35
addText(f, "【2026最新】\n期間工おすすめ比較ランキング！", PAD, y, 22, true, W-PAD*2, {r:1,g:1,b:1})
y = 110
addText(f, "未経験で年収510万円以上\n入社祝い金総額60万円\nおすすめメーカーを厳選！", PAD, y, 15, false, W-PAD*2, {r:1,g:0.85,b:0.3})
y = 200
addImg(f, PAD, y, W-PAD*2, 100, "HERO IMAGE - 工場作業員")

// ========== S2: BENEFITS ==========
y = 340
addRect(f, 0, y, W, 250, {r:0.97,g:0.97,b:0.97})
y += 20
addText(f, "期間工のメリット", PAD, y, 16, true)
y += 35
const benefits = [
  "月給30万以上・未経験初年度から年収510万以上",
  "入社祝い金や満了金など特別手当がある",
  "家賃や光熱費などの生活費が無料で貯金できる",
  "超大手製造メーカーで正社員登用のケースもあり"
]
for (const b of benefits) {
  addText(f, "✓  " + b, PAD, y, 13, false, W-PAD*2)
  y += 28
}
y += 10
addRect(f, PAD, y, W-PAD*2, 50, {r:1,g:0.97,b:0.85}, null, 4)
addText(f, "8割の人が未経験から挑戦。体力不要の求人もあり。", PAD+10, y+15, 12, false, W-PAD*2-20)

// ========== S3: PROBLEM ==========
y = 620
addText(f, "だけど…", W/2-30, y, 16, true)
y += 35
addRect(f, PAD, y, W-PAD*2, 44, {r:1,g:0.95,b:0.95}, {r:0.85,g:0.15,b:0.15}, 4)
addText(f, "期間工で働く ＝ 稼げる訳ではありません", PAD+15, y+12, 13, true, W-PAD*2-30, {r:0.85,g:0.15,b:0.15})
y += 65
addText(f, "絶対間違えてはいけないのが", W/2-85, y, 13)
y += 22
addText(f, "メーカー選びです。", W/2-70, y, 20, true, 200, {r:0.85,g:0.15,b:0.15})
y += 40
addText(f, "給与などの待遇がメーカーによって全然違います。\nメーカーを適当に選ぶと同じ労働なのに\n稼げる金額や生活の快適さが全然変わります。", PAD, y, 12)
y += 65
addText(f, "5社のメーカーを比較し、高待遇で環境も\n整っている期間工おすすめメーカー\nランキングベスト3をご紹介します。", PAD, y, 13, true)

// ========== S4: COMPARISON TABLE ==========
y = 920
addRect(f, 0, y, W, 330, {r:0.96,g:0.96,b:0.96})
y += 15
addText(f, "期間工の稼げる人気メーカー5社比較", PAD, y, 15, true)
y += 30

const cols = ["メーカー", "年収例", "祝い金", "満了手当", "寮費"]
const colW = [80, 70, 65, 75, 60]
let cx = PAD
for (let i = 0; i < cols.length; i++) {
  addRect(f, cx, y, colW[i], 28, {r:0.25,g:0.25,b:0.25})
  addText(f, cols[i], cx+4, y+7, 9, true, colW[i]-8, {r:1,g:1,b:1})
  cx += colW[i]
}
y += 28

const rows = [
  ["トヨタ", "510万↑", "20万", "約40万", "無料"],
  ["日産九州", "497万", "20万", "18-30万", "無料"],
  ["豊田織機", "508万", "30万", "約17万", "無料"],
  ["デンソー", "470万", "30万", "約30万", "一部有"],
  ["スバル", "450万", "30万", "約18万", "一部有"],
]
for (const row of rows) {
  cx = PAD
  for (let i = 0; i < row.length; i++) {
    addRect(f, cx, y, colW[i], 40, {r:1,g:1,b:1}, null, 0)
    addRect(f, cx, y, colW[i], 40, {r:0.9,g:0.9,b:0.9})
    addRect(f, cx+0.5, y+0.5, colW[i]-1, 39, {r:1,g:1,b:1})
    addText(f, row[i], cx+4, y+12, 9, i===0, colW[i]-8)
    cx += colW[i]
  }
  y += 40
}

y += 15
addText(f, "\\  今すぐランキングを見る  /", W/2-90, y, 11)
y += 18
addBtn(f, "おすすめランキングTOP3へ >>", y, {r:0.85,g:0.35,b:0.1})

// ========== S5: RANKING 1 - TOYOTA ==========
y = 1310
addRect(f, PAD, y, W-PAD*2, 480, {r:1,g:1,b:1}, {r:0.85,g:0.15,b:0.15}, 8)
y += 12
addText(f, "[1位] トヨタ自動車（愛知）", PAD+15, y, 17, true)
y += 35
addImg(f, PAD+10, y, 155, 110, "トヨタ バナー画像")
addText(f, "期間工メーカーおすすめ1位", PAD+175, y, 11, true)
addText(f, "★★★★★ 5.0", PAD+175, y+20, 13, true, 150, {r:0.85,g:0.15,b:0.15})
addText(f, "Check!\n・最大手トヨタの高待遇\n・待遇も知名度もNo.1\n・住環境もかなり整備", PAD+175, y+42, 10)
y += 130
addText(f, "・未経験で年収510万以上を目指せる", PAD+15, y, 13, true)
y += 22
addText(f, "・入社祝い金+6ヶ月満了手当で合計60万円", PAD+15, y, 12)
y += 22
addText(f, "・食堂、大浴場、サウナありと暮らしやすさ抜群", PAD+15, y, 12)
y += 22
addText(f, "・家賃、水道代、光熱費が0円！", PAD+15, y, 13, true)
y += 22
addText(f, "・正社員実績1,022名！", PAD+15, y, 12)
y += 40
addRect(f, PAD+10, y, W-PAD*2-20, 38, {r:1,g:0.95,b:0.9}, null, 4)
addText(f, "3月24日 17時の時点でまだ募集中！お早めに！", PAD+20, y+10, 11, true, W-PAD*2-40, {r:0.85,g:0.15,b:0.15})
y += 50
addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "トヨタ期間工の応募ページに行く >>", y)

// ========== S6: RANKING 2 - NISSAN ==========
y = 1830
addRect(f, PAD, y, W-PAD*2, 320, {r:1,g:1,b:1}, {r:0.5,g:0.5,b:0.5}, 8)
y += 12
addText(f, "[2位] 日産自動車九州", PAD+15, y, 16, true)
y += 32
addImg(f, PAD+10, y, 145, 90, "日産 バナー画像")
addText(f, "おすすめ2位 ★★★★☆ 4.5\n\n・年収497万円\n・寮費完全無料\n・正社員登用年3回", PAD+165, y, 11)
y += 110
addText(f, "・月収40万円以上可能\n・入社支度金20万円\n・勤続ボーナス100万円", PAD+15, y, 12)
y += 55
addBtn(f, "日産九州の応募ページに行く >>", y)

// ========== S7: RANKING 3 - TOYOTA SHOKKI ==========
y = 2190
addRect(f, PAD, y, W-PAD*2, 320, {r:1,g:1,b:1}, {r:0.5,g:0.5,b:0.5}, 8)
y += 12
addText(f, "[3位] 豊田自動織機（愛知）", PAD+15, y, 16, true)
y += 32
addImg(f, PAD+10, y, 145, 90, "豊田織機 バナー画像")
addText(f, "おすすめ3位 ★★★★☆ 4.0\n\n・年収508万円\n・入社祝い金30万\n・寮費完全無料", PAD+165, y, 11)
y += 110
addText(f, "・繊維機械等の製造\n・赴任旅費支給\n・正社員登用あり", PAD+15, y, 12)
y += 55
addBtn(f, "豊田自動織機の応募ページに行く >>", y)

// ========== S8: FINAL CTA ==========
y = 2560
addRect(f, 0, y, W, 220, {r:0.95,g:0.95,b:0.95})
y += 20
addText(f, "迷ったらまずはトヨタがおすすめ！", PAD, y, 16, true)
y += 30
addText(f, "待遇、知名度、住環境すべてNo.1。\n人気なので募集が終わる前に応募しましょう。", PAD, y, 13)
y += 50
addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "トヨタ期間工に今すぐ応募する >>", y)

// Resize frame to content
f.resize(W, 2800)
figma.viewport.scrollAndZoomIntoView([f])
figma.notify("ワイヤーフレーム生成完了！")
