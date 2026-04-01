// 期間工比較LP ワイヤーフレーム v2 - 比較テーブル改善版
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

function addCircle(parent, x, yy, size, fill) {
  const e = figma.createEllipse()
  e.x = x; e.y = yy
  e.resize(size, size)
  e.fills = [{type: 'SOLID', color: fill}]
  e.strokes = [{type: 'SOLID', color: fill}]
  e.strokeWeight = 2.5
  e.fills = [{type: 'SOLID', color: {r:1,g:1,b:1}}]
  parent.appendChild(e)
  return e
}

function addFilledCircle(parent, x, yy, size, fill) {
  const e = figma.createEllipse()
  e.x = x; e.y = yy
  e.resize(size, size)
  e.fills = [{type: 'SOLID', color: fill}]
  parent.appendChild(e)
  return e
}

// Color definitions
const BLUE = {r:0.1,g:0.6,b:0.85}
const GREEN = {r:0.3,g:0.75,b:0.45}
const YELLOW = {r:0.9,g:0.75,b:0.2}
const RED = {r:0.85,g:0.15,b:0.15}
const ORANGE = {r:0.85,g:0.35,b:0.1}
const GRAY = {r:0.5,g:0.5,b:0.5}
const LGRAY = {r:0.96,g:0.96,b:0.96}
const WHITE = {r:1,g:1,b:1}
const BLACK = {r:0,g:0,b:0}
const DARK = {r:0.15,g:0.15,b:0.15}

// Main frame
const f = figma.createFrame()
f.name = "期間工比較LP_ワイヤー_v2"
f.resize(W, 5500)
f.fills = [{type:'SOLID', color: WHITE}]
page.appendChild(f)

// ========== S1: FIRST VIEW ==========
addRect(f, 0, 0, W, 320, DARK)
y = 15
addText(f, "PR", PAD, y, 10, false, 30, {r:0.7,g:0.7,b:0.7})
y = 35
addText(f, "【2026最新】\n期間工おすすめ比較ランキング！", PAD, y, 22, true, W-PAD*2, WHITE)
y = 110
addText(f, "未経験で年収510万円以上\n入社祝い金総額60万円\nおすすめメーカーを3社厳選！", PAD, y, 15, false, W-PAD*2, {r:1,g:0.85,b:0.3})
y = 200
addImg(f, PAD, y, W-PAD*2, 100, "HERO IMAGE - 工場作業員3人の笑顔")

// ========== S2: BENEFITS ==========
y = 340
addRect(f, 0, y, W, 250, LGRAY)
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
addRect(f, PAD, y, W-PAD*2, 44, {r:1,g:0.95,b:0.95}, RED, 4)
addText(f, "期間工で働く ＝ 稼げる訳ではありません", PAD+15, y+12, 13, true, W-PAD*2-30, RED)
y += 65
addText(f, "絶対間違えてはいけないのが", W/2-85, y, 13)
y += 22
addText(f, "メーカー選びです。", W/2-70, y, 20, true, 200, RED)
y += 40
addText(f, "給与などの待遇がメーカーによって全然違います。\nメーカーを適当に選ぶと同じ労働なのに\n稼げる金額や生活の快適さが全然変わります。", PAD, y, 12)
y += 65
addText(f, "5社のメーカーを比較し、高待遇で環境も\n整っている期間工おすすめメーカー\nランキングベスト3をご紹介します。", PAD, y, 13, true)

// ========== S4: COMPARISON TABLE (IMPROVED) ==========
y = 920
addRect(f, 0, y, W, 560, LGRAY)
y += 15
addText(f, "1. 期間工の稼げる人気メーカー5社比較", PAD, y, 16, true)
addRect(f, PAD, y+22, W-PAD*2, 3, RED)
y += 40

// Table header
const tableX = 10
const colDefs = [
  {label: "メーカー名", w: 72},
  {label: "年収例", w: 58},
  {label: "入社\n祝い金", w: 52},
  {label: "6ヶ月満了\n時の手当", w: 62},
  {label: "寮・\n光熱費", w: 55},
  {label: "その他\n特徴", w: 71}
]
let cx = tableX
addRect(f, tableX, y, W-tableX*2, 36, {r:0.92,g:0.92,b:0.92})
for (const col of colDefs) {
  addText(f, col.label, cx+3, y+5, 8, true, col.w-6, {r:0.3,g:0.3,b:0.3})
  cx += col.w
}
y += 36

