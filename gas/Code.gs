/**
 * ITエンジニア年収診断 - 回答データ収集 GAS
 *
 * 【設置手順】
 * 1. Google Spreadsheet を新規作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付けて保存
 * 4. デプロイ > 新しいデプロイ > ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 5. デプロイURLをコピーして app.js の GAS_ENDPOINT に設定
 */

// POST リクエストを受け取る
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('回答データ');

    // シートが無ければ作成 + ヘッダー設定
    if (!sheet) {
      sheet = ss.insertSheet('回答データ');
      sheet.appendRow([
        'タイムスタンプ',
        '診断モード',
        '職種',
        '経験年数',
        '技術スタック',
        '現在の年収',
        '企業規模',
        '勤務地域',
        'マネジメント',
        '学歴',
        // 詳細診断のみ
        '技術レベル',
        '業界',
        'チーム規模',
        '開発プロセス',
        '資格',
        '英語力',
        '副業',
        '働き方',
        '仕事満足度',
        '転職で重視',
        '転職検討状況',
        '転職回数',
        // 診断結果
        '適正年収（算出）',
        '年収レンジ下限',
        '年収レンジ上限',
        '現年収との差額',
        '推薦エージェント1位',
        'ユーザーエージェント'
      ]);
      // ヘッダー行をフリーズ・太字
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 28).setFontWeight('bold');
    }

    var answers = data.answers || {};
    var result = data.result || {};

    // 配列は カンマ区切りの文字列に変換
    var techStack = (answers.techStack || []).join(', ');
    var devProcess = (answers.devProcess || []).join(', ');
    var certs = (answers.certifications || []).join(', ');
    var topAgent = (result.recommendedAgents && result.recommendedAgents[0])
                    ? result.recommendedAgents[0].name : '';

    var row = [
      new Date(),                          // タイムスタンプ
      data.mode || '',                     // 診断モード
      answers.role || '',                  // 職種
      answers.experience || '',            // 経験年数
      techStack,                           // 技術スタック
      answers.currentSalary || '',         // 現在の年収
      answers.companySize || '',           // 企業規模
      answers.region || '',                // 勤務地域
      answers.management || '',            // マネジメント
      answers.education || '',             // 学歴
      // 詳細診断のみ（サクッとの場合は空欄）
      answers.skillLevel || '',            // 技術レベル
      answers.companyIndustry || '',       // 業界
      answers.teamSize || '',              // チーム規模
      devProcess,                          // 開発プロセス
      certs,                               // 資格
      answers.english || '',               // 英語力
      answers.sideWork || '',              // 副業
      answers.workStyle || '',             // 働き方
      answers.jobSatisfaction || '',       // 仕事満足度
      answers.salaryPriority || '',        // 転職で重視
      answers.transferTiming || '',        // 転職検討状況
      answers.pastTransfers || '',         // 転職回数
      // 診断結果
      result.estimated || '',              // 適正年収
      result.rangeLow || '',               // レンジ下限
      result.rangeHigh || '',              // レンジ上限
      result.gap || '',                    // 差額
      topAgent,                            // 推薦エージェント1位
      data.userAgent || ''                 // ブラウザ情報
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET でアクセスされた場合（動作確認用）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'エンジニア年収診断 データ収集API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
