/**
 * ITエンジニア年収診断 - 年収データ & 算出ロジック
 *
 * データソース:
 * - doda エンジニア年収ランキング 2024
 * - 求人ボックス 給与ナビ
 * - レバテック フリーランス案件相場
 * - 経済産業省 IT人材白書
 * - Stack Overflow Developer Survey (日本データ)
 */

const SalaryData = (() => {

  // ========================================
  // ベース年収テーブル（職種 × 経験年数）
  // 単位: 万円 / 中央値ベース
  // ========================================
  const BASE_SALARY = {
    frontend: {
      '1-2': 300, '3-4': 370, '5-7': 450, '8-10': 520, '11+': 590
    },
    backend: {
      '1-2': 320, '3-4': 400, '5-7': 480, '8-10': 560, '11+': 630
    },
    fullstack: {
      '1-2': 330, '3-4': 415, '5-7': 500, '8-10': 580, '11+': 650
    },
    mobile: {
      '1-2': 315, '3-4': 395, '5-7': 475, '8-10': 555, '11+': 615
    },
    infra: {
      '1-2': 315, '3-4': 395, '5-7': 480, '8-10': 570, '11+': 640
    },
    sre: {
      '1-2': 350, '3-4': 440, '5-7': 530, '8-10': 615, '11+': 700
    },
    data_engineer: {
      '1-2': 340, '3-4': 430, '5-7': 520, '8-10': 605, '11+': 685
    },
    ml_engineer: {
      '1-2': 370, '3-4': 460, '5-7': 555, '8-10': 650, '11+': 750
    },
    security: {
      '1-2': 335, '3-4': 420, '5-7': 510, '8-10': 615, '11+': 700
    },
    pm: {
      '1-2': 350, '3-4': 440, '5-7': 545, '8-10': 640, '11+': 730
    },
    qa: {
      '1-2': 290, '3-4': 360, '5-7': 430, '8-10': 500, '11+': 560
    },
    embedded: {
      '1-2': 310, '3-4': 380, '5-7': 460, '8-10': 535, '11+': 605
    }
  };

  // ========================================
  // 技術スタック係数
  // 市場需給バランスに基づく補正
  // ========================================
  const TECH_MULTIPLIERS = {
    // 言語
    javascript:  1.00,
    typescript:  1.06,
    python:      1.05,
    go:          1.12,
    rust:        1.15,
    java:        1.00,
    kotlin:      1.05,
    swift:       1.04,
    php:         0.94,
    ruby:        0.98,
    csharp:      0.98,
    cpp:         1.03,
    scala:       1.10,
    elixir:      1.08,

    // フレームワーク / ツール
    react:       1.04,
    vue:         1.02,
    angular:     1.01,
    nextjs:      1.06,
    nuxt:        1.03,
    rails:       0.98,
    spring:      1.02,
    django:      1.03,
    fastapi:     1.05,
    laravel:     0.95,
    flutter:     1.04,
    react_native: 1.03,

    // インフラ / クラウド
    aws:         1.06,
    gcp:         1.07,
    azure:       1.04,
    kubernetes:  1.10,
    docker:      1.03,
    terraform:   1.08,

    // データ / ML
    spark:       1.08,
    pytorch:     1.12,
    tensorflow:  1.08,
    bigquery:    1.05,
    snowflake:   1.06
  };

  // ========================================
  // 企業規模係数
  // ========================================
  const COMPANY_SIZE_MULTIPLIER = {
    startup_early:  0.88,  // スタートアップ（〜30名）
    startup_growth: 0.95,  // スタートアップ（30〜100名）
    mid:            1.00,  // 中堅（100〜500名）
    mega_venture:   1.08,  // メガベンチャー（500名〜）
    large:          1.05,  // 大手SIer・事業会社
    foreign:        1.22,  // 外資系
    freelance:      1.15   // フリーランス（※社会保険等自己負担込み）
  };

  // ========================================
  // 勤務地域係数
  // ========================================
  const REGION_MULTIPLIER = {
    tokyo:    1.08,
    kanagawa: 1.03,
    osaka:    0.98,
    nagoya:   0.96,
    fukuoka:  0.93,
    remote:   1.04,  // フルリモート（本社所在地問わず）
    other:    0.90
  };

  // ========================================
  // マネジメント経験係数
  // ========================================
  const MANAGEMENT_MULTIPLIER = {
    none:     1.00,
    lead:     1.06,  // TL / 数名のリード
    manager:  1.14,  // 10名以上マネジメント
    director: 1.25   // 部門長レベル
  };

  // ========================================
  // 学歴係数（微補正のみ）
  // ========================================
  const EDUCATION_MULTIPLIER = {
    highschool:   0.96,
    vocational:   0.98,  // 専門学校
    bachelor:     1.00,
    master:       1.05,
    phd:          1.10,
    dropout:      0.97,  // 中退
    self_taught:  0.98
  };

  // ========================================
  // 詳細診断用: 資格係数（加算方式）
  // ========================================
  const CERTIFICATION_BONUS = {
    aws_saa:       8,   // AWS Solutions Architect Associate
    aws_sap:       18,  // AWS Solutions Architect Professional
    aws_devops:    15,
    gcp_pca:       15,  // GCP Professional Cloud Architect
    gcp_pde:       18,  // GCP Professional Data Engineer
    azure_admin:   8,
    ipa_fe:        3,   // 基本情報技術者
    ipa_ap:        5,   // 応用情報技術者
    ipa_db:        8,   // データベーススペシャリスト
    ipa_nw:        8,   // ネットワークスペシャリスト
    ipa_sc:        10,  // 情報処理安全確保支援士
    ipa_sa:        12,  // システムアーキテクト
    ipa_pm:        15,  // プロジェクトマネージャ
    ckad:          12,  // Kubernetes
    cka:           15,
    cissp:         20,
    pmp:           12,
    none:          0
  };

  // ========================================
  // 詳細診断用: 英語力係数
  // ========================================
  const ENGLISH_MULTIPLIER = {
    none:        1.00,
    reading:     1.02,  // 読み書き程度
    business:    1.08,  // ビジネスレベル
    native:      1.15   // ネイティブ / バイリンガル
  };

  // ========================================
  // 詳細診断用: 技術レベル補正
  // ========================================
  const SKILL_LEVEL_MULTIPLIER = {
    junior:      0.90,
    mid:         1.00,
    senior:      1.10,
    architect:   1.20,
    principal:   1.30
  };

  // ========================================
  // 詳細診断用: 業界係数
  // ========================================
  const INDUSTRY_MULTIPLIER = {
    web_service:  1.05,
    ec:           1.02,
    fintech:      1.10,
    healthcare:   1.03,
    gaming:       1.00,
    ad_media:     1.03,
    sier:         0.95,
    ses:          0.88,
    consulting:   1.08,
    other_ind:    0.96
  };

  // ========================================
  // 詳細診断用: 開発プロセス経験ボーナス（万円加算）
  // ========================================
  const DEVPROCESS_BONUS = {
    agile: 3, ci_cd: 5, code_review: 2, tdd: 4,
    devops: 5, monitoring: 4, incident: 5, ddd: 4
  };

  // ========================================
  // 年収算出ロジック
  // ========================================
  function calculate(answers) {
    // 1) ベース年収取得
    const role = answers.role;
    const experience = answers.experience;
    let base = BASE_SALARY[role]?.[experience] || 450;

    // 2) 技術スタック補正（選択されたスキルの平均値）
    const techSkills = answers.techStack || [];
    let techMultiplier = 1.0;
    if (techSkills.length > 0) {
      const sum = techSkills.reduce((acc, skill) => {
        return acc + (TECH_MULTIPLIERS[skill] || 1.0);
      }, 0);
      techMultiplier = sum / techSkills.length;
      // 複数の高需要スキルを持つ場合のボーナス（最大+5%）
      const highDemandCount = techSkills.filter(s => (TECH_MULTIPLIERS[s] || 1.0) >= 1.08).length;
      if (highDemandCount >= 2) {
        techMultiplier += 0.02 * Math.min(highDemandCount - 1, 3);
      }
    }

    // 3) 企業規模補正
    const companyMultiplier = COMPANY_SIZE_MULTIPLIER[answers.companySize] || 1.0;

    // 4) 地域補正
    const regionMultiplier = REGION_MULTIPLIER[answers.region] || 1.0;

    // 5) マネジメント補正
    const mgmtMultiplier = MANAGEMENT_MULTIPLIER[answers.management] || 1.0;

    // 6) 学歴補正
    const eduMultiplier = EDUCATION_MULTIPLIER[answers.education] || 1.0;

    // 7) 詳細診断の追加補正
    let certBonus = 0;
    let englishMultiplier = 1.0;
    let skillLevelMultiplier = 1.0;

    let industryMultiplier = 1.0;
    let devProcessBonus = 0;

    if (answers.isDetailed) {
      // 資格ボーナス（万円加算）
      const certs = answers.certifications || [];
      certBonus = certs.reduce((acc, cert) => acc + (CERTIFICATION_BONUS[cert] || 0), 0);
      certBonus = Math.min(certBonus, 50);

      // 英語力
      englishMultiplier = ENGLISH_MULTIPLIER[answers.english] || 1.0;

      // 技術レベル
      skillLevelMultiplier = SKILL_LEVEL_MULTIPLIER[answers.skillLevel] || 1.0;

      // 業界
      industryMultiplier = INDUSTRY_MULTIPLIER[answers.companyIndustry] || 1.0;

      // 開発プロセス
      const procs = answers.devProcess || [];
      devProcessBonus = procs.reduce((acc, p) => acc + (DEVPROCESS_BONUS[p] || 0), 0);
      devProcessBonus = Math.min(devProcessBonus, 25);
    }

    // 算出
    const calculated = Math.round(
      base * techMultiplier * companyMultiplier * regionMultiplier *
      mgmtMultiplier * eduMultiplier * englishMultiplier * skillLevelMultiplier *
      industryMultiplier
    ) + certBonus + devProcessBonus;

    // レンジ算出（±12%）
    const rangeLow = Math.round(calculated * 0.88);
    const rangeHigh = Math.round(calculated * 1.12);

    // 市場相場との比較
    const currentSalary = answers.currentSalary || 0;
    const gap = calculated - currentSalary;

    return {
      estimated: calculated,
      rangeLow: rangeLow,
      rangeHigh: rangeHigh,
      currentSalary: currentSalary,
      gap: gap,
      gapPercent: currentSalary > 0 ? Math.round((gap / currentSalary) * 100) : 0,
      factors: _buildFactors({
        base, techMul: techMultiplier, compMul: companyMultiplier,
        regionMul: regionMultiplier, mgmtMul: mgmtMultiplier,
        eduMul: eduMultiplier, englishMul: englishMultiplier,
        skillMul: skillLevelMultiplier, industryMul: industryMultiplier,
        certBonus, devProcessBonus, calculated
      }),
      distribution: _generateDistribution(role, experience, calculated, currentSalary),
      marketInsight: _getMarketInsight(role, experience, calculated),
      recommendedAgents: _recommendAgents(answers)
    };
  }

  // ========================================
  // 診断結果の内訳要因
  // ========================================
  function _buildFactors(params) {
    const { base, techMul, compMul, regionMul, mgmtMul,
            eduMul, englishMul, skillMul, industryMul,
            certBonus, devProcessBonus, calculated } = params;
    const factors = [];

    factors.push({ label: '職種 × 経験年数', value: base + '万円', description: 'ベース年収' });

    const addMulFactor = (label, mul, posDesc, negDesc) => {
      if (Math.abs(mul - 1.0) < 0.005) return;
      const pct = Math.round((mul - 1) * 100);
      factors.push({
        label, value: (pct > 0 ? '+' : '') + pct + '%',
        description: mul > 1 ? posDesc : negDesc,
        positive: mul > 1
      });
    };

    addMulFactor('技術スタック', techMul, '市場需要の高いスキルセット', '市場需要がやや落ち着いている技術');
    addMulFactor('企業規模', compMul, '規模による上乗せ', '規模による調整');
    addMulFactor('勤務地域', regionMul, '地域プレミアム', '地域差による調整');
    addMulFactor('マネジメント', mgmtMul, '管理職・リード経験', 'IC（個人貢献者）');
    addMulFactor('学歴', eduMul, '学歴加算', '学歴による調整');
    addMulFactor('業界', industryMul, '高年収業界のプレミアム', '業界水準による調整');
    addMulFactor('技術レベル', skillMul, 'シニアレベルの上乗せ', '経験レベルによる調整');
    addMulFactor('英語力', englishMul, '英語力プレミアム', '英語力による調整');

    if (certBonus > 0) {
      factors.push({ label: '保有資格', value: '+' + certBonus + '万円', description: '資格によるボーナス加算', positive: true });
    }
    if (devProcessBonus > 0) {
      factors.push({ label: '開発プロセス経験', value: '+' + devProcessBonus + '万円', description: 'モダン開発プラクティスの経験', positive: true });
    }

    // 合計行
    factors.push({ label: '算出結果', value: calculated + '万円', description: '上記要因を掛け合わせた推定適正年収', isTotal: true });

    return factors;
  }

  // ========================================
  // 市場インサイト生成
  // ========================================
  function _getMarketInsight(role, experience, estimated) {
    const insights = [];

    const hotRoles = ['sre', 'ml_engineer', 'security', 'data_engineer'];
    if (hotRoles.includes(role)) {
      insights.push('現在、' + _getRoleName(role) + 'は市場で特に需要が高く、好条件のオファーが期待できます。');
    }

    if (experience === '1-2') {
      insights.push('経験年数が浅い段階では、スキルの幅を広げることで年収レンジが大きく変わります。');
    } else if (experience === '8-10' || experience === '11+') {
      insights.push('シニアレベルでは、技術力に加えてマネジメント経験や事業貢献度が年収を左右します。');
    }

    if (estimated >= 700) {
      insights.push('このレンジでは外資系やメガベンチャーからのオファーも十分視野に入ります。');
    }

    if (insights.length === 0) {
      insights.push('転職市場は経験者に有利な売り手市場が続いています。スキルの棚卸しが年収UPの第一歩です。');
    }

    return insights;
  }

  function _getRoleName(role) {
    const names = {
      frontend: 'フロントエンドエンジニア',
      backend: 'バックエンドエンジニア',
      fullstack: 'フルスタックエンジニア',
      mobile: 'モバイルエンジニア',
      infra: 'インフラエンジニア',
      sre: 'SRE',
      data_engineer: 'データエンジニア',
      ml_engineer: '機械学習エンジニア',
      security: 'セキュリティエンジニア',
      pm: 'エンジニアリングマネージャー / PM',
      qa: 'QAエンジニア',
      embedded: '組み込みエンジニア'
    };
    return names[role] || role;
  }

  // ========================================
  // エージェント推薦ロジック
  // ========================================
  function _recommendAgents(answers) {
    const agents = [];
    const exp = answers.experience;
    const role = answers.role;
    const estimated = answers._estimated || 500;

    // レバテックキャリア: 幅広くカバー、特にWeb系に強い
    agents.push({
      id: 'levtech',
      name: 'レバテックキャリア',
      description: 'ITエンジニア・クリエイター専門。求人数業界最大級。',
      reason: _getLevtechReason(role, exp),
      url: '#levtech-affiliate',  // アフィリエイトURL（後で差し替え）
      color: '#00C853',
      priority: _getLevtechPriority(role, exp)
    });

    // Geekly: IT・Web・ゲーム特化、年収UP実績が高い
    agents.push({
      id: 'geekly',
      name: 'Geekly',
      description: 'IT・Web・ゲーム業界特化。年収UP率81%の実績。',
      reason: _getGeeklyReason(role, exp),
      url: '#geekly-affiliate',
      color: '#2979FF',
      priority: _getGeeklyPriority(role, exp)
    });

    // テックゴー: ハイクラス向け
    agents.push({
      id: 'techgo',
      name: 'テックゴー',
      description: '年収600万以上のハイクラスIT転職に強み。',
      reason: _getTechGoReason(role, exp),
      url: '#techgo-affiliate',
      color: '#7C4DFF',
      priority: _getTechGoPriority(answers)
    });

    // 優先度順にソート
    agents.sort((a, b) => b.priority - a.priority);
    return agents;
  }

  function _getLevtechReason(role, exp) {
    if (['frontend', 'backend', 'fullstack'].includes(role)) {
      return 'Web系の求人数が圧倒的。あなたの職種にマッチする案件が豊富です。';
    }
    if (exp === '1-2' || exp === '3-4') {
      return '若手〜中堅エンジニアの転職支援実績が豊富。初めての転職でも安心です。';
    }
    return 'IT特化ならではの専門性の高いアドバイザーが在籍しています。';
  }

  function _getLevtechPriority(role, exp) {
    let p = 80;
    if (['frontend', 'backend', 'fullstack'].includes(role)) p += 10;
    if (exp === '3-4' || exp === '5-7') p += 5;
    return p;
  }

  function _getGeeklyReason(role, exp) {
    if (['pm', 'fullstack'].includes(role)) {
      return '非公開求人が多く、PM・フルスタック領域で好条件のオファー実績あり。';
    }
    return '年収UP率81%。書類選考の通過率も高く、効率的な転職活動が可能です。';
  }

  function _getGeeklyPriority(role, exp) {
    let p = 75;
    if (['pm', 'fullstack', 'frontend'].includes(role)) p += 10;
    if (exp === '5-7' || exp === '8-10') p += 5;
    return p;
  }

  function _getTechGoReason(role, exp) {
    if (exp === '8-10' || exp === '11+') {
      return 'シニアエンジニア向けのハイクラス案件に強み。800万〜の非公開求人も多数。';
    }
    if (['sre', 'ml_engineer', 'security'].includes(role)) {
      return '専門性の高い職種での高年収案件を多く保有しています。';
    }
    return '年収600万以上を目指すなら、ハイクラス特化のサポートが受けられます。';
  }

  function _getTechGoPriority(answers) {
    let p = 70;
    const exp = answers.experience;
    if (exp === '8-10' || exp === '11+') p += 15;
    if (['sre', 'ml_engineer', 'security', 'data_engineer'].includes(answers.role)) p += 10;
    if (answers.management === 'manager' || answers.management === 'director') p += 10;
    return p;
  }

  // ========================================
  // ヒストグラム用: 類似母集団の年収分布を生成
  // ========================================
  function _generateDistribution(role, experience, estimated, currentSalary) {
    const baseMedian = BASE_SALARY[role]?.[experience] || 450;
    // 標準偏差は中央値の約18%（現実的なばらつき）
    const stdDev = baseMedian * 0.18;

    // ビン幅50万円刻みで分布を作成
    const binWidth = 50;
    const minBin = Math.max(200, Math.floor((baseMedian - stdDev * 3) / binWidth) * binWidth);
    const maxBin = Math.ceil((baseMedian + stdDev * 3) / binWidth) * binWidth;

    const bins = [];
    for (let start = minBin; start < maxBin; start += binWidth) {
      // 正規分布の確率密度で高さを決定
      const mid = start + binWidth / 2;
      const z = (mid - baseMedian) / stdDev;
      const density = Math.exp(-0.5 * z * z);
      bins.push({
        rangeStart: start,
        rangeEnd: start + binWidth,
        label: start + '万',
        density: density,
        containsUser: currentSalary >= start && currentSalary < start + binWidth,
        containsEstimated: estimated >= start && estimated < start + binWidth
      });
    }

    // densityを最大1に正規化
    const maxDensity = Math.max(...bins.map(b => b.density));
    bins.forEach(b => { b.density = b.density / maxDensity; });

    // ユーザーのパーセンタイル（推定）
    const zUser = currentSalary > 0 ? (currentSalary - baseMedian) / stdDev : 0;
    const zEst = (estimated - baseMedian) / stdDev;
    const userPercentile = currentSalary > 0 ? Math.round(_normalCDF(zUser) * 100) : null;
    const estPercentile = Math.round(_normalCDF(zEst) * 100);

    return {
      bins,
      roleName: _getRoleName(role),
      median: baseMedian,
      userPercentile,
      estPercentile
    };
  }

  // 標準正規分布の累積分布関数（近似）
  function _normalCDF(z) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    return 0.5 * (1.0 + sign * y);
  }

  // ========================================
  // ポジション例データ
  // ========================================
  const POSITION_EXAMPLES = {
    frontend: [
      { min: 280, max: 420, company: 'スタートアップ（自社サービス）', position: 'フロントエンドエンジニア', note: 'React / Vue.js', remote: true },
      { min: 380, max: 560, company: 'メガベンチャー（EC / メディア）', position: 'フロントエンドエンジニア', note: 'TypeScript / Next.js 必須', remote: true },
      { min: 520, max: 750, company: '外資系SaaS企業', position: 'Senior Frontend Engineer', note: 'React 必須、英語力あればさらに有利', remote: true },
      { min: 650, max: 950, company: 'グローバルIT企業', position: 'Staff Frontend Engineer', note: 'テックリード経験者', remote: true }
    ],
    backend: [
      { min: 290, max: 430, company: 'Web系スタートアップ', position: 'バックエンドエンジニア', note: 'Go / Python / Node.js いずれか', remote: true },
      { min: 400, max: 580, company: '自社サービス系メガベンチャー', position: 'バックエンドエンジニア', note: 'スケーラブルなAPI設計経験歓迎', remote: true },
      { min: 550, max: 780, company: 'フィンテック企業', position: 'シニアバックエンドエンジニア', note: 'Go / Java、高可用性システム経験', remote: false },
      { min: 700, max: 1100, company: '外資系クラウド / SaaS', position: 'Senior Software Engineer', note: '分散システム設計経験者', remote: true }
    ],
    fullstack: [
      { min: 310, max: 460, company: 'Webサービス系スタートアップ', position: 'フルスタックエンジニア', note: 'React + Node.js / Rails', remote: true },
      { min: 420, max: 620, company: 'SaaS系メガベンチャー', position: 'フルスタックエンジニア', note: 'TypeScript / Next.js + BFF', remote: true },
      { min: 580, max: 850, company: '外資系SaaS', position: 'Senior Full-Stack Engineer', note: '英語でのコミュニケーション可', remote: true }
    ],
    mobile: [
      { min: 300, max: 440, company: 'アプリ系スタートアップ', position: 'iOSエンジニア / Androidエンジニア', note: 'Swift / Kotlin いずれか', remote: true },
      { min: 400, max: 580, company: 'メガベンチャー（消費者向けアプリ）', position: 'シニアモバイルエンジニア', note: 'Swift + Kotlin 両方歓迎', remote: true },
      { min: 540, max: 780, company: '外資系アプリ企業', position: 'Senior Mobile Engineer', note: 'Flutter / React Native も可', remote: true }
    ],
    infra: [
      { min: 300, max: 430, company: 'Web系企業', position: 'インフラエンジニア', note: 'AWS / GCP 基礎経験', remote: false },
      { min: 400, max: 580, company: 'メガベンチャー', position: 'クラウドインフラエンジニア', note: 'Terraform / Kubernetes 経験歓迎', remote: true },
      { min: 560, max: 800, company: 'クラウドネイティブ企業', position: 'シニアインフラエンジニア', note: 'マルチクラウド・IaC 必須', remote: true }
    ],
    sre: [
      { min: 330, max: 500, company: 'Web系企業', position: 'SREエンジニア', note: 'Linux / Kubernetes 基礎', remote: true },
      { min: 470, max: 660, company: 'メガベンチャー', position: 'SREエンジニア', note: 'Prometheus / Grafana 経験歓迎', remote: true },
      { min: 620, max: 900, company: '外資系テック企業', position: 'Senior SRE', note: 'SLO/SLI設計・インシデント対応経験', remote: true }
    ],
    data_engineer: [
      { min: 320, max: 480, company: 'Web系企業', position: 'データエンジニア', note: 'BigQuery / Redshift いずれか', remote: true },
      { min: 450, max: 640, company: 'メガベンチャー（広告 / EC）', position: 'データエンジニア', note: 'Python + Airflow / dbt 経験歓迎', remote: true },
      { min: 600, max: 860, company: '外資系データ企業', position: 'Senior Data Engineer', note: 'Snowflake / Spark、英語力尚可', remote: true }
    ],
    ml_engineer: [
      { min: 350, max: 520, company: 'AIスタートアップ', position: '機械学習エンジニア', note: 'Python / PyTorch 基礎', remote: true },
      { min: 490, max: 700, company: 'メガベンチャー（広告 / 推薦）', position: 'MLエンジニア', note: '推薦・広告配信システム経験歓迎', remote: true },
      { min: 660, max: 1000, company: '外資系AI / リサーチ企業', position: 'Senior ML Engineer / Researcher', note: '論文実績・LLM応用経験歓迎', remote: true }
    ],
    security: [
      { min: 320, max: 480, company: 'SIer / ITコンサル', position: 'セキュリティエンジニア', note: 'ISMS / ペネトレーション基礎', remote: false },
      { min: 450, max: 650, company: 'メガベンチャー', position: 'セキュリティエンジニア', note: 'AWS SecurityHub / SIEM運用', remote: true },
      { min: 620, max: 900, company: '外資系セキュリティ企業', position: 'Senior Security Engineer', note: 'CISSP / AWS SAP 保有者優遇', remote: true }
    ],
    pm: [
      { min: 330, max: 490, company: 'Web系企業', position: 'エンジニアリングマネージャー', note: '5名程度のチームマネジメント', remote: true },
      { min: 460, max: 680, company: 'メガベンチャー', position: 'EM / テックリード', note: '技術戦略・採用にも関与', remote: true },
      { min: 640, max: 1000, company: '外資系SaaS / スタートアップ', position: 'Engineering Manager / VPoE', note: '組織設計・事業貢献経験者', remote: true }
    ],
    qa: [
      { min: 270, max: 400, company: 'Web系スタートアップ', position: 'QAエンジニア', note: 'テスト設計・自動化基礎', remote: true },
      { min: 370, max: 530, company: 'メガベンチャー', position: 'QA / SDET', note: 'Selenium / Cypress 自動化経験', remote: true },
      { min: 500, max: 720, company: '外資系SaaS', position: 'Senior QA Engineer', note: 'テスト基盤構築・CI連携経験', remote: true }
    ],
    embedded: [
      { min: 300, max: 430, company: 'メーカー系企業', position: '組み込みエンジニア', note: 'C / C++ 基礎、RTOS経験', remote: false },
      { min: 400, max: 570, company: 'IoTスタートアップ', position: '組み込み / ファームウェアエンジニア', note: 'Linux組み込み・通信プロトコル', remote: false },
      { min: 540, max: 780, company: '外資系半導体 / 自動車関連', position: 'Senior Embedded Engineer', note: 'AUTOSAR / ROS 経験歓迎', remote: false }
    ]
  };

  function getPositionExamples(role, estimated) {
    const all = POSITION_EXAMPLES[role] || POSITION_EXAMPLES['backend'];
    // 推定年収のレンジ（±20%）にかかるポジションを最大3件抽出
    const matched = all.filter(p => p.max >= estimated * 0.80 && p.min <= estimated * 1.20);
    // マッチしない場合は近い順に上位3件
    const sorted = matched.length > 0
      ? matched
      : [...all].sort((a, b) => {
          const aMid = (a.min + a.max) / 2;
          const bMid = (b.min + b.max) / 2;
          return Math.abs(aMid - estimated) - Math.abs(bMid - estimated);
        });
    return sorted.slice(0, 3);
  }

  // ========================================
  // レベルバッジ判定
  // ========================================
  function getLevelBadge(answers, estimated) {
    // 詳細診断でskillLevelが回答済みの場合はそちらを優先
    if (answers.isDetailed && answers.skillLevel) {
      const levelMap = {
        junior:    { label: 'ジュニアレベル',      icon: '🌱', color: '#34d399', description: '着実にスキルを積み上げ中' },
        mid:       { label: 'シニアレベル',         icon: '⚡', color: '#60a5fa', description: '自走できるミドルエンジニア' },
        senior:    { label: 'テックリードレベル',   icon: '🔥', color: '#f59e0b', description: '技術方針を主導できる存在' },
        architect: { label: 'マネージャーレベル',   icon: '🚀', color: '#a78bfa', description: 'アーキテクチャ・組織を動かす' },
        principal: { label: 'CTOレベル',           icon: '👑', color: '#f97316', description: '組織の技術戦略を牽引するトップ' }
      };
      if (levelMap[answers.skillLevel]) return levelMap[answers.skillLevel];
    }
    // サクッと診断 or 未回答の場合は年収から判定
    return _getLevelBySalary(estimated);
  }

  function _getLevelBySalary(estimated) {
    if (estimated < 430) return { label: 'ジュニアレベル',    icon: '🌱', color: '#34d399', description: 'キャリアの土台を構築中' };
    if (estimated < 570) return { label: 'シニアレベル',      icon: '⚡', color: '#60a5fa', description: '自走できるミドルエンジニア' };
    if (estimated < 730) return { label: 'テックリードレベル', icon: '🔥', color: '#f59e0b', description: '技術方針を主導できる存在' };
    if (estimated < 960) return { label: 'マネージャーレベル', icon: '🚀', color: '#a78bfa', description: 'チームを牽引するリーダー' };
    return                       { label: 'CTOレベル',        icon: '👑', color: '#f97316', description: '業界トップクラスの市場価値' };
  }

  // Public API
  return { calculate, getLevelBadge, getPositionExamples };
})();