// Table data with circle indicators
const tableData = [
  {
    name: "トヨタ自動車\n(愛知)",
    cols: [
      {icon: "best", val: "510万円\n以上", color: RED},
      {icon: "good", val: "20万円", color: GREEN},
      {icon: "best", val: "約40万円", color: RED},
      {icon: "best", val: "寮費・水道\n光熱費すべ\nて無料", color: BLUE},
      {icon: "best", val: "家電付、大浴\n場、サウナ\n有、正社員登\n用実績多数", color: BLUE}
    ],
    highlight: true
  },
  {
    name: "日産自動車\n九州",
    cols: [
      {icon: "good", val: "497万円", color: GREEN},
      {icon: "good", val: "20万円", color: GREEN},
      {icon: "good", val: "約18万円\n〜30万円", color: GREEN},
      {icon: "best", val: "寮費・水道\n光熱費すべ\nて無料", color: BLUE},
      {icon: "best", val: "大浴場・サウ\nナ有、正社\n員登用年3回", color: BLUE}
    ],
    highlight: false
  },
  {
    name: "豊田自動織\n機(愛知)",
    cols: [
      {icon: "good", val: "508万円", color: GREEN},
      {icon: "good", val: "30万円\n前後", color: GREEN},
      {icon: "avg", val: "約17万円", color: YELLOW},
      {icon: "best", val: "寮費・水道\n光熱費すべ\nて無料", color: BLUE},
      {icon: "good", val: "家電付、\n正社員登用\nあり", color: GREEN}
    ],
    highlight: false
  },
  {
    name: "デンソー\n(愛知)",
    cols: [
      {icon: "good", val: "470万円\n前後", color: GREEN},
      {icon: "good", val: "30万円\n前後", color: GREEN},
      {icon: "good", val: "約30万円", color: GREEN},
      {icon: "avg", val: "寮費無料/\n光熱費一部\n負担あり", color: YELLOW},
      {icon: "good", val: "家電付、\n正社員登用\nあり", color: GREEN}
    ],
    highlight: false
  },
  {
    name: "スバル\n(群馬)",
    cols: [
      {icon: "avg", val: "450万円\n前後", color: YELLOW},
      {icon: "good", val: "30万円\n前後", color: GREEN},
      {icon: "avg", val: "約18万円", color: YELLOW},
      {icon: "avg", val: "寮費無料/\n光熱費一部\n負担あり", color: YELLOW},
      {icon: "good", val: "家電付、\n正社員登用\nあり", color: GREEN}
    ],
    highlight: false
  }
]

for (const row of tableData) {
  const rowH = 80
  const bgColor = row.highlight ? {r:1,g:0.98,b:0.95} : WHITE
  addRect(f, tableX, y, W-tableX*2, rowH, bgColor)
  // Row border
  addRect(f, tableX, y+rowH-1, W-tableX*2, 1, {r:0.88,g:0.88,b:0.88})

  cx = tableX
  // Maker name
  addText(f, row.name, cx+3, y+25, 9, true, colDefs[0].w-6)
  cx += colDefs[0].w

  // Data columns with circle indicators
  for (let i = 0; i < row.cols.length; i++) {
    const col = row.cols[i]
    const colW = colDefs[i+1].w
    const circleSize = 24
    const circleX = cx + (colW - circleSize) / 2

    if (col.icon === "best") {
      // Double circle (◎) - filled colored circle with white inner
      addFilledCircle(f, circleX, y+8, circleSize, col.color)
      addFilledCircle(f, circleX+5, y+13, circleSize-10, WHITE)
    } else if (col.icon === "good") {
      // Single circle (○) - outlined
      addCircle(f, circleX, y+8, circleSize, col.color)
    } else {
      // Triangle (△) - use text
      addText(f, "△", circleX+4, y+8, 20, true, circleSize, col.color)
    }

    addText(f, col.val, cx+2, y+36, 7, false, colW-4, {r:0.2,g:0.2,b:0.2})
    cx += colW
  }
  y += rowH
}

y += 20
addText(f, "\\  今すぐランキングを見る  /", W/2-90, y, 11)
y += 18
addBtn(f, "おすすめランキングTOP3へ >>", y, ORANGE)

