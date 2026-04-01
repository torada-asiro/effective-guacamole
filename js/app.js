/**
 * ITエンジニア年収診断 - メインアプリケーション v2
 */

const App = (() => {
  // ========================================
  // Google Apps Script エンドポイント
  // デプロイ後のURLをここに貼る
  // ========================================
  const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzeVuSzkfwmrMlTYd9q__I3G8TLKyE6Wu9OO2AM4otHS7kHvA_U4OkyF5ACnyOuGen5/exec';

  // GitHub OAuth Client ID（公開情報のためフロントに置いてOK）
  const GITHUB_CLIENT_ID = 'Ov23liYM9A5uPBvLJOVK';

  // ========================================
  // エージェントプロフィール（スコアリング基準）
  // 広告主データが揃い次第ここを差し替え
  // ========================================
  const AGENT_PROFILES = [
    {
      id: 'levtech',
      name: 'レバテックキャリア',
      tagline: 'ITエンジニア転職 年収UP実績No.1',
      url: '#levtech-affiliate',
      color: '#00b4d8',
      features: ['高年収求人3万件以上', '年収交渉力に定評', 'AI・クラウド案件充実'],
      // 広告主データ: 全国 / 25-39歳 / QA以外ほぼ全職種
      roleScores:   { frontend:10, backend:10, fullstack:9, mobile:10, sre:10, infra:10, ml_engineer:10, data_engineer:10, pm:10, security:10, qa:3, embedded:10 },
      ageScores:    { '20s_early':4, '20s_late':10, '30s_early':10, '30s_late':10, '40s_plus':5 },
      regionScores: { tokyo:10, kanagawa:10, osaka:10, nagoya:10, fukuoka:10, remote:10, other:10 },
      expScores:    { '1-2':6, '3-4':10, '5-7':10, '8-10':8, '11+':6 },
      goalScores:   { specialist:10, management:7, freelance:4, ai_coexist:9 },
      reasonScores: { undervalued:10, company_issue:8, timing:7, unknown:9 },
      salaryMin: 350, salaryMax: 1500,
      matchReasonMap: {
        role:   { frontend:'フロントエンド求人数・単価ともにトップクラス', backend:'バックエンド特化求人が豊富。年収交渉実績も抜群', mobile:'モバイルアプリエンジニアの求人を多数保有', sre:'SRE・DevOps案件の取り扱いが充実', ml_engineer:'AI・機械学習エンジニアの高年収求人を多数保有', data_engineer:'データ系エンジニアの転職支援実績が豊富', security:'セキュリティエンジニア専門求人が充実', embedded:'組み込み・制御エンジニア案件を幅広く保有', pm:'PM・ITコンサルタントの転職支援実績多数' },
        goal:   { specialist:'技術スペシャリストとして年収を最大化できる求人を多数保有', ai_coexist:'AI・LLM関連の求人取り扱い急増。新領域への転身を強力サポート' },
        reason: { undervalued:'市場価値の正確な査定と年収交渉が得意なエージェント在籍', unknown:'非公開求人含む市場全体の情報提供が強み' }
      }
    },
    {
      id: 'geekly',
      name: 'Geekly',
      tagline: 'ゲーム業界・25歳未満のエンジニア転職に特化',
      url: '#geekly-affiliate',
      color: '#f97316',
      features: ['ゲーム業界求人が豊富', '25歳未満のキャリアアップ支援に強み', '一都三県・関西圏のWeb/ゲーム案件充実'],
      // 広告主データ: 一都三県+関西 / 25歳未満（20s_early）+ ゲーム業界
      roleScores:   { frontend:8, backend:7, fullstack:8, mobile:10, sre:4, infra:3, ml_engineer:4, data_engineer:4, pm:6, security:3, qa:9, embedded:7 },
      ageScores:    { '20s_early':10, '20s_late':6, '30s_early':4, '30s_late':3, '40s_plus':2 },
      regionScores: { tokyo:10, kanagawa:10, osaka:10, nagoya:4, fukuoka:3, remote:6, other:2 },
      expScores:    { '1-2':10, '3-4':9, '5-7':7, '8-10':5, '11+':3 },
      goalScores:   { specialist:7, management:9, freelance:4, ai_coexist:7 },
      reasonScores: { undervalued:7, company_issue:10, timing:8, unknown:7 },
      salaryMin: 250, salaryMax: 800,
      matchReasonMap: {
        role:   { mobile:'ゲーム・アプリ系モバイル求人が豊富。若手エンジニアの転職実績多数', qa:'QA・テストエンジニアの求人を多数保有。専門キャリアを強力サポート', frontend:'Web系フロントエンド案件が豊富。React/Vue求人多数', embedded:'ゲームエンジン・コンシューマーゲーム系エンジニア案件を保有' },
        age:    { '20s_early':'25歳未満エンジニアの転職支援実績No.1クラス。ファーストキャリアから年収アップを実現' },
        goal:   { management:'テックリード・EMへの転向支援実績多数。年収+100〜200万円事例あり' },
        reason: { company_issue:'会社環境・評価制度に悩む若手エンジニアの転職支援が得意' }
      }
    },
    {
      id: 'techgo',
      name: 'テックゴー',
      tagline: 'ハイクラス・シニアエンジニア特化',
      url: '#techgo-affiliate',
      color: '#10b981',
      features: ['年収600万円以上の求人が中心', 'インフラ/ML/AI案件が豊富', 'フリーランス転向もサポート'],
      // 広告主データ: 一都三県 / 20-30代 / PM・ITコンサル（基本3位）
      roleScores:   { frontend:4, backend:6, fullstack:5, mobile:4, sre:10, infra:10, ml_engineer:9, data_engineer:8, pm:6, security:9, qa:4, embedded:8 },
      ageScores:    { '20s_early':5, '20s_late':8, '30s_early':9, '30s_late':8, '40s_plus':5 },
      regionScores: { tokyo:10, kanagawa:10, osaka:6, nagoya:5, fukuoka:4, remote:7, other:4 },
      expScores:    { '1-2':3, '3-4':5, '5-7':9, '8-10':10, '11+':10 },
      goalScores:   { specialist:10, management:6, freelance:10, ai_coexist:9 },
      reasonScores: { undervalued:10, company_issue:6, timing:7, unknown:8 },
      salaryMin: 500, salaryMax: 2000,
      matchReasonMap: {
        role:   { sre:'SRE・インフラのハイクラス求人が充実。年収800万円超も多数', infra:'クラウドインフラのシニアエンジニア向け求人に強み', ml_engineer:'ML・AI系エンジニアの高年収求人を多数保有', data_engineer:'データエンジニア・データサイエンティスト向け案件が豊富', security:'セキュリティエンジニアの専門求人に特化', embedded:'組み込み・IoT系のニッチ高単価案件を保有' },
        goal:   { specialist:'ハイクラス技術職の求人が充実。年収800万円以上の案件多数', freelance:'フリーランス・業務委託への転向を強力サポート', ai_coexist:'AI・機械学習系の最先端案件を多数取り扱い' },
        reason: { undervalued:'ハイクラス人材の適正評価に強み。年収交渉での上乗せ実績多数' }
      }
    }
  ];

  let state = {
    mode: null,
    currentStep: -1,
    questions: [],
    answers: {},
    result: null
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ========================================
  // ローディング中のTips
  // ========================================
  const LOADING_TIPS = [
    { text: 'ITエンジニアの転職後の年収UP額は平均76万円。「適正年収を知っているかどうか」が、オファー交渉で最も差がつくポイントです。', source: 'doda 転職年収レポート 2024' },
    { text: 'エンジニアの約67%が「年収に不満」と回答。しかし実際に転職活動を始めたのはわずか23%。多くの人が「動かないリスク」を過小評価しています。', source: 'paiza エンジニア意識調査' },
    { text: '同じスキルセットでも、業界・企業規模によって年収に200〜300万円の差がつくことは珍しくありません。「環境を変える」だけで年収が上がるケースは非常に多いです。', source: '求人ボックス 給与ナビ' },
    { text: '書類選考の通過率はエージェント経由で約50%、自己応募で約17%。プロに任せるだけで通過率が約3倍に。時間も節約できます。', source: 'マイナビ転職データ' }
  ];

  // ========================================
  // ローディングステータス
  // ========================================
  const LOADING_STEPS = [
    { text: 'スキルデータを分析中', sub: 'analyzing skill matrix...' },
    { text: '市場相場と照合中', sub: 'matching market data...' },
    { text: '類似プロフィールと比較中', sub: 'comparing peer profiles...' },
    { text: '適正年収レンジを算出中', sub: 'calculating salary range...' },
    { text: '最適なエージェントを選定中', sub: 'selecting best agents...' },
    { text: 'レポートを生成中', sub: 'generating report...' }
  ];

  // ========================================
  // 初期化
  // ========================================
  function init() {
    _bindGlobalEvents();
    _showModeSelection();
  }

  function _bindGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && state.currentStep >= 0) {
        const nextBtn = $('.btn-next');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      }
    });
  }

  // ========================================
  // モード選択画面
  // ========================================
  function _showModeSelection() {
    state.currentStep = -1;
    const main = $('#main-content');
    main.innerHTML = `
      <div class="mode-selection fade-in">
        <div class="mode-header">
          <h2>診断モードを選択</h2>
          <p>あなたに合ったモードで市場価値を算出します</p>
        </div>
        <div class="mode-cards">
          <button class="mode-card mode-card-github" data-mode="github">
            <div class="mode-card-badge badge-new">NEW</div>
            <div class="mode-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </div>
            <h3>GitHubで診断</h3>
            <p class="mode-card-desc">最短5問 / 約1分</p>
            <p class="mode-card-detail">GitHubのpublic repoを自動分析。技術スタックを取得し、不足情報だけ追加質問します</p>
          </button>
          <button class="mode-card" data-mode="quick">
            <div class="mode-card-badge">おすすめ</div>
            <div class="mode-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>サクッと診断</h3>
            <p class="mode-card-desc">${Questions.getQuestionCount('quick')}問 / 約2分</p>
            <p class="mode-card-detail">主要な情報から適正年収のレンジを算出します</p>
          </button>
          <button class="mode-card" data-mode="detailed">
            <div class="mode-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <h3>しっかり診断</h3>
            <p class="mode-card-desc">${Questions.getQuestionCount('detailed')}問 / 約4分</p>
            <p class="mode-card-detail">スキルレベル・業界・資格・英語力・志向性も加味して高精度に算出</p>
          </button>
        </div>
      </div>
    `;

    main.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.mode === 'github') {
          _showGitHubEntry();
          return;
        }
        state.mode = card.dataset.mode;
        state.questions = Questions.getQuestions(state.mode);
        state.answers = { isDetailed: state.mode === 'detailed' };
        _startDiagnostic();
      });
    });
  }

  // ========================================
  // GitHub OAuth: ログイン開始
  // ========================================
  function _startGitHubOAuth() {
    const state = Math.random().toString(36).substring(2, 18);
    sessionStorage.setItem('gh_oauth_state', state);
    const params = new URLSearchParams({
      client_id:    GITHUB_CLIENT_ID,
      scope:        'read:user repo',
      state:        state,
      redirect_uri: window.location.origin + window.location.pathname
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  // ========================================
  // GitHub OAuth: コールバック処理
  // ========================================
  async function handleOAuthCallback(code, stateParam) {
    // CSRF対策: stateを検証
    const savedState = sessionStorage.getItem('gh_oauth_state');
    sessionStorage.removeItem('gh_oauth_state');

    if (stateParam !== savedState) {
      // state不一致 → 通常の初期化へ
      init();
      return;
    }

    // ローディング表示
    const main = $('#main-content');
    const pw   = $('.progress-wrap');
    if (pw) pw.style.display = 'none';
    main.innerHTML = `
      <div class="gh-oauth-loading fade-in">
        <span class="gh-spinner-lg"></span>
        <p>GitHubと連携中…</p>
        <p class="gh-oauth-sub">プライベートリポジトリを含む活動データを取得しています</p>
      </div>`;

    try {
      // Netlify FunctionでOAuthトークン交換
      const tokenRes = await fetch(`/.netlify/functions/github-auth?code=${encodeURIComponent(code)}`);
      const tokenJson = await tokenRes.json();
      if (tokenJson.error) throw new Error(tokenJson.error);

      const token = tokenJson.access_token;

      // GraphQL APIでデータ取得（private含む）
      const githubData = await _fetchGitHubDataWithToken(token);
      _showGitHubAnalysisResult(githubData);

    } catch (e) {
      main.innerHTML = `
        <div class="gh-oauth-loading fade-in">
          <p style="color:var(--color-negative)">連携に失敗しました: ${e.message}</p>
          <button class="btn-back-to-mode" onclick="App.init()" type="button" style="margin-top:16px">← 最初に戻る</button>
        </div>`;
    }
  }

  // ========================================
  // GitHub GraphQL API（OAuth token使用）
  // private repoを含む全データ取得
  // ========================================
  async function _fetchGitHubDataWithToken(token) {
    const query = `{
      viewer {
        login
        createdAt
        followers { totalCount }
        contributionsCollection {
          contributionCalendar { totalContributions }
          totalCommitContributions
          totalPullRequestContributions
        }
        repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            isFork
            isPrivate
            primaryLanguage { name }
          }
        }
      }
    }`;

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!res.ok) throw new Error(`GraphQL APIエラー (${res.status})`);
    const { data, errors } = await res.json();
    if (errors) throw new Error(errors[0].message);

    const viewer = data.viewer;
    const totalContributions = viewer.contributionsCollection.contributionCalendar.totalContributions;

    // repos配列をrepos APIと同じ形式に変換（private含む）
    const reposMapped = viewer.repositories.nodes.map(r => ({
      fork:     r.isFork,
      language: r.primaryLanguage?.name ?? null,
      private:  r.isPrivate
    }));

    const profile = {
      created_at: viewer.createdAt,
      followers:  viewer.followers.totalCount
    };

    const githubData = _analyzeGitHubRepos(viewer.login, reposMapped, profile, totalContributions);

    // privateリポジトリ件数を追加情報として保持
    const privateCount = viewer.repositories.nodes.filter(r => r.isPrivate && !r.isFork).length;
    return { ...githubData, privateRepoCount: privateCount, isOAuth: true };
  }

  // ========================================
  // GitHub診断: username入力画面
  // ========================================
  function _showGitHubEntry() {
    state.currentStep = -1;
    const pw = $('.progress-wrap');
    if (pw) pw.style.display = 'none';
    const main = $('#main-content');
    main.innerHTML = `
      <div class="github-entry fade-in">
        <div class="github-entry-header">
          <div class="github-entry-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
          <h2>GitHubで診断</h2>
        </div>

        <!-- ① OAuthログイン（推奨・private含む） -->
        <div class="gh-entry-oauth-block">
          <div class="gh-entry-oauth-badge">推奨</div>
          <p class="gh-entry-oauth-title">GitHubでログイン</p>
          <p class="gh-entry-oauth-desc">プライベートリポジトリを含む<br>活動データをすべて取得します</p>
          <ul class="gh-entry-oauth-features">
            <li>✅ 草（private含む全コントリビューション）</li>
            <li>✅ 社内リポジトリの言語・技術スタック</li>
            <li>✅ 最短4問で診断完了</li>
          </ul>
          <button class="btn-github-oauth" id="btn-gh-oauth" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHubアカウントで連携する
          </button>
          <p class="gh-entry-oauth-note">※ privateリポジトリの言語情報取得のためrepoスコープを使用します。読み取りのみ・書き込みは一切行いません。</p>
        </div>

        <!-- 区切り線 -->
        <div class="gh-entry-divider"><span>または</span></div>

        <!-- ② ユーザー名入力（publicのみ） -->
        <div class="gh-entry-public-block">
          <p class="gh-entry-public-title">ユーザー名で試す（publicリポジトリのみ）</p>
          <div class="github-entry-form">
            <div class="github-entry-input-wrap">
              <span class="github-entry-prefix">github.com /</span>
              <input type="text" id="github-entry-input" class="github-entry-input"
                placeholder="ユーザー名を入力" autocomplete="off" autocorrect="off"
                autocapitalize="off" spellcheck="false">
            </div>
            <button class="btn-github-start" id="btn-github-start" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              分析して診断を開始
            </button>
            <div id="github-entry-status"></div>
          </div>
        </div>
        <button class="btn-back-to-mode" type="button">← モード選択に戻る</button>
      </div>`;

    // OAuthボタン
    $('#btn-gh-oauth').addEventListener('click', () => _startGitHubOAuth());

    // publicユーザー名入力ボタン
    const startBtn = $('#btn-github-start');
    const entryInput = $('#github-entry-input');
    startBtn.addEventListener('click', () => _handleGitHubEntry());
    entryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') _handleGitHubEntry();
    });

    $('.btn-back-to-mode').addEventListener('click', () => {
      if (pw) pw.style.display = '';
      _showModeSelection();
    });
  }

  // ========================================
  // GitHub診断: repos取得 & 分析
  // ========================================
  async function _handleGitHubEntry() {
    const input = $('#github-entry-input');
    const status = $('#github-entry-status');
    const btn = $('#btn-github-start');
    const username = input ? input.value.trim() : '';

    if (!username) {
      status.innerHTML = '<p class="gh-entry-error">GitHubユーザー名を入力してください</p>';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="gh-spinner"></span> 分析中…`;
    status.innerHTML = '<p class="gh-entry-loading">GitHubのデータを取得中（草・プロフィール・リポジトリ）…</p>';

    const enc = encodeURIComponent(username);

    try {
      // 3つのAPIを並行取得（コントリビューション数・プロフィール・publicリポジトリ）
      const [profileRes, reposRes, contribRes] = await Promise.all([
        fetch(`https://api.github.com/users/${enc}`),
        fetch(`https://api.github.com/users/${enc}/repos?per_page=100&sort=updated`),
        fetch(`https://github-contributions-api.jogruber.de/v4/${enc}?y=last`).catch(() => null)
      ]);

      // ユーザー存在確認（profileで判定）
      if (profileRes.status === 404) throw new Error('ユーザーが見つかりません。ユーザー名を確認してください。');
      if (profileRes.status === 403) throw new Error('GitHub APIのレート制限に達しました。しばらく待ってから試してください。');
      if (!profileRes.ok) throw new Error(`GitHub APIエラー (${profileRes.status})`);

      const [profile, repos, contribJson] = await Promise.all([
        profileRes.json(),
        reposRes.ok ? reposRes.json() : Promise.resolve([]),
        contribRes && contribRes.ok ? contribRes.json() : Promise.resolve(null)
      ]);

      // コントリビューション総数（草の数）
      const totalContributions = contribJson?.total?.lastYear ?? null;

      const githubData = _analyzeGitHubRepos(username, repos, profile, totalContributions);
      _showGitHubAnalysisResult(githubData);

    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> 分析して診断を開始`;
      status.innerHTML = `<p class="gh-entry-error">${e.message}</p>`;
    }
  }

  // ========================================
  // GitHub repos分析ロジック
  // ========================================
  const GH_LANG_TO_TECH = {
    'JavaScript': 'javascript', 'TypeScript': 'typescript',
    'Python': 'python', 'Go': 'go', 'Rust': 'rust',
    'Java': 'java', 'Kotlin': 'kotlin', 'Swift': 'swift',
    'PHP': 'php', 'Ruby': 'ruby', 'C#': 'csharp',
    'C++': 'cpp', 'C': 'cpp', 'Scala': 'scala', 'Elixir': 'elixir'
  };

  function _analyzeGitHubRepos(username, repos, profile, totalContributions) {
    // --- publicリポジトリから言語を集計 ---
    const langCount = {};
    repos.forEach(repo => {
      if (!repo.fork && repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    // 技術スタックに変換（重複除去）
    const techStack = [];
    const sortedLangs = Object.keys(langCount).sort((a, b) => langCount[b] - langCount[a]);
    sortedLangs.forEach(lang => {
      const val = GH_LANG_TO_TECH[lang];
      if (val && !techStack.includes(val)) techStack.push(val);
    });

    // 職種推定（public言語から）
    const suggestedRole = _suggestRoleFromLangs(sortedLangs, langCount);

    // 言語表示用ラベル（上位5件）
    const topLangs = sortedLangs.slice(0, 5);

    // --- プロフィールからアカウント年齢を計算 ---
    const accountAgeYears = profile?.created_at
      ? Math.floor((Date.now() - new Date(profile.created_at)) / (365.25 * 24 * 3600 * 1000))
      : null;

    // --- 草の数 + アカウント年齢から経験年数を推定 ---
    const suggestedExperience = _suggestExperienceFromGitHub(totalContributions, accountAgeYears);

    // --- 活動レベル判定 ---
    const activityLevel = _getActivityLevel(totalContributions);

    return {
      username,
      techStack,
      suggestedRole,
      topLangs,
      langCount,
      repoCount: repos.filter(r => !r.fork).length,
      totalContributions,
      accountAgeYears,
      suggestedExperience,
      activityLevel,
      followers: profile?.followers ?? 0
    };
  }

  // 草の数 + アカウント年齢 → 経験年数レンジを推定
  function _suggestExperienceFromGitHub(contributions, accountAge) {
    // アカウント年齢と草の数の両方を総合的に判断
    const byAge = accountAge !== null ? (
      accountAge >= 10 ? '11+' :
      accountAge >= 8  ? '8-10' :
      accountAge >= 5  ? '5-7' :
      accountAge >= 3  ? '3-4' :
      accountAge >= 1  ? '1-2' : null
    ) : null;

    const byContrib = contributions !== null ? (
      contributions >= 2500 ? '8-10' :
      contributions >= 1500 ? '5-7' :
      contributions >= 700  ? '3-4' :
      contributions >= 200  ? '1-2' : null
    ) : null;

    // より保守的な（低い）方を採用
    const order = [null, '1-2', '3-4', '5-7', '8-10', '11+'];
    const idxAge   = order.indexOf(byAge);
    const idxContr = order.indexOf(byContrib);
    const chosen   = Math.min(
      idxAge   >= 0 ? idxAge   : 99,
      idxContr >= 0 ? idxContr : 99
    );
    return chosen < 99 ? order[chosen] : null;
  }

  // コントリビューション数 → 活動レベルラベル
  function _getActivityLevel(contributions) {
    if (contributions === null) return null;
    if (contributions >= 2000) return { label: '非常に活発',  color: '#22c55e', bar: 100 };
    if (contributions >= 1000) return { label: '活発',        color: '#4ade80', bar: 80  };
    if (contributions >= 500)  return { label: '普通',        color: '#86efac', bar: 60  };
    if (contributions >= 200)  return { label: 'やや少なめ',  color: '#bbf7d0', bar: 40  };
    return                            { label: '少なめ',      color: '#d1fae5', bar: 20  };
  }

  function _suggestRoleFromLangs(sortedLangs, langCount) {
    if (!sortedLangs.length) return null;
    const primary = sortedLangs[0];
    const hasJS  = langCount['JavaScript'] || langCount['TypeScript'];
    const hasPy  = langCount['Python'];
    const hasGo  = langCount['Go'];
    const hasJVM = langCount['Java'] || langCount['Kotlin'] || langCount['Scala'];
    const total  = Object.values(langCount).reduce((a, b) => a + b, 0);

    if (primary === 'Swift' || primary === 'Kotlin') return 'mobile';
    if (primary === 'Rust' || primary === 'C' || primary === 'C++') return 'embedded';
    if (primary === 'Go') return 'backend';
    if (primary === 'Python') {
      return (hasPy / total > 0.5) ? 'backend' : 'data_engineer';
    }
    if (primary === 'Ruby' || primary === 'PHP' || primary === 'Elixir') return 'backend';
    if (primary === 'JavaScript' || primary === 'TypeScript') {
      // バックエンドも書いていればフルスタック
      return (hasGo || hasJVM || langCount['Python'] || langCount['Ruby']) ? 'fullstack' : 'frontend';
    }
    if (primary === 'Java') return hasJS ? 'fullstack' : 'backend';
    return null;
  }

  // ========================================
  // GitHub診断: 分析結果サマリー → 質問へ
  // ========================================
  function _showGitHubAnalysisResult(githubData) {
    const pw = $('.progress-wrap');
    const main = $('#main-content');

    const roleNames = {
      frontend: 'フロントエンドエンジニア', backend: 'バックエンドエンジニア',
      fullstack: 'フルスタックエンジニア', mobile: 'モバイルエンジニア',
      infra: 'インフラエンジニア', sre: 'SRE', data_engineer: 'データエンジニア',
      ml_engineer: '機械学習エンジニア', security: 'セキュリティエンジニア',
      pm: 'EM / PM', qa: 'QAエンジニア', embedded: '組み込みエンジニア'
    };

    // 草（コントリビューション）ブロック
    const al = githubData.activityLevel;
    const contribBlock = githubData.totalContributions !== null ? `
      <div class="gh-contrib-wrap">
        <div class="gh-contrib-header">
          <span class="gh-contrib-label">🌿 草の量（過去1年のコントリビューション数）</span>
          <span class="gh-contrib-count">${githubData.totalContributions.toLocaleString()}件</span>
        </div>
        <div class="gh-contrib-bar-bg">
          <div class="gh-contrib-bar-fill" style="width: 0%; background: ${al.color}" data-width="${al.bar}%"></div>
        </div>
        <div class="gh-contrib-meta">
          <span class="gh-activity-label" style="color: ${al.color}">${al.label}</span>
          <span class="gh-contrib-note">privateリポジトリへのコミットを含む</span>
        </div>
      </div>` : `
      <div class="gh-contrib-wrap gh-contrib-none">
        <span class="gh-contrib-label">🌿 草の量</span>
        <span class="gh-contrib-note">取得できませんでした</span>
      </div>`;

    // アカウント年齢
    const ageBlock = githubData.accountAgeYears !== null
      ? `<span class="gh-age-badge">GitHubアカウント歴 約${githubData.accountAgeYears}年</span>`
      : '';

    // 言語チップ
    const isOAuth = githubData.isOAuth === true;
    const privateLabel = isOAuth
      ? `<span class="gh-private-badge">🔒 privateリポジトリ ${githubData.privateRepoCount ?? 0}件を含む</span>`
      : '';

    const langChips = githubData.topLangs.length > 0
      ? githubData.topLangs.map(l => `<span class="gh-lang-chip">${l}</span>`).join('')
      : isOAuth
        ? '<span class="gh-no-lang">言語情報が検出できませんでした</span>'
        : '<span class="gh-no-lang">publicリポジトリに言語情報なし</span>';

    // 職種推定
    const roleGuess = githubData.suggestedRole
      ? `<div class="gh-role-guess">言語から職種を推定: <strong>${roleNames[githubData.suggestedRole]}</strong><span class="gh-role-hint">（次の画面で確認・変更できます）</span></div>`
      : '<div class="gh-role-guess-none">職種は次の画面で選択してください</div>';

    // 経験年数推定
    const expLabels = { '1-2': '1〜2年', '3-4': '3〜4年', '5-7': '5〜7年', '8-10': '8〜10年', '11+': '11年以上' };
    const expGuess = githubData.suggestedExperience
      ? `<div class="gh-exp-guess">経験年数の推定: <strong>${expLabels[githubData.suggestedExperience]}</strong><span class="gh-role-hint">（草の数とアカウント歴から推定）</span></div>`
      : '';

    main.innerHTML = `
      <div class="github-analysis fade-in">
        <div class="gh-analysis-header">
          <div class="gh-check-icon">✓</div>
          <h2>@${githubData.username} の分析完了</h2>
          ${ageBlock}
        </div>
        <div class="gh-analysis-body">
          ${contribBlock}
          <div class="gh-langs-wrap">
            <p class="gh-langs-label">${isOAuth ? 'リポジトリで検出した言語（private含む）' : 'publicリポジトリで検出した言語'}</p>
            ${privateLabel}
            <div class="gh-langs-chips">${langChips}</div>
          </div>
          <div class="gh-guesses">
            ${roleGuess}
            ${expGuess}
          </div>
        </div>
        <div class="gh-analysis-footer">
          <p class="gh-next-hint">不足している情報（${_buildGitHubQuestions(githubData).length}問）を入力して診断結果を表示します</p>
          <button class="btn-gh-proceed" id="btn-gh-proceed" type="button">追加質問に進む →</button>
        </div>
      </div>`;

    // バーアニメーション
    setTimeout(() => {
      const bar = main.querySelector('.gh-contrib-bar-fill');
      if (bar) bar.style.width = bar.dataset.width;
    }, 300);

    $('#btn-gh-proceed').addEventListener('click', () => {
      state.mode = 'github';
      state.answers = {
        isDetailed: false,
        techStack: githubData.techStack,
        _githubUser: githubData.username,
        _githubLangs: githubData.topLangs,
        _githubContributions: githubData.totalContributions,
        _githubAccountAge: githubData.accountAgeYears
      };
      // 推定値をデフォルト選択としてセット
      if (githubData.suggestedRole) {
        state.answers.role = githubData.suggestedRole;
      }
      if (githubData.suggestedExperience) {
        state.answers.experience = githubData.suggestedExperience;
      }
      state.questions = _buildGitHubQuestions(githubData);
      if (pw) pw.style.display = '';
      state.currentStep = 0;
      _updateProgress();
      _renderQuestion();
    });
  }

  // ========================================
  // GitHub診断: 追加質問リストを構築
  // ========================================
  function _buildGitHubQuestions(githubData) {
    const allCommon = Questions.getQuestions('quick');
    // techStackは取得済みなのでスキップ
    // roleは推定できた場合はスキップ（ただし低信頼の場合はconfirmation質問として残す）
    const skip = new Set(['techStack']);

    // 職種が確実に推定できた場合はスキップ（Swift/Kotlin/Rust/C系）
    const highConfidenceLangs = ['Swift', 'Kotlin', 'Rust', 'C', 'C++'];
    const hasHighConf = githubData.topLangs.length > 0 &&
      highConfidenceLangs.includes(githubData.topLangs[0]);
    if (hasHighConf && githubData.suggestedRole) skip.add('role');

    // educationは省略（影響小）
    skip.add('education');

    return allCommon
      .filter(q => !skip.has(q.id))
      .map(q => {
        // role質問: GitHub推定値をハイライト表示
        if (q.id === 'role' && githubData.suggestedRole) {
          return { ...q, _githubSuggested: githubData.suggestedRole };
        }
        // experience質問: 草+アカウント年齢から推定値をハイライト
        if (q.id === 'experience' && githubData.suggestedExperience) {
          return { ...q, _githubSuggested: githubData.suggestedExperience };
        }
        return q;
      });
  }

  // ========================================
  // 診断開始
  // ========================================
  function _startDiagnostic() {
    state.currentStep = 0;
    _updateProgress();
    _renderQuestion();
  }

  // ========================================
  // プログレスバー
  // ========================================
  function _updateProgress() {
    const bar = $('#progress-bar');
    const counter = $('#progress-counter');
    if (!bar) return;
    const total = state.questions.length;
    const current = state.currentStep;
    if (current < 0) {
      bar.style.width = '0%';
      counter.textContent = '';
      return;
    }
    const percent = Math.round(((current + 1) / total) * 100);
    bar.style.width = percent + '%';
    counter.textContent = (current + 1) + ' / ' + total;
  }

  // ========================================
  // 質問レンダリング
  // ========================================
  function _renderQuestion() {
    const q = state.questions[state.currentStep];
    if (!q) return;
    const main = $('#main-content');
    _updateProgress();

    let html = `<div class="question-container fade-in">`;
    html += `<div class="question-header">`;
    html += `<h2 class="question-title">${q.title}</h2>`;
    if (q.subtitle) html += `<p class="question-subtitle">${q.subtitle}</p>`;
    html += `</div>`;

    switch (q.type) {
      case 'single':  html += _renderSingleSelect(q); break;
      case 'multi':   html += _renderMultiSelect(q); break;
      case 'salary_input': html += _renderSalaryInput(q); break;
    }

    html += `<div class="question-nav">`;
    if (state.currentStep > 0) {
      html += `<button class="btn-back" type="button">戻る</button>`;
    } else {
      html += `<div></div>`;
    }
    if (q.type === 'multi' || q.type === 'salary_input') {
      html += `<button class="btn-next" type="button" disabled>次へ</button>`;
    }
    if (q.optional) {
      html += `<button class="btn-skip" type="button">スキップ</button>`;
    }
    html += `</div></div>`;

    main.innerHTML = html;
    _bindQuestionEvents(q);
  }

  function _renderSingleSelect(q) {
    let html = '<div class="options-list">';
    q.options.forEach(opt => {
      const isSelected = state.answers[q.id] === opt.value;
      const isGHSuggested = q._githubSuggested === opt.value;
      const selected = isSelected ? ' selected' : '';
      const iconHtml = opt.icon ? `<span class="opt-icon">${opt.icon}</span>` : '';
      const descHtml = opt.description ? `<span class="opt-desc">${opt.description}</span>` : '';
      const ghBadge = isGHSuggested
        ? '<span class="gh-suggest-badge">GitHub推定</span>'
        : '';
      html += `<button class="option-btn${selected}${isGHSuggested ? ' gh-suggested' : ''}" data-value="${opt.value}" type="button">${iconHtml}<span class="opt-label">${opt.label}</span>${descHtml}${ghBadge}</button>`;
    });
    html += '</div>';
    return html;
  }

  function _renderMultiSelect(q) {
    const cur = state.answers[q.id] || [];
    let html = '<div class="multi-select-container">';

    // GitHub連携 UI（techStackのみ）
    if (q.id === 'techStack') {
      html += `
        <div class="github-fetch-wrap">
          <div class="github-fetch-row">
            <svg class="github-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <input type="text" id="github-username" class="github-input" placeholder="GitHubユーザー名（例: torvalds）" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
            <button class="btn-github-fetch" id="btn-github-fetch" type="button">自動取得</button>
          </div>
          <p class="github-fetch-hint">public repoの使用言語を自動でチェックします（任意）</p>
          <div id="github-fetch-status"></div>
        </div>`;
    }

    if (q.maxSelect) html += `<p class="select-counter"><span id="selected-count">${cur.length}</span> / ${q.maxSelect} 選択中</p>`;
    const groups = q.groups || [{ label: null, options: q.options }];
    groups.forEach(group => {
      if (group.label) html += `<div class="option-group-label">${group.label}</div>`;
      html += '<div class="options-grid">';
      group.options.forEach(opt => {
        const selected = cur.includes(opt.value) ? ' selected' : '';
        html += `<button class="chip-btn${selected}" data-value="${opt.value}" type="button">${opt.label}</button>`;
      });
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function _renderSalaryInput(q) {
    const current = state.answers[q.id] || '';
    return `
      <div class="salary-input-wrap">
        <div class="salary-input-group">
          <input type="number" id="salary-input" class="salary-input" value="${current}" placeholder="${q.placeholder}" min="${q.min}" max="${q.max}" inputmode="numeric">
          <span class="salary-unit">${q.unit}</span>
        </div>
        <div class="salary-presets">
          <button class="preset-btn" data-value="350" type="button">350万</button>
          <button class="preset-btn" data-value="450" type="button">450万</button>
          <button class="preset-btn" data-value="550" type="button">550万</button>
          <button class="preset-btn" data-value="700" type="button">700万</button>
          <button class="preset-btn" data-value="900" type="button">900万</button>
        </div>
      </div>`;
  }

  // ========================================
  // イベントバインド
  // ========================================
  function _bindQuestionEvents(q) {
    const backBtn = $('.btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.currentStep--;
        if (state.currentStep < 0) {
          _showModeSelection();
        } else {
          _renderQuestion();
        }
      });
    }
    const skipBtn = $('.btn-skip');
    if (skipBtn) skipBtn.addEventListener('click', () => _advance());

    switch (q.type) {
      case 'single': _bindSingleEvents(q); break;
      case 'multi':  _bindMultiEvents(q); break;
      case 'salary_input': _bindSalaryEvents(q); break;
    }
  }

  function _bindSingleEvents(q) {
    $$('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.answers[q.id] = btn.dataset.value;
        setTimeout(() => _advance(), 200);
      });
    });
  }

  function _bindMultiEvents(q) {
    const nextBtn = $('.btn-next');
    const maxSel = q.maxSelect || 99;
    if ((state.answers[q.id] || []).length > 0 && nextBtn) nextBtn.disabled = false;

    $$('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!state.answers[q.id]) state.answers[q.id] = [];
        const arr = state.answers[q.id];
        const val = btn.dataset.value;
        if (arr.includes(val)) {
          state.answers[q.id] = arr.filter(v => v !== val);
          btn.classList.remove('selected');
        } else if (arr.length < maxSel) {
          arr.push(val);
          btn.classList.add('selected');
        }
        const count = state.answers[q.id].length;
        const counter = $('#selected-count');
        if (counter) counter.textContent = count;
        if (nextBtn) nextBtn.disabled = count === 0;
      });
    });
    if (nextBtn) nextBtn.addEventListener('click', () => _advance());

    // GitHub連携ハンドラ（techStackのみ）
    const githubBtn = $('#btn-github-fetch');
    if (githubBtn) {
      const githubInput = $('#github-username');
      githubBtn.addEventListener('click', () => _fetchGitHubTech(q));
      if (githubInput) {
        githubInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); _fetchGitHubTech(q); }
        });
      }
    }
  }

  // ========================================
  // GitHub APIから技術スタックを取得
  // ========================================
  const GITHUB_LANG_MAP = {
    'JavaScript': 'javascript', 'TypeScript': 'typescript',
    'Python': 'python', 'Go': 'go', 'Rust': 'rust',
    'Java': 'java', 'Kotlin': 'kotlin', 'Swift': 'swift',
    'PHP': 'php', 'Ruby': 'ruby', 'C#': 'csharp',
    'C++': 'cpp', 'C': 'cpp', 'Scala': 'scala', 'Elixir': 'elixir'
  };

  async function _fetchGitHubTech(q) {
    const input = $('#github-username');
    const status = $('#github-fetch-status');
    const btn = $('#btn-github-fetch');
    const username = (input ? input.value.trim() : '');
    if (!username) {
      status.innerHTML = '<span class="github-status-error">ユーザー名を入力してください</span>';
      return;
    }
    btn.disabled = true;
    btn.textContent = '取得中…';
    status.innerHTML = '<span class="github-status-loading">GitHubに問い合わせ中…</span>';

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
      if (res.status === 404) throw new Error('ユーザーが見つかりません');
      if (!res.ok) throw new Error('GitHub APIエラー（' + res.status + '）');
      const repos = await res.json();

      const foundSet = new Set();
      repos.forEach(repo => {
        if (repo.language && GITHUB_LANG_MAP[repo.language]) {
          foundSet.add(GITHUB_LANG_MAP[repo.language]);
        }
      });

      if (foundSet.size === 0) {
        status.innerHTML = '<span class="github-status-warn">使用言語が見つかりませんでした（privateリポジトリは対象外）</span>';
      } else {
        if (!state.answers[q.id]) state.answers[q.id] = [];
        const maxSel = q.maxSelect || 99;
        foundSet.forEach(lang => {
          if (!state.answers[q.id].includes(lang) && state.answers[q.id].length < maxSel) {
            state.answers[q.id].push(lang);
          }
        });
        _refreshChips(q);
        status.innerHTML = `<span class="github-status-ok">✓ ${foundSet.size}件の言語を検出・選択しました</span>`;
      }
    } catch (e) {
      status.innerHTML = `<span class="github-status-error">${e.message || '取得に失敗しました'}</span>`;
    } finally {
      btn.disabled = false;
      btn.textContent = '自動取得';
    }
  }

  function _refreshChips(q) {
    const cur = state.answers[q.id] || [];
    $$('.chip-btn').forEach(btn => {
      btn.classList.toggle('selected', cur.includes(btn.dataset.value));
    });
    const counter = $('#selected-count');
    if (counter) counter.textContent = cur.length;
    const nextBtn = $('.btn-next');
    if (nextBtn) nextBtn.disabled = cur.length === 0;
  }

  function _bindSalaryEvents(q) {
    const input = $('#salary-input');
    const nextBtn = $('.btn-next');
    function validate() {
      const val = parseInt(input.value);
      if (val >= q.min && val <= q.max) {
        state.answers[q.id] = val;
        if (nextBtn) nextBtn.disabled = false;
      } else {
        if (nextBtn) nextBtn.disabled = true;
      }
    }
    input.addEventListener('input', validate);
    input.addEventListener('focus', () => input.select());
    $$('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.value;
        validate();
        $$('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    if (nextBtn) nextBtn.addEventListener('click', () => _advance());
    if (input.value) validate();
  }

  function _advance() {
    state.currentStep++;
    if (state.currentStep >= state.questions.length) {
      _showLoading();
    } else {
      _renderQuestion();
    }
  }

  // ========================================
  // ローディング画面
  // ========================================
  function _showLoading() {
    const main = $('#main-content');
    const progressWrap = $('.progress-wrap');
    if (progressWrap) progressWrap.style.display = 'none';

    main.innerHTML = `
      <div class="loading-screen fade-in">
        <div class="loading-visual">
          <div class="loading-ring"></div>
          <div class="loading-ring-outer"></div>
          <div class="loading-percent" id="loading-percent">0%</div>
        </div>
        <div>
          <p class="loading-status" id="loading-status">${LOADING_STEPS[0].text}</p>
          <p class="loading-substatus" id="loading-substatus">${LOADING_STEPS[0].sub}</p>
        </div>
        <div class="loading-tip-container" id="loading-tip-container"></div>
      </div>`;

    let progress = 0;
    let stepIdx = 0;
    let tipIdx = 0;
    const totalDuration = 8000;
    const stepInterval = totalDuration / LOADING_STEPS.length;

    // ステータスを順に表示
    const statusTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx < LOADING_STEPS.length) {
        const el = $('#loading-status');
        const sub = $('#loading-substatus');
        if (el) el.textContent = LOADING_STEPS[stepIdx].text;
        if (sub) sub.textContent = LOADING_STEPS[stepIdx].sub;
      }
    }, stepInterval);

    // Tips: 最初は1秒後に表示、以降5秒間隔（読める速度）
    const tipStartDelay = 1000;
    const tipInterval = 5000;
    let tipTimerId = null;
    setTimeout(() => {
      _showTip(tipIdx);
      tipTimerId = setInterval(() => {
        tipIdx = (tipIdx + 1) % LOADING_TIPS.length;
        _showTip(tipIdx);
      }, tipInterval);
    }, tipStartDelay);

    // パーセント進行（ゆっくりめ）
    const percentTimer = setInterval(() => {
      progress += Math.random() * 4 + 1;
      if (progress > 95) progress = 95;
      const el = $('#loading-percent');
      if (el) el.textContent = Math.round(progress) + '%';
    }, 250);

    // 完了
    setTimeout(() => {
      clearInterval(statusTimer);
      if (tipTimerId) clearInterval(tipTimerId);
      clearInterval(percentTimer);
      const el = $('#loading-percent');
      if (el) el.textContent = '100%';
      const st = $('#loading-status');
      if (st) st.textContent = '診断完了';
      const sub = $('#loading-substatus');
      if (sub) sub.textContent = 'done.';
      setTimeout(() => _showResult(), 600);
    }, totalDuration);
  }

  function _showTip(idx) {
    const container = $('#loading-tip-container');
    if (!container) return;
    const tip = LOADING_TIPS[idx];
    container.innerHTML = `
      <div class="loading-tip fade-in">
        <p class="loading-tip-label">TIPS</p>
        <p class="loading-tip-text">${tip.text}</p>
        <p class="loading-tip-source">— ${tip.source}</p>
      </div>`;
  }

  // ========================================
  // 結果画面
  // ========================================
  function _showResult() {
    const result = SalaryData.calculate(state.answers);
    state.result = result;

    // スプレッドシートに回答データを送信
    _submitToSheet(result);

    const main = $('#main-content');

    const gapSign = result.gap >= 0 ? '+' : '';
    const gapClass = result.gap >= 0 ? 'positive' : 'neutral';

    // レベルバッジ取得
    const levelInfo = SalaryData.getLevelBadge(state.answers, result.estimated);

    // ギャップメッセージ
    let gapMessage = '';
    if (result.currentSalary > 0) {
      if (result.gap < 0) {
        gapMessage = `<p class="gap-context-msg">現在の年収は市場平均より高い水準です。さらに上のグレード・外資・ハイクラス求人へのステップアップも狙えます。</p>`;
      } else if (result.gap > 0) {
        gapMessage = `<p class="gap-context-msg up">転職で年収UPのチャンスがあります。適正年収との差額を交渉材料にできます。</p>`;
      }
    }

    let html = `<div class="result-container">`;

    // 1) ヘッダー + レベルバッジ + 注釈
    html += `
      <div class="result-header">
        <div class="level-badge" style="--level-color: ${levelInfo.color}">
          <span class="level-badge-icon">${levelInfo.icon}</span>
          <span class="level-badge-label">${levelInfo.label}</span>
          <span class="level-badge-desc">${levelInfo.description}</span>
        </div>
        ${state.answers._githubUser ? `
        <div class="gh-result-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          @${state.answers._githubUser} の分析結果をもとに算出
          ${state.answers._githubContributions !== null && state.answers._githubContributions !== undefined
            ? `｜🌿 ${state.answers._githubContributions.toLocaleString()}コントリビューション／年`
            : ''}
        </div>` : ''}
        <p class="result-label">あなたの適正年収レンジ</p>
        <div class="result-salary-range-main">
          <span class="range-low">${result.rangeLow}万</span>
          <span class="range-sep">〜</span>
          <span class="range-high">${result.rangeHigh}万円</span>
        </div>
        <p class="result-midpoint">中央値 <strong>${result.estimated}万円</strong></p>
        <p class="result-note">※ 公開求人データ・年収統計に基づく推定値です。実際のオファー金額は企業の評価基準・面接評価・タイミング等により変動します。</p>
      </div>`;

    // 2) カルーセル: 比較バー + ヒストグラム
    html += `<div class="result-carousel">`;
    html += `<div class="carousel-tabs">`;
    html += `<button class="carousel-tab active" data-tab="comparison">年収比較</button>`;
    html += `<button class="carousel-tab" data-tab="histogram">分布で見る</button>`;
    html += `</div>`;

    // タブ1: 比較バー
    html += `<div class="carousel-panel active" data-panel="comparison">`;
    if (result.currentSalary > 0) {
      html += `
        <div class="comparison-bar-wrap">
          <div class="comparison-item">
            <span class="comparison-label">現在の年収</span>
            <div class="comparison-bar">
              <div class="bar-fill current" style="width: 0%" data-width="${Math.min((result.currentSalary / result.rangeHigh) * 100, 100)}%"><span>${result.currentSalary}万</span></div>
            </div>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">適正年収</span>
            <div class="comparison-bar">
              <div class="bar-fill estimated" style="width: 0%" data-width="${Math.min((result.estimated / result.rangeHigh) * 100, 100)}%"><span>${result.estimated}万</span></div>
            </div>
          </div>
        </div>
        <div class="gap-badge ${gapClass}">${gapSign}${result.gap}万円（${gapSign}${result.gapPercent}%）</div>
        ${gapMessage}`;
    } else {
      html += `<p class="no-comparison">現在の年収が未入力のため比較できません</p>`;
    }
    html += `</div>`;

    // タブ2: ヒストグラム
    html += `<div class="carousel-panel" data-panel="histogram">`;
    html += _buildHistogram(result);
    html += `</div>`;

    html += `</div>`;

    // 3) 結果からの次アクション
    html += _buildRoadmapPreviewSection(result, state.answers);

    // 4) 分岐後のコンテンツ表示エリア
    html += `<div id="result-route-container"></div>`;

    html += `</div>`;
    main.innerHTML = html;

    _animateResult(result);

    const routeContainer = $('#result-route-container');
    const bindScrollButtons = (root = document) => {
      root.querySelectorAll('[data-scroll-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = document.getElementById(btn.dataset.scrollTarget);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    };

    const renderResultRoute = (route) => {
      if (!routeContainer) return;
      if (route === 'back') {
        routeContainer.innerHTML = '';
        const roadmap = $('.action-roadmap-section');
        if (roadmap) roadmap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      routeContainer.innerHTML = route === 'stage2'
        ? _buildStage2RoutePage()
        : _buildDirectCtaRoutePage(result, state.answers);

      bindScrollButtons(routeContainer);
      routeContainer.querySelectorAll('[data-result-route]').forEach(btn => {
        btn.addEventListener('click', () => renderResultRoute(btn.dataset.resultRoute));
      });

      if (route === 'stage2') {
        _bindStage2Events();
      }

      routeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    bindScrollButtons();
    $$('.action-roadmap-section [data-result-route]').forEach(btn => {
      btn.addEventListener('click', () => renderResultRoute(btn.dataset.resultRoute));
    });
  }

  // ========================================
  // 年収アップTips & 深掘りフロー
  // ========================================

  // ========================================
  // 第二段階診断（詳細キャリアロードマップ）
  // ========================================

  const STAGE2_QUESTIONS = [
    { id: 'barrier', text: '転職の最大の不安は？', options: [
      { value: 'interview',    label: '面接・選考に自信がない' },
      { value: 'resume',       label: '職務経歴書の書き方がわからない' },
      { value: 'negotiation',  label: '年収交渉のやり方がわからない' },
      { value: 'time',         label: '忙しくて時間が取れない' },
      { value: 'risk',         label: '転職先が今より悪くなるのが怖い' }
    ]},
    { id: 'career_vision', text: '5年後のキャリアビジョンは？', options: [
      { value: 'architect',    label: 'テックリード・システムアーキテクト' },
      { value: 'em',           label: 'エンジニアリングマネージャー' },
      { value: 'specialist',   label: '特定領域のディープスペシャリスト' },
      { value: 'global',       label: 'グローバルで活躍するエンジニア' },
      { value: 'entrepreneur', label: '起業・フリーランスで独立' }
    ]},
    { id: 'skill_want', text: 'スキルアップしたい分野は？', options: [
      { value: 'cloud',        label: 'クラウド・インフラ（AWS/GCP）' },
      { value: 'ai_ml',        label: 'AI・機械学習' },
      { value: 'security',     label: 'セキュリティ' },
      { value: 'architecture', label: 'アーキテクチャ設計' },
      { value: 'management',   label: 'マネジメント・ピープルスキル' },
      { value: 'english',      label: '英語・グローバルスキル' }
    ]},
    { id: 'company_culture', text: '理想の会社の文化は？', options: [
      { value: 'tech_first',   label: '技術ドリブン・エンジニアの裁量が大きい' },
      { value: 'product',      label: 'プロダクト成長にコミットできる' },
      { value: 'worklife',     label: 'ワークライフバランス重視' },
      { value: 'global',       label: 'グローバル・外資系' },
      { value: 'startup',      label: 'スタートアップで急成長' }
    ]},
    { id: 'timeline', text: '転職活動を始めるなら？', options: [
      { value: 'now',          label: '今すぐ（1ヶ月以内）' },
      { value: '3months',      label: '3ヶ月以内' },
      { value: '6months',      label: '半年以内' },
      { value: 'future',       label: '1年以上先' }
    ]}
  ];

  function _buildStage2Questions() {
    let html = `<div class="stage2-questions fade-in">
      <div class="stage2-q-header">
        <div class="stage2-q-progress">
          <span id="stage2-progress-text">1 / ${STAGE2_QUESTIONS.length}</span>
          <div class="stage2-progress-bar"><div class="stage2-progress-fill" id="stage2-progress-fill" style="width:20%"></div></div>
        </div>
      </div>`;
    STAGE2_QUESTIONS.forEach((q, i) => {
      html += `<div class="stage2-q-block ${i === 0 ? 'active' : ''}" data-qi="${i}" id="stage2-q-${i}">
        <p class="stage2-q-text"><span class="stage2-q-num">${i + 1}</span>${q.text}</p>
        <div class="stage2-opts">
          ${q.options.map(o => `<button class="stage2-opt" data-q="${q.id}" data-val="${o.value}" type="button">${o.label}</button>`).join('')}
        </div>
      </div>`;
    });
    html += `<div id="stage2-result-placeholder"></div></div>`;
    return html;
  }

  function _bindStage2Events() {
    const s2Answers = {};
    let currentQIdx = 0;

    document.querySelectorAll('.stage2-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        s2Answers[q] = btn.dataset.val;
        document.querySelectorAll(`.stage2-opt[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const nextIdx = currentQIdx + 1;
        if (nextIdx < STAGE2_QUESTIONS.length) {
          document.getElementById(`stage2-q-${currentQIdx}`).classList.remove('active');
          document.getElementById(`stage2-q-${nextIdx}`).classList.add('active');
          currentQIdx = nextIdx;
          const pct = Math.round((nextIdx / STAGE2_QUESTIONS.length) * 100);
          document.getElementById('stage2-progress-fill').style.width = pct + '%';
          document.getElementById('stage2-progress-text').textContent = `${nextIdx + 1} / ${STAGE2_QUESTIONS.length}`;
          document.getElementById(`stage2-q-${nextIdx}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // 全問完了
          document.getElementById('stage2-progress-fill').style.width = '100%';
          document.getElementById('stage2-progress-text').textContent = `完了`;
          const out = document.getElementById('stage2-result-placeholder');
          out.innerHTML = _buildDetailedCareerRoadmap(state.answers, s2Answers, state.result);
          out.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // レーダーチャートアニメーション
          setTimeout(() => {
            out.querySelectorAll('.pa-bar, .pa-other-bar').forEach(bar => {
              bar.style.width = bar.dataset.width;
            });
          }, 400);
        }
      });
    });
  }

  function _buildDetailedCareerRoadmap(answers, s2, result) {
    const { role, experience, techStack = [], region, ageRange, management } = answers;
    const { barrier, career_vision, skill_want, company_culture, timeline } = s2;
    const gap = result.gap || 0;
    const estimated = result.estimated;
    const target1y = Math.round((estimated + Math.max(gap * 0.5, 30)) / 10) * 10;
    const target3y = Math.round((estimated + Math.max(gap, 50)) / 10) * 10;

    // Phase 1: 今すぐ〜1ヶ月
    const phase1Actions = (() => {
      const base = ['職務経歴書を最新化する（定量実績を必ず記載）', 'レバテックキャリアに登録して非公開求人を確認'];
      if (barrier === 'resume')       base.push('エージェントによる職務経歴書の無料添削を受ける');
      if (barrier === 'interview')    base.push('面接で話すエピソードをSTAR法で3つ準備する');
      if (barrier === 'negotiation')  base.push(`適正年収レンジ（${estimated}〜${estimated + 50}万円）を把握して交渉準備`);
      if (barrier === 'time')         base.push('週1時間だけスキャウトを確認する習慣をつける');
      if (barrier === 'risk')         base.push('まず情報収集のみ。エージェントは転職しなくても利用OK');
      base.push('気になる企業を10社リストアップする');
      return base;
    })();

    // Phase 2: 1〜3ヶ月
    const skillRec = {
      cloud:        { label: 'AWS/GCP認定資格', detail: 'AWS SAA（3ヶ月で取得可能・年収+50〜80万円の実績）' },
      ai_ml:        { label: 'LLM・AI活用スキル', detail: 'LangChain/RAGの実装経験をGitHubにプッシュ' },
      security:     { label: 'セキュリティ資格', detail: '情報処理安全確保支援士 or CISSP（希少性高・年収+80万円）' },
      architecture: { label: 'アーキテクチャ設計', detail: '設計書を社内で書いた実績を職務経歴書に言語化する' },
      management:   { label: 'マネジメントスキル', detail: '現職でリード経験を意識的に作り実績として積む' },
      english:      { label: '英語スキル', detail: 'TOEIC 750点以上で外資系・グローバル企業の求人幅が広がる' }
    }[skill_want] || { label: 'スキルアップ', detail: '転職エージェントと相談して優先スキルを特定する' };

    const phase2Actions = [
      `【推奨スキル】${skillRec.label}: ${skillRec.detail}`,
      '月2〜3社ペースで面接経験を積む（最初の2〜3社は練習と割り切る）',
      '現職での成果を数値化して職務経歴書に追記し続ける'
    ];
    if (career_vision === 'architect') phase2Actions.push('設計・アーキテクチャに関わる業務を積極的に引き受ける');
    if (career_vision === 'em')        phase2Actions.push('チームリード・メンタリング実績を作る');
    if (career_vision === 'global')    phase2Actions.push('英語での技術発信（Qiita/Zenn）を始める');

    // Phase 3: ターゲット企業
    const targetCompany = {
      tech_first:  'SaaS系スタートアップ〜メガベンチャー（技術ブログ・OSSが活発な企業）',
      product:     '自社プロダクト系企業（SaaS/EC/フィンテック）',
      worklife:    '大手IT企業・外資系（リモートワーク制度が整備された企業）',
      global:      '外資系テック企業（Google/AWS/Salesforce等）またはグローバルSaaS',
      startup:     'Series B〜C期のスタートアップ（急成長中・ストックオプションあり）'
    }[company_culture] || '自社プロダクト系企業';

    const timelineMsg = {
      now:       '今すぐ動き出しましょう。エージェント登録〜内定まで平均3ヶ月。',
      '3months': '3ヶ月後に向けて、今月中にエージェント登録を完了させましょう。',
      '6months': '半年後に向けて、3ヶ月前から本格的に活動開始する計画を立てましょう。',
      future:    'タイミングが来た時すぐ動けるよう、今から市場情報だけ収集しておきましょう。'
    }[timeline] || '';

    const scoredAgents = _scoreAgents(answers, s2, result);

    let html = `<div class="career-roadmap-output fade-in">
      <div class="crm-header">
        <h2 class="crm-title">🗺️ あなた専用キャリアロードマップ</h2>
        <p class="crm-subtitle">診断結果 + 追加質問をもとに個別生成しました</p>
        <div class="crm-targets">
          <div class="crm-target-item">
            <span class="crm-target-label">1年後の目標年収</span>
            <span class="crm-target-val">${target1y}万円</span>
          </div>
          <div class="crm-target-item">
            <span class="crm-target-label">3年後の目標年収</span>
            <span class="crm-target-val">${target3y}万円</span>
          </div>
        </div>
      </div>

      <div class="crm-phases">
        <div class="crm-phase">
          <div class="crm-phase-header crm-phase-1">
            <span class="crm-phase-num">Phase 1</span>
            <span class="crm-phase-period">今すぐ〜1ヶ月「転職準備を整える」</span>
          </div>
          <ul class="crm-actions">
            ${phase1Actions.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="crm-phase">
          <div class="crm-phase-header crm-phase-2">
            <span class="crm-phase-num">Phase 2</span>
            <span class="crm-phase-period">1〜3ヶ月「スキル強化 × 転職活動」</span>
          </div>
          <ul class="crm-actions">
            ${phase2Actions.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="crm-phase">
          <div class="crm-phase-header crm-phase-3">
            <span class="crm-phase-num">Phase 3</span>
            <span class="crm-phase-period">3〜6ヶ月「内定・年収アップを実現」</span>
          </div>
          <ul class="crm-actions">
            <li>ターゲット企業タイプ: <strong>${targetCompany}</strong></li>
            <li>交渉時の提示レンジ: <strong>${estimated}〜${estimated + Math.max(gap, 50)}万円</strong>（現在の適正年収ベース）</li>
            <li>年収交渉スクリプト: 「市場調査で同職種・同経験の適正レンジが${estimated}〜${estimated + 50}万円と確認できました。ぜひその水準でご検討いただけますか」</li>
            <li>${timelineMsg}</li>
          </ul>
        </div>
      </div>

      ${_buildPersonalizedAgentSection(scoredAgents)}
    </div>`;

    return html;
  }

  function _getRoleDisplayName(role) {
    return {
      frontend: 'フロントエンド',
      backend: 'バックエンド',
      fullstack: 'フルスタック',
      mobile: 'モバイル',
      infra: 'インフラ',
      sre: 'SRE',
      data_engineer: 'データエンジニア',
      ml_engineer: '機械学習 / AI',
      security: 'セキュリティ',
      pm: 'EM / PM',
      qa: 'QA',
      embedded: '組み込み'
    }[role] || 'ITエンジニア';
  }

  function _buildRoadmapPreviewSection(result, answers) {
    const topAgent = result.recommendedAgents[0];
    const roleLabel = _getRoleDisplayName(answers.role);
    const gap = result.gap || 0;
    const gapAbs = Math.abs(gap);
    const period = ['3-4', '5-7'].includes(answers.experience) ? '1〜3ヶ月' : '2〜4ヶ月';
    const rangeText = `${result.rangeLow}〜${result.rangeHigh}万円`;
    const lead = result.currentSalary > 0
      ? gap > 0
        ? `今の条件のままでは取り切れていない年収差は ${gapAbs}万円。まずは市場と求人の解像度を上げて、交渉できる状態を作るのが最短です。`
        : `現在の年収はすでに市場平均以上です。次はより上位のポジションや、表に出にくい好条件求人を狙う動きが有効です。`
      : `${roleLabel}として狙える求人レンジは ${rangeText} です。まずは求人の相場感と通過しやすいポジションを掴むところから始めるのが近道です。`;

    const steps = [
      {
        phase: 'STEP 1',
        when: '今週',
        title: topAgent ? `${topAgent.name} で市場価値を確認` : 'エージェントで市場価値を確認',
        desc: `適正年収レンジ ${rangeText} を起点に、非公開求人と求められる期待値を確認します。`,
        bullets: [
          '登録は1〜2社で十分。比較できる状態を作る',
          '職務経歴書のたたき台を共有して添削を受ける'
        ]
      },
      {
        phase: 'STEP 2',
        when: '2〜4週間',
        title: '求人を比較して、狙い先を絞る',
        desc: `${roleLabel}で通しやすい企業タイプと、年収が伸びやすい求人帯を確認します。`,
        bullets: [
          '公開求人だけでなく非公開求人も含めて比較する',
          gap > 0 ? `希望条件に「現年収 +${gapAbs}万円」の根拠を持たせる` : '年収よりも役割グレードや裁量の伸びしろを見る'
        ]
      },
      {
        phase: 'STEP 3',
        when: period,
        title: '選考を進めて、オファー時に年収交渉',
        desc: '面接準備から日程調整、オファー時の条件交渉までをまとめて進めます。',
        bullets: [
          '面接前に想定レンジと訴求実績を整理する',
          gap > 0 ? `交渉目線は ${result.estimated}万円 前後を基準に持つ` : 'より高いレンジのポジションへ乗り換える'
        ]
      }
    ];

    let html = `
      <div class="action-roadmap-section">
        <div class="action-roadmap-head">
          <div>
            <span class="action-roadmap-badge">Next Step</span>
            <h3>診断結果から見る、年収UPまでの最短ルート</h3>
            <p class="action-roadmap-lead">${lead}</p>
          </div>
          <div class="action-roadmap-stats">
            <div class="action-roadmap-stat">
              <span class="action-roadmap-stat-label">狙う年収帯</span>
              <strong>${rangeText}</strong>
            </div>
            <div class="action-roadmap-stat">
              <span class="action-roadmap-stat-label">最初の一手</span>
              <strong>${topAgent ? topAgent.name : 'エージェント登録'}</strong>
            </div>
            <div class="action-roadmap-stat">
              <span class="action-roadmap-stat-label">想定活動期間</span>
              <strong>${period}</strong>
            </div>
          </div>
        </div>
        <div class="action-roadmap-steps">`;

    steps.forEach(step => {
      html += `
          <div class="action-roadmap-step">
            <div class="action-roadmap-step-top">
              <span class="action-roadmap-step-badge">${step.phase}</span>
              <span class="action-roadmap-step-when">${step.when}</span>
            </div>
            <h4>${step.title}</h4>
            <p>${step.desc}</p>
            <ul class="action-roadmap-list">
              ${step.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>`;
    });

    html += `
        </div>
        <div class="action-roadmap-cta">
          <button class="btn-action-primary" data-result-route="stage2" type="button">追加診断を始めてロードマップを受け取る</button>
          <button class="btn-action-secondary" data-result-route="cta" type="button">追加診断はあとで、先にエージェントを見る</button>
        </div>
      </div>`;

    return html;
  }

  function _buildStage2RoutePage() {
    return `
      <div class="result-route-page result-route-page-stage2">
        <div class="result-route-page-head">
          <button class="btn-route-back" data-result-route="back" type="button">← 診断結果に戻る</button>
          <span class="result-route-page-badge">Roadmap Gift</span>
          <h3>ロードマッププレゼント用の追加診断</h3>
          <p class="result-route-page-lead">ここからは追加5問だけです。完了後に、あなた専用のキャリアロードマップと個別アドバイスを表示します。</p>
        </div>
        ${_buildStage2Questions()}
      </div>`;
  }

  function _buildDirectCtaRoutePage(result, answers) {
    const topAgent = result.recommendedAgents[0];

    return `
      <div class="result-route-page result-route-page-cta">
        <div class="result-route-page-head">
          <button class="btn-route-back" data-result-route="back" type="button">← 診断結果に戻る</button>
          <span class="result-route-page-badge result-route-page-badge-sub">Skip Route</span>
          <h3>追加診断はあとで。先に登録判断を進めるルート</h3>
          <p class="result-route-page-lead">${topAgent ? `${topAgent.name} を軸に` : 'おすすめエージェントを軸に'}、不安解消と比較検討をこのページでまとめて進められます。</p>
        </div>
        ${_buildObjectionSection()}
        ${_buildWhyAgentSection(result, answers)}
        ${_buildAgentSection(result)}
        <div class="result-route-page-footer">
          <p>やっぱりロードマッププレゼントを受け取りたくなったら、ここから追加診断に切り替えられます。</p>
          <button class="btn-route-switch" data-result-route="stage2" type="button">追加診断を開始する</button>
        </div>
      </div>`;
  }

  function _generateTips(result, answers) {
    const tips = [];
    const role       = answers.role;
    const exp        = answers.experience;
    const techStack  = Array.isArray(answers.techStack) ? answers.techStack : [];
    const companySize = answers.companySize;
    const management = answers.management;
    const gap        = result.gap;

    // 技術スタック系
    if (role === 'frontend' && !techStack.some(t => ['node','go','python'].includes(t))) {
      tips.push({ icon: '💻', title: 'バックエンドスキルの追加', impact: '+50〜100万円', impactClass: 'high',
        desc: 'Node.js または Go を習得してフルスタック化すると、求人の年収レンジが大幅に広がります。' });
    }
    if (['backend','sre','infra'].includes(role) && !techStack.some(t => ['aws','gcp','azure'].includes(t))) {
      tips.push({ icon: '☁️', title: 'クラウド資格（AWS/GCP）の取得', impact: '+30〜80万円', impactClass: 'medium',
        desc: 'クラウド認定資格はインフラ・SRE求人での年収交渉の武器になります。' });
    }
    if (['ml_engineer','data_engineer'].includes(role)) {
      tips.push({ icon: '🤖', title: 'LLM/生成AI領域へのシフト', impact: '+100〜200万円', impactClass: 'high',
        desc: 'LLMアプリ開発・RAG構築のスキルを加えると、AI系求人で大幅な単価アップが狙えます。' });
    }

    // 企業規模・転職系
    if (['startup_early','startup_growth'].includes(companySize) && gap > 30) {
      tips.push({ icon: '🏢', title: '企業規模のステップアップ', impact: '+80〜150万円', impactClass: 'high',
        desc: 'スタートアップでの実績を引っさげて中規模〜大企業に転職すると、年収+100万円以上のケースが多数あります。' });
    }
    if (companySize === 'large' && gap > 30) {
      tips.push({ icon: '🌏', title: '外資系・グローバル企業への挑戦', impact: '+150〜300万円', impactClass: 'high',
        desc: '同職種でも外資系に転じると年収1.5〜2倍になるケースが多いです。英語力がなくても通るポジションもあります。' });
    }

    // マネジメント系
    if (management === 'none' && ['5-7','8-10','11+'].includes(exp)) {
      tips.push({ icon: '👥', title: 'テックリード・マネージャーへの転向', impact: '+100〜200万円', impactClass: 'high',
        desc: '5年以上の経験があればテックリードや開発マネージャーへの転向が可能。求人の年収上限が大幅に広がります。' });
    }

    // 転職タイミング
    if (['3-4','5-7'].includes(exp)) {
      tips.push({ icon: '⏰', title: '今が転職の黄金期', impact: '転職成功率が高い', impactClass: 'soft',
        desc: `経験${exp}年は転職市場で求人が最も集中する時期です。このタイミングを活かすと交渉力が最大化します。` });
    }

    // デフォルト（何もマッチしなかった場合）
    if (tips.length === 0) {
      tips.push({ icon: '📈', title: '市場価値を正確に把握する', impact: '現状確認', impactClass: 'soft',
        desc: '転職エージェントに登録して非公開求人ベースの市場価値を確認することが最初の一歩です。' });
    }

    return tips.slice(0, 4);
  }

  function _buildTipsSection(result, answers) {
    const tips = _generateTips(result, answers);
    let html = `<div class="tips-section"><h3 class="tips-title">📈 あなたの年収アップロードマップ</h3>
      <p class="tips-subtitle">診断結果をもとに、あなたに最適な年収アップの打ち手を抽出しました</p>
      <div class="tips-list">`;
    tips.forEach(t => {
      html += `<div class="tip-card">
        <div class="tip-header">
          <span class="tip-icon">${t.icon}</span>
          <span class="tip-title-text">${t.title}</span>
          <span class="tip-impact tip-impact-${t.impactClass}">${t.impact}</span>
        </div>
        <p class="tip-desc">${t.desc}</p>
      </div>`;
    });
    html += `</div>
      <div class="tips-deepdive-cta">
        <p class="tips-deepdive-label">さらにあなたのキャリア課題を深掘りして、より精度の高いアドバイスをもらう</p>
        <button class="btn-deepdive" id="btn-deepdive" type="button">🔍 キャリア課題を深掘りする（3問）</button>
      </div>
      <div id="deepdive-placeholder"></div>
    </div>`;
    return html;
  }

  function _buildDeepDiveQuestions() {
    const qs = [
      { id: 'ai_feeling', text: 'AIの台頭についてどう感じていますか？', opts: [
        { v: 'threat',      e: '😰', l: '危機感を感じている' },
        { v: 'opportunity', e: '🚀', l: 'チャンスと捉えている' },
        { v: 'neutral',     e: '😐', l: 'あまり関係ないと思っている' }
      ]},
      { id: 'career_goal', text: '5年後のキャリアとして一番近いのは？', opts: [
        { v: 'specialist',  e: '💎', l: 'スペシャリストとして技術を極める' },
        { v: 'management',  e: '👥', l: 'マネジメント・組織を引っ張る' },
        { v: 'freelance',   e: '🦅', l: 'フリーランス・独立' },
        { v: 'ai_coexist',  e: '🤖', l: 'AIと共存する新しいスキルを磨く' }
      ]},
      { id: 'salary_reason', text: '今の年収に不満な一番の理由は？', opts: [
        { v: 'undervalued', e: '😤', l: 'スキルが正当に評価されていない' },
        { v: 'company',     e: '🏢', l: '会社の規模・体制の問題' },
        { v: 'timing',      e: '⏳', l: '転職タイミングを逃してきた' },
        { v: 'unknown',     e: '🔍', l: '市場の相場を知らなかった' }
      ]}
    ];
    let html = `<div class="deepdive-section fade-in">
      <h3 class="deepdive-title">🎯 キャリア深掘り診断</h3>
      <p class="deepdive-subtitle">あと3問で、あなた専用のキャリアロードマップを作成します</p>`;
    qs.forEach((q, idx) => {
      html += `<div class="deepdive-q">
        <p class="deepdive-q-text"><span class="deepdive-q-num">${idx + 1}</span>${q.text}</p>
        <div class="deepdive-options">`;
      q.opts.forEach(o => {
        html += `<button class="deepdive-opt" data-q="${q.id}" data-val="${o.v}" type="button">
          <span class="deepdive-opt-emoji">${o.e}</span><span>${o.l}</span></button>`;
      });
      html += `</div></div>`;
    });
    html += `<button class="btn-generate-roadmap" id="btn-roadmap" type="button" disabled>ロードマップを生成する →</button>
    </div>`;
    return html;
  }

  function _bindDeepDiveEvents() {
    const deepAnswers = {};
    document.querySelectorAll('.deepdive-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        document.querySelectorAll(`.deepdive-opt[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        deepAnswers[q] = btn.dataset.val;
        const btnRoadmap = $('#btn-roadmap');
        if (btnRoadmap) {
          const ready = Object.keys(deepAnswers).length >= 3;
          btnRoadmap.disabled = !ready;
          if (ready) btnRoadmap.classList.add('ready');
        }
      });
    });
    const btnRoadmap = $('#btn-roadmap');
    if (btnRoadmap) {
      btnRoadmap.addEventListener('click', () => {
        if (Object.keys(deepAnswers).length < 3) return;
        const el = $('#deepdive-placeholder');
        el.innerHTML = _buildRoadmapSection(state.result, state.answers, deepAnswers);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // スコアバーアニメーション
        setTimeout(() => {
          el.querySelectorAll('.pa-bar, .pa-other-bar').forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }, 300);
      });
    }
  }

  // ========================================
  // エージェントスコアリング
  // ========================================
  function _scoreAgents(answers, deepAnswers, result) {
    const { role, experience, region, ageRange } = answers;
    const { career_goal, salary_reason } = deepAnswers || {};
    const estimated = result.estimated;

    return AGENT_PROFILES.map(agent => {
      let score = 0;
      const matchReasons = [];

      // 職種マッチ (25点)
      const roleVal = agent.roleScores[role] || 5;
      score += roleVal * 2.5;
      if (roleVal >= 9 && agent.matchReasonMap.role[role]) {
        matchReasons.push(agent.matchReasonMap.role[role]);
      }

      // 年齢マッチ (15点) ← 広告主データ反映
      if (ageRange) {
        const ageVal = agent.ageScores[ageRange] || 5;
        score += ageVal * 1.5;
        if (ageVal >= 10 && agent.matchReasonMap.age && agent.matchReasonMap.age[ageRange]) {
          matchReasons.push(agent.matchReasonMap.age[ageRange]);
        }
      } else {
        score += 7.5;
      }

      // 地域マッチ (10点) ← 広告主データ反映
      if (region) {
        score += (agent.regionScores[region] || 5) * 1.0;
      } else {
        score += 5;
      }

      // 経験年数マッチ (15点)
      score += (agent.expScores[experience] || 5) * 1.5;

      // キャリア目標マッチ (20点)
      if (career_goal) {
        const goalVal = agent.goalScores[career_goal] || 5;
        score += goalVal * 2;
        if (goalVal >= 9 && agent.matchReasonMap.goal[career_goal]) {
          matchReasons.push(agent.matchReasonMap.goal[career_goal]);
        }
      } else {
        score += 10;
      }

      // 年収帯マッチ (10点)
      if (estimated >= agent.salaryMin && estimated <= agent.salaryMax) score += 10;
      else if (estimated > agent.salaryMax) score += 3;
      else score += 7;

      // 不満理由マッチ (5点)
      if (salary_reason) {
        const reasonVal = agent.reasonScores[salary_reason] || 5;
        score += reasonVal * 0.5;
        if (reasonVal >= 9 && agent.matchReasonMap.reason[salary_reason]) {
          matchReasons.push(agent.matchReasonMap.reason[salary_reason]);
        }
      } else {
        score += 2.5;
      }

      // マッチ理由が少ない場合はfeatureで補完
      agent.features.forEach(f => { if (matchReasons.length < 2) matchReasons.push(f); });

      return { ...agent, matchScore: Math.min(Math.round(score), 99), matchReasons: matchReasons.slice(0, 3) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  // ========================================
  // エージェント レーダーチャート（SVG）
  // エンジニアが気にする6軸で評価
  // ========================================
  const AGENT_RADAR = {
    axes: ['技術理解度', '求人の質', '年収UP実績', '非公開求人', 'ハイクラス', '若手向け'],
    data: {
      levtech: [9, 9, 10, 9, 9, 7],
      geekly:  [7, 8,  7, 7, 5, 10],
      techgo:  [8, 9,  8, 8, 10, 5]
    }
  };

  function _buildRadarChart(agentId, color) {
    const size = 160;
    const cx = size / 2;
    const cy = size / 2;
    const r = 56;
    const labelR = r + 18;
    const axes = AGENT_RADAR.axes;
    const values = AGENT_RADAR.data[agentId] || [5,5,5,5,5,5];
    const n = axes.length;
    const step = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2;

    const ptAt = (val, i) => {
      const angle = startAngle + i * step;
      return { x: cx + (val / 10) * r * Math.cos(angle), y: cy + (val / 10) * r * Math.sin(angle) };
    };

    // Grid
    let grid = '';
    [0.25, 0.5, 0.75, 1].forEach(lvl => {
      const pts = axes.map((_, i) => {
        const angle = startAngle + i * step;
        return `${cx + lvl * r * Math.cos(angle)},${cy + lvl * r * Math.sin(angle)}`;
      }).join(' ');
      grid += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    });

    // Axis lines
    const axisLines = axes.map((_, i) => {
      const angle = startAngle + i * step;
      return `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(angle)}" y2="${cy + r * Math.sin(angle)}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
    }).join('');

    // Data polygon
    const dataPts = values.map((v, i) => { const p = ptAt(v, i); return `${p.x},${p.y}`; }).join(' ');
    const dataPolygon = `<polygon points="${dataPts}" fill="${color}33" stroke="${color}" stroke-width="2"/>`;
    const dataDots = values.map((v, i) => {
      const p = ptAt(v, i);
      return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`;
    }).join('');

    // Labels
    const labels = axes.map((ax, i) => {
      const angle = startAngle + i * step;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.55)" font-size="8.5" font-family="sans-serif">${ax}</text>`;
    }).join('');

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${grid}${axisLines}${dataPolygon}${dataDots}${labels}</svg>`;
  }

  // ========================================
  // パーソナライズドエージェントランキング表示
  // ========================================
  function _buildPersonalizedAgentSection(scoredAgents) {
    const medals = ['🥇', '🥈', '🥉'];
    const top = scoredAgents[0];
    const others = scoredAgents.slice(1);

    let html = `<div class="personalized-agents fade-in">
      <h3 class="pa-title">🏆 あなたに最適なエージェントランキング</h3>
      <p class="pa-subtitle">診断結果とキャリア目標をもとにスコアリングしました</p>

      <div class="pa-top-agent" style="--agent-color: ${top.color}">
        <div class="pa-top-header">
          <div class="pa-top-left">
            <span class="pa-medal">${medals[0]}</span>
            <div>
              <div class="pa-top-name">${top.name}</div>
              <div class="pa-top-tagline">${top.tagline}</div>
            </div>
          </div>
          <div class="pa-top-score">
            <span class="pa-score-num">${top.matchScore}</span>
            <span class="pa-score-unit">点</span>
          </div>
        </div>
        <div class="pa-bar-wrap">
          <div class="pa-bar" style="width:0%" data-width="${top.matchScore}%"></div>
        </div>
        <div class="pa-top-body">
          <div class="pa-radar-wrap">${_buildRadarChart(top.id, top.color)}</div>
          <div class="pa-top-right">
            <div class="pa-reasons">
              ${top.matchReasons.map(r => `<div class="pa-reason"><span class="pa-check">✓</span><span>${r}</span></div>`).join('')}
            </div>
            <a href="${top.url}" class="btn-pa-top" target="_blank" rel="noopener" data-agent="${top.id}">
              無料でキャリア相談してみる →
            </a>
            <p class="pa-note">※ 登録無料・転職しなくても利用OK</p>
          </div>
        </div>
      </div>

      <div class="pa-others">
        ${others.map((agent, i) => `
          <a href="${agent.url}" class="pa-other-card" target="_blank" rel="noopener" data-agent="${agent.id}" style="--agent-color: ${agent.color}">
            <div class="pa-other-radar">${_buildRadarChart(agent.id, agent.color)}</div>
            <div class="pa-other-info">
              <div class="pa-other-medal-name">
                <span class="pa-other-medal">${medals[i + 1]}</span>
                <span class="pa-other-name">${agent.name}</span>
                <span class="pa-other-score">${agent.matchScore}<span>点</span></span>
              </div>
              <div class="pa-other-bar-wrap">
                <div class="pa-other-bar" style="width:0%" data-width="${agent.matchScore}%"></div>
              </div>
            </div>
          </a>`).join('')}
      </div>
    </div>`;

    return html;
  }

  function _generateRoadmap(result, answers, deepAnswers) {
    const { ai_feeling, career_goal, salary_reason } = deepAnswers;
    const exp = answers.experience;
    const target = result.estimated + Math.max(result.gap, 0);

    const step1 = (() => {
      if (salary_reason === 'unknown' || salary_reason === 'timing') return {
        period: '今すぐ（1ヶ月以内）', title: '市場価値を正確に把握する',
        desc: '転職エージェントに登録して、非公開求人ベースの市場価値を確認しましょう。',
        actions: ['転職エージェントに無料登録', '職務経歴書を最新化', 'スカウトを受け取って相場を把握']
      };
      if (salary_reason === 'undervalued') return {
        period: '今すぐ（1ヶ月以内）', title: 'スキルの可視化・言語化',
        desc: 'スキルが評価されない原因の多くは職務経歴書の書き方にあります。',
        actions: ['GitHubポートフォリオの整備', '職務経歴書に定量実績を記載', 'エージェントによる添削を受ける']
      };
      return {
        period: '今すぐ（1ヶ月以内）', title: '転職市場の情報収集',
        desc: '現在の市場感を把握することから始めましょう。',
        actions: ['転職エージェントに相談して求人傾向を把握', '同職種・同経験の年収レンジを確認', '気になる企業をリストアップ']
      };
    })();

    const step2 = (() => {
      if (career_goal === 'specialist') return {
        period: '3〜6ヶ月', title: 'スキルアップ × 転職活動の並行',
        desc: '専門性を高めながら転職活動を進めることで、より条件の良いオファーを引き出せます。',
        actions: ['狙うポジションに必要なスキルを特定', '資格取得 or OSS活動でポートフォリオ強化', '月2〜3社ペースで面接経験を積む']
      };
      if (career_goal === 'management') return {
        period: '3〜6ヶ月', title: 'リーダー経験の積み上げ',
        desc: 'テックリード・マネージャー候補としての実績が年収交渉の武器になります。',
        actions: ['現職でのリード経験を意識的に作る', 'マネジメント職・リード求人を中心に活動', '年収+100〜200万円の求人に絞る']
      };
      if (career_goal === 'ai_coexist') return {
        period: '3〜6ヶ月', title: 'AI活用スキルの習得',
        desc: 'AI系求人は急増中。LLMアプリ開発やAI活用スキルが高評価につながります。',
        actions: ['LLM/RAGの基礎学習（1〜2ヶ月）', 'AI×専門領域で副業 or OSSプロジェクト', 'AI活用実績を職務経歴書に追加']
      };
      return {
        period: '3〜6ヶ月', title: 'フリーランス・独立の準備',
        desc: '転職で年収を上げながら副業実績を積み、独立への足場を作りましょう。',
        actions: ['転職で年収ベースを上げる', '副業でクライアント獲得の実績を作る', 'フリーランス市場での単価感を把握する']
      };
    })();

    const targetStr = Math.round(target / 10) * 10;
    const step3 = (() => {
      if (ai_feeling === 'opportunity') return {
        period: '1年後', title: `AI×専門性で市場最高水準へ`,
        desc: `AI活用を武器にしたエンジニアは市場で引く手あまた。年収${targetStr}万円以上を現実的な目標にできます。`,
        actions: null
      };
      if (ai_feeling === 'threat') return {
        period: '1年後', title: 'AI時代に不可欠なエンジニアへ',
        desc: `AIに代替されない設計力・チームリード力を強みにすることで、年収${targetStr}万円以上の安定したポジションを目指せます。`,
        actions: null
      };
      return {
        period: '1年後', title: `年収${targetStr}万円の達成`,
        desc: `今動き出すことで、1年後の年収アップは現実的な目標になります。まずは第一歩を踏み出しましょう。`,
        actions: null
      };
    })();

    return [step1, step2, step3];
  }

  function _buildRoadmapSection(result, answers, deepAnswers) {
    const steps = _generateRoadmap(result, answers, deepAnswers);
    let html = `<div class="roadmap-section fade-in">
      <h3 class="roadmap-title">🗺️ あなた専用のキャリアロードマップ</h3>
      <div class="roadmap-steps">`;
    steps.forEach((s, i) => {
      html += `<div class="roadmap-step">
        <div class="roadmap-step-header">
          <span class="roadmap-step-num">${i + 1}</span>
          <span class="roadmap-step-period">${s.period}</span>
        </div>
        <h4 class="roadmap-step-title">${s.title}</h4>
        <p class="roadmap-step-desc">${s.desc}</p>
        ${s.actions ? `<ul class="roadmap-actions">${s.actions.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
    html += `</div>
    </div>`;
    html += _buildPersonalizedAgentSection(_scoreAgents(answers, deepAnswers, result));
    html += `</div>`;
    return html;
  }

  // ========================================
  // やらない理由潰しセクション
  // ========================================
  function _buildObjectionSection() {
    const timing = state.answers.transferTiming;
    const satisfaction = state.answers.jobSatisfaction;
    const pastTransfers = state.answers.pastTransfers;
    const isDetailed = state.answers.isDetailed;

    // 全候補
    const ALL_OBJECTIONS = {
      noComplaint: {
        q: '「今の会社に不満はないし、わざわざ転職活動するのは面倒…」',
        a: '転職活動 ≠ 転職。市場価値を知ることは、今の会社での交渉材料にもなります。エージェントとの面談だけなら30分〜1時間。リスクゼロで現状確認ができます。',
        stat: '面談のみで年収交渉に成功した人: 全体の18%'
      },
      busy: {
        q: '「忙しくて転職活動する時間がない…」',
        a: 'エージェントが求人選定・日程調整・書類作成まで代行してくれます。多くの方は現職を続けながら、週1-2時間の隙間時間だけで転職を成功させています。',
        stat: '在職中に転職成功した人の割合: 約83%'
      },
      skillAnxiety: {
        q: '「スキルに自信がない。本当に年収が上がるの？」',
        a: 'あなたが「当たり前」だと思っているスキルが、別の企業では高く評価されることは非常に多いです。特にSES→自社開発、SIer→メガベンチャーのようなキャリアチェンジでは大幅UPの実績が豊富です。',
        stat: 'エージェント経由の転職者の年収UP率: 約76%'
      },
      tooManyTransfers: {
        q: '「転職回数が多いとマイナスにならない？」',
        a: 'IT業界では転職回数よりもスキルと経験の質が重視されます。むしろ複数環境での経験は「適応力が高い」とプラス評価される傾向にあります。',
        stat: '転職3回以上で年収600万超のエンジニア: 全体の42%'
      }
    };

    let selected;

    if (isDetailed) {
      // しっかり診断: 回答に基づいて最も刺さる2つだけを選択
      selected = [];

      // 満足度が高い or まだ考えてない → 「不満ない」パターン
      if (satisfaction === 'high' || satisfaction === 'very_high' || timing === 'not_now' || timing === 'future') {
        selected.push(ALL_OBJECTIONS.noComplaint);
      }
      // 不満あり → スキル不安
      if (satisfaction === 'very_low' || satisfaction === 'low') {
        selected.push(ALL_OBJECTIONS.skillAnxiety);
      }
      // 転職回数3+
      if (pastTransfers === '3+') {
        selected.push(ALL_OBJECTIONS.tooManyTransfers);
      }
      // 積極活動中・オープン → 忙しい
      if (timing === 'active' || timing === 'open') {
        selected.push(ALL_OBJECTIONS.busy);
      }

      // 2つに満たない場合は補填
      const allKeys = ['noComplaint', 'busy', 'skillAnxiety', 'tooManyTransfers'];
      for (const key of allKeys) {
        if (selected.length >= 2) break;
        const obj = ALL_OBJECTIONS[key];
        if (!selected.includes(obj)) selected.push(obj);
      }
      selected = selected.slice(0, 2);
    } else {
      // サクッと診断: 全4つ表示
      selected = Object.values(ALL_OBJECTIONS);
    }

    let html = `
      <div class="objection-section">
        <div class="objection-header">
          <h3>「でも…」と思っていませんか？</h3>
          <p>よくある不安に、データで答えます</p>
        </div>
        <div class="objection-items">`;

    selected.forEach(obj => {
      html += `
        <div class="objection-item">
          <div class="objection-q">
            <span class="objection-q-icon">?</span>
            <span>${obj.q}</span>
          </div>
          <div class="objection-a">
            ${obj.a}
            <span class="objection-stat">${obj.stat}</span>
          </div>
        </div>`;
    });

    html += `</div></div>`;
    return html;
  }

  // ========================================
  // ポジション例セクション
  // ========================================
  function _buildPositionSection(result) {
    const positions = SalaryData.getPositionExamples(state.answers.role, result.estimated);
    if (!positions || positions.length === 0) return '';

    let html = `
      <div class="position-section">
        <h3>あなたに合うポジション例</h3>
        <p class="position-section-sub">診断結果をもとにした求人イメージです（参考）</p>
        <div class="position-list">`;

    positions.forEach(p => {
      const remoteTag = p.remote
        ? '<span class="position-tag tag-remote">リモート可</span>'
        : '<span class="position-tag tag-office">出社あり</span>';
      html += `
        <div class="position-card">
          <div class="position-card-top">
            <span class="position-company">${p.company}</span>
            ${remoteTag}
          </div>
          <p class="position-title">${p.position}</p>
          <p class="position-note">${p.note}</p>
          <div class="position-salary">
            <span class="position-salary-label">想定年収</span>
            <span class="position-salary-range">${p.min}万 〜 ${p.max}万円</span>
          </div>
        </div>`;
    });

    html += `
        </div>
        <p class="position-disclaimer">※ 上記は市場データに基づく参考例です。実際の求人はエージェントにご相談ください。</p>
      </div>`;

    return html;
  }

  // ========================================
  // エージェント推薦セクション（バナー付き）
  // ========================================
  function _buildAgentSection(result) {
    const agents = result.recommendedAgents;
    const topAgent = agents[0];

    let html = `
      <div class="result-agents" id="agent-recommendations">
        <div class="result-agents-head">
          <span class="result-agents-badge">Step 3</span>
          <h3>登録するなら、この順番がおすすめです</h3>
          <p class="result-agents-lead">最初は 1〜2社で十分です。まずは <strong>${topAgent.name}</strong> で相場を確認し、もう1社を比較用に追加すると求人の見え方がかなり変わります。</p>
          <div class="result-agents-trust">
            <span>登録無料</span>
            <span>相談だけでもOK</span>
            <span>年収交渉を代行</span>
          </div>
        </div>
        <div class="agents-list">`;

    agents.forEach((agent, i) => {
      const bannerClass = 'agent-banner-' + agent.id;
      const bannerText = {
        levtech: 'レバテックキャリア',
        geekly: 'Geekly',
        techgo: 'テックゴー'
      }[agent.id] || agent.name;

      const matchLabel = i === 0
        ? '<span class="agent-badge agent-badge-match">最初に登録</span>'
        : '<span class="agent-badge agent-badge-sub">比較候補</span>';

      html += `
        <a href="${agent.url}" class="agent-card${i === 0 ? ' agent-card-primary' : ''}" target="_blank" rel="noopener" data-agent="${agent.id}" style="--agent-color: ${agent.color}">
          <div class="agent-banner ${bannerClass}">
            ${bannerText}
          </div>
          <div class="agent-body">
            <div class="agent-rank">${i + 1}</div>
            <div class="agent-info">
              ${matchLabel}
              <h4>${agent.name}</h4>
              <p class="agent-desc">${agent.description}</p>
              <p class="agent-reason">${agent.reason}</p>
            </div>
          </div>
          <div class="agent-cta-wrap">
            <span class="agent-btn">${i === 0 ? '無料登録して求人を見てみる' : '比較候補として見てみる'}</span>
          </div>
        </a>`;
    });

    html += `</div>
      <p class="result-agents-footnote">※ 1社だけだと比較がしづらいため、「1位 + 気になる1社」の2社登録が最も動きやすい設計です。</p>
    </div>`;
    return html;
  }

  // ========================================
  // ヒストグラム描画
  // ========================================
  function _buildHistogram(result) {
    const dist = result.distribution;
    if (!dist || !dist.bins.length) return '<p>分布データなし</p>';

    let html = `<div class="histogram-wrap">`;
    html += `<p class="histogram-title">${dist.roleName}の年収分布</p>`;
    html += `<div class="histogram-legend">`;
    if (result.currentSalary > 0 && dist.userPercentile !== null) {
      html += `<span class="legend-item legend-current">あなた: 上位${100 - dist.userPercentile}%</span>`;
    }
    html += `<span class="legend-item legend-estimated">適正年収: 上位${100 - dist.estPercentile}%</span>`;
    html += `</div>`;

    html += `<div class="histogram-chart">`;
    dist.bins.forEach(bin => {
      const heightPct = Math.max(bin.density * 100, 4);
      let barClass = 'hist-bar';
      let marker = '';
      if (bin.containsEstimated) {
        barClass += ' hist-bar-estimated';
        marker = '<span class="hist-marker hist-marker-est">適正</span>';
      }
      if (bin.containsUser) {
        barClass += ' hist-bar-user';
        marker += '<span class="hist-marker hist-marker-you">現在</span>';
      }
      html += `
        <div class="hist-col">
          <div class="hist-markers">${marker}</div>
          <div class="${barClass}" style="height: 0%" data-height="${heightPct}%"></div>
          <span class="hist-label">${bin.label}</span>
        </div>`;
    });
    html += `</div>`;
    html += `<p class="histogram-note">同職種・同経験年数のエンジニア母集団における推定分布</p>`;
    html += `</div>`;
    return html;
  }

  // ========================================
  // カルーセル制御
  // ========================================
  function _initCarousel() {
    $$('.carousel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.carousel-tab').forEach(t => t.classList.remove('active'));
        $$('.carousel-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = $(`.carousel-panel[data-panel="${tab.dataset.tab}"]`);
        if (panel) {
          panel.classList.add('active');
          // ヒストグラムのバーをアニメーション
          if (tab.dataset.tab === 'histogram') {
            setTimeout(() => {
              panel.querySelectorAll('.hist-bar').forEach(bar => {
                bar.style.height = bar.dataset.height;
              });
            }, 50);
          }
        }
      });
    });
  }

  // ========================================
  // なぜエージェントが必要か
  // ========================================
  function _buildWhyAgentSection(result, answers) {
    const topAgent = result.recommendedAgents[0];
    const roleLabel = _getRoleDisplayName(answers.role);
    const gap = result.gap || 0;
    const rangeText = `${result.rangeLow}〜${result.rangeHigh}万円`;
    const reasonOne = gap > 0
      ? `いまの年収と適正年収の差は ${gap}万円。企業は現年収ベースで提示しがちですが、エージェントが市場相場 ${rangeText} を根拠に入ると、提示額の上振れを狙いやすくなります。`
      : `今の年収はすでに市場平均以上ですが、より上位のポジションや裁量の大きい求人は表に出にくいことが多いです。エージェント経由のほうが次の一段上を探しやすくなります。`;
    const reasonTwo = topAgent
      ? `${topAgent.name} のような専門エージェントは、${roleLabel}向けの求人や非公開ポジションをまとめて見せてくれます。公開求人だけ見ている状態より、比較材料が一気に増えます。`
      : `${roleLabel}向けの求人は、公開案件だけで市場全体を把握しきれません。エージェント経由で非公開求人まで見える状態を作ると、選択肢が広がります。`;

    return `
      <div class="why-agent-section">
        <div class="why-agent-header">
          <span class="why-agent-badge">Why Agent</span>
          <h3>ロードマップの最初の一手が「エージェント登録」な理由</h3>
          <p class="why-agent-lead">診断結果のあとに必要なのは、情報を増やすことではなく「相場を持って動くこと」です。だから先に、求人と交渉の両方を見られる状態を作ります。</p>
        </div>
        <div class="why-agent-list">
          <div class="why-agent-item">
            <div class="why-agent-num">1</div>
            <div class="why-agent-content">
              <h4>年収レンジを上げる交渉材料になる</h4>
              <p>${reasonOne}</p>
            </div>
          </div>
          <div class="why-agent-item">
            <div class="why-agent-num">2</div>
            <div class="why-agent-content">
              <h4>${roleLabel}向けの非公開求人まで見える</h4>
              <p>${reasonTwo}</p>
            </div>
          </div>
          <div class="why-agent-item">
            <div class="why-agent-num">3</div>
            <div class="why-agent-content">
              <h4>準備と比較を同時に進められる</h4>
              <p>求人選定、書類添削、面接日程の調整、オファー条件の確認までをまとめて進められます。忙しい中でも動きやすく、比較検討に必要な情報が早く揃います。</p>
            </div>
          </div>
        </div>
        <div class="why-agent-cta">
          <p>まずはおすすめ順を見て、1〜2社だけ登録するのが最も負荷の少ない進め方です。</p>
          <button class="btn-why-agent" data-scroll-target="agent-recommendations" type="button">おすすめエージェントを見る</button>
        </div>
      </div>`;
  }

  // ========================================
  // 結果アニメーション
  // ========================================
  function _animateResult(result) {
    // レンジ数字のカウントアップアニメーション
    const lowEl = $('.range-low');
    const highEl = $('.range-high');
    if (lowEl) _countUp(lowEl, 0, result.rangeLow, 1200);
    if (highEl) _countUp(highEl, 0, result.rangeHigh, 1400);
    setTimeout(() => {
      $$('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 500);
    _initCarousel();
  }

  function _countUp(el, from, to, duration) {
    const start = performance.now();
    const diff = to - from;
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(from + diff * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ========================================
  // スプレッドシートへのデータ送信
  // ========================================
  function _submitToSheet(result) {
    if (!GAS_ENDPOINT) return;  // 未設定なら何もしない

    const payload = {
      mode: state.mode,
      answers: state.answers,
      result: {
        estimated: result.estimated,
        rangeLow: result.rangeLow,
        rangeHigh: result.rangeHigh,
        gap: result.gap,
        recommendedAgents: result.recommendedAgents.map(a => ({ name: a.name }))
      },
      userAgent: navigator.userAgent
    };

    // 非同期で送信（結果画面の表示をブロックしない）
    fetch(GAS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',  // GASはCORS非対応のためno-cors
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // 送信失敗しても診断結果の表示には影響させない
    });
  }

  return { init, handleOAuthCallback };
})();

document.addEventListener('DOMContentLoaded', () => {
  // GitHub OAuthコールバックの検知（URLに ?code= が含まれる場合）
  const params = new URLSearchParams(window.location.search);
  const code  = params.get('code');
  const state = params.get('state');

  if (code && state) {
    // URLからパラメータを消去してからコールバック処理
    window.history.replaceState({}, '', window.location.pathname);
    App.handleOAuthCallback(code, state);
  } else {
    App.init();
  }
});