// ========== S5: RANKING 1 - TOYOTA ==========
y += 80
const rank1Y = y
addRect(f, PAD-5, y, W-PAD*2+10, 580, WHITE, RED, 12)
y += 5
// Crown + Title bar
addRect(f, PAD-5, y, W-PAD*2+10, 45, RED, null, 0)
addText(f, "👑  1位  トヨタ自動車（愛知）", PAD+10, y+12, 16, true, W-PAD*2-20, WHITE)
y += 55

// Image + Rating section
addImg(f, PAD+10, y, 155, 120, "トヨタ バナー画像\nジョブハウス合格実績No.1\n入社お祝い金60万円")
addText(f, "期間工メーカーおすすめ1位", PAD+175, y+2, 11, true)
addText(f, "★★★★★  5.0", PAD+175, y+22, 14, true, 150, RED)
y += 46
// Check section
addRect(f, PAD+175, y, 155, 75, {r:0.97,g:0.97,b:1}, null, 4)
addText(f, "👆 Check!", PAD+182, y+5, 10, true, 140, BLUE)
addText(f, "✔ 最大手トヨタの高待遇\n✔ 待遇も知名度もNo.1\n✔ 住環境もかなり整備", PAD+182, y+22, 10, false, 140, {r:0.2,g:0.2,b:0.2})
y = rank1Y + 190

// Detail bullets
const toyotaDetails = [
  {text: "・未経験で年収510万以上を目指せる", bold: true, color: RED},
  {text: "・《期間限定特別手当》入社祝い金と6ヶ月\n  満了手当で合計60万円", bold: false, color: BLACK},
  {text: "・食堂、大浴場、サウナありと暮らしやすさ抜群", bold: false, color: BLACK},
  {text: "・家賃、水道代、光熱費が0円！", bold: true, color: BLACK},
  {text: "・正社員実績1,022名！", bold: false, color: BLACK},
  {text: "  期間工から大手トヨタの社員になれる\n  チャンスも！", bold: false, color: RED},
]
for (const d of toyotaDetails) {
  addText(f, d.text, PAD+15, y, 12, d.bold, W-PAD*2-30, d.color)
  y += d.text.includes("\n") ? 36 : 22
}

// Character comment
y += 5
addImg(f, PAD+10, y, 40, 40, "👩")
addRect(f, PAD+58, y, W-PAD*2-70, 55, {r:0.97,g:0.97,b:0.97}, {r:0.85,g:0.85,b:0.85}, 8)
addText(f, "トヨタ期間工は各メーカーの中でも、圧倒的に\n待遇が良くおすすめ。人気なので応募殺到中。", PAD+65, y+10, 10, false, W-PAD*2-85, {r:0.3,g:0.3,b:0.3})
y += 65

// Urgency
addRect(f, PAD+10, y, W-PAD*2-20, 42, {r:1,g:0.95,b:0.9}, null, 4)
addText(f, "今まだ募集してる？", PAD+20, y+3, 10, true, 150, RED)
addText(f, "3月24日（火）17時の時点でまだ募集中です！\n定員枠があるうちに応募はお早めに！", PAD+20, y+17, 10, false, W-PAD*2-40, {r:0.85,g:0.3,b:0.1})
y += 55

addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "トヨタ期間工の応募ページに行く ⇒", y)

// ========== S6: RANKING 2 - NISSAN ==========
y += 80
const rank2Y = y
addRect(f, PAD-5, y, W-PAD*2+10, 460, WHITE, {r:0.6,g:0.6,b:0.6}, 12)
y += 5
addRect(f, PAD-5, y, W-PAD*2+10, 40, {r:0.4,g:0.4,b:0.4}, null, 0)
addText(f, "🥈  2位  日産自動車九州", PAD+10, y+10, 15, true, W-PAD*2-20, WHITE)
y += 50

addImg(f, PAD+10, y, 145, 100, "日産 バナー画像")
addText(f, "おすすめ2位", PAD+165, y+2, 11, true)
addText(f, "★★★★☆  4.5", PAD+165, y+22, 13, true, 150, ORANGE)
addRect(f, PAD+165, y+42, 155, 55, {r:0.97,g:0.97,b:1}, null, 4)
addText(f, "👆 Check!\n✔ 月収40万円以上可能\n✔ 正社員登用年3回", PAD+172, y+47, 10, false, 140, {r:0.2,g:0.2,b:0.2})
y = rank2Y + 165

addText(f, "・月収40万円以上可能・入社支度金20万円", PAD+15, y, 12, true)
y += 22
addText(f, "・勤続ボーナス100万円", PAD+15, y, 12)
y += 22
addText(f, "・寮費完全無料・正社員登用年3回", PAD+15, y, 12)
y += 30

addImg(f, PAD+10, y, 40, 40, "👩")
addRect(f, PAD+58, y, W-PAD*2-70, 45, {r:0.97,g:0.97,b:0.97}, {r:0.85,g:0.85,b:0.85}, 8)
addText(f, "トヨタが運良く募集していたら応募がおすすめ。\n日産九州も安定した高待遇。", PAD+65, y+8, 10, false, W-PAD*2-85, {r:0.3,g:0.3,b:0.3})
y += 55

addRect(f, PAD+10, y, W-PAD*2-20, 32, {r:1,g:0.95,b:0.9}, null, 4)
addText(f, "3月24日時点 募集中！定員枠あり", PAD+20, y+8, 10, true, W-PAD*2-40, ORANGE)
y += 42
addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "日産九州の応募ページに行く ⇒", y)

// ========== S7: RANKING 3 - TOYOTA SHOKKI ==========
y += 80
const rank3Y = y
addRect(f, PAD-5, y, W-PAD*2+10, 440, WHITE, {r:0.6,g:0.6,b:0.6}, 12)
y += 5
addRect(f, PAD-5, y, W-PAD*2+10, 40, {r:0.55,g:0.45,b:0.3}, null, 0)
addText(f, "🥉  3位  豊田自動織機（愛知）", PAD+10, y+10, 15, true, W-PAD*2-20, WHITE)
y += 50

addImg(f, PAD+10, y, 145, 100, "豊田織機 バナー画像")
addText(f, "おすすめ3位", PAD+165, y+2, 11, true)
addText(f, "★★★★☆  4.0", PAD+165, y+22, 13, true, 150, ORANGE)
addRect(f, PAD+165, y+42, 155, 55, {r:0.97,g:0.97,b:1}, null, 4)
addText(f, "👆 Check!\n✔ 年収508万円\n✔ 寮費完全無料", PAD+172, y+47, 10, false, 140, {r:0.2,g:0.2,b:0.2})
y = rank3Y + 165

addText(f, "・年収508万円・入社祝い金30万円前後", PAD+15, y, 12, true)
y += 22
addText(f, "・繊維機械等の製造・赴任旅費支給", PAD+15, y, 12)
y += 22
addText(f, "・寮費完全無料・正社員登用あり", PAD+15, y, 12)
y += 30

addImg(f, PAD+10, y, 40, 40, "👩")
addRect(f, PAD+58, y, W-PAD*2-70, 45, {r:0.97,g:0.97,b:0.97}, {r:0.85,g:0.85,b:0.85}, 8)
addText(f, "愛知県で安定して働きたい方に。\nトヨタグループの安心感あり。", PAD+65, y+8, 10, false, W-PAD*2-85, {r:0.3,g:0.3,b:0.3})
y += 55

addRect(f, PAD+10, y, W-PAD*2-20, 32, {r:1,g:0.95,b:0.9}, null, 4)
addText(f, "3月24日時点 募集中！", PAD+20, y+8, 10, true, W-PAD*2-40, ORANGE)
y += 42
addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "豊田自動織機の応募ページに行く ⇒", y)

// ========== S8: FINAL CTA ==========
y += 80
addRect(f, 0, y, W, 260, {r:0.95,g:0.95,b:0.95})
y += 20
addText(f, "迷ったらまずはトヨタがおすすめ！", PAD, y, 18, true)
y += 30
addText(f, "待遇、知名度、住環境すべてNo.1。\n人気なので募集が終わる前に応募しましょう。", PAD, y, 13)
y += 55
addText(f, "\\  45秒でかんたん応募  /", W/2-75, y, 10)
y += 16
addBtn(f, "トヨタ期間工に今すぐ応募する ⇒", y)

// Resize frame to content
y += 80
f.resize(W, y)
figma.viewport.scrollAndZoomIntoView([f])
figma.notify("ワイヤーフレーム v2 生成完了！")
