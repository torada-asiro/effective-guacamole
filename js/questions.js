/**
 * ITエンジニア年収診断 - 質問定義
 */

const Questions = (() => {

  // ========================================
  // 共通質問（簡易・詳細 両方で使用）8問
  // ========================================
  const COMMON_QUESTIONS = [
    {
      id: 'role',
      type: 'single',
      title: '現在の職種に最も近いものは？',
      subtitle: 'メインの業務内容で選んでください',
      options: [
        { value: 'frontend',      label: 'フロントエンド',          icon: '🖥' },
        { value: 'backend',       label: 'バックエンド / サーバーサイド', icon: '⚙' },
        { value: 'fullstack',     label: 'フルスタック',            icon: '🔄' },
        { value: 'mobile',        label: 'モバイル（iOS / Android）', icon: '📱' },
        { value: 'infra',         label: 'インフラ / クラウド',      icon: '☁' },
        { value: 'sre',           label: 'SRE / DevOps',           icon: '🔧' },
        { value: 'data_engineer', label: 'データエンジニア',         icon: '📊' },
        { value: 'ml_engineer',   label: '機械学習 / AI',           icon: '🤖' },
        { value: 'security',      label: 'セキュリティ',            icon: '🔒' },
        { value: 'pm',            label: 'EM / PM / テックリード',   icon: '📋' },
        { value: 'qa',            label: 'QA / テスト',             icon: '✅' },
        { value: 'embedded',      label: '組み込み / IoT',          icon: '🔌' }
      ]
    },
    {
      id: 'experience',
      type: 'single',
      title: 'エンジニアとしての実務経験は？',
      subtitle: '関連職種を含めたトータルの年数',
      options: [
        { value: '1-2',  label: '1〜2年' },
        { value: '3-4',  label: '3〜4年' },
        { value: '5-7',  label: '5〜7年' },
        { value: '8-10', label: '8〜10年' },
        { value: '11+',  label: '11年以上' }
      ]
    },
    {
      id: 'techStack',
      type: 'multi',
      title: '業務で使っている技術を選んでください',
      subtitle: '直近1年で実務経験のあるもの（複数選択可）',
      maxSelect: 8,
      groups: [
        {
          label: '言語',
          options: [
            { value: 'javascript',  label: 'JavaScript' },
            { value: 'typescript',  label: 'TypeScript' },
            { value: 'python',      label: 'Python' },
            { value: 'go',          label: 'Go' },
            { value: 'rust',        label: 'Rust' },
            { value: 'java',        label: 'Java' },
            { value: 'kotlin',      label: 'Kotlin' },
            { value: 'swift',       label: 'Swift' },
            { value: 'php',         label: 'PHP' },
            { value: 'ruby',        label: 'Ruby' },
            { value: 'csharp',      label: 'C#' },
            { value: 'cpp',         label: 'C / C++' },
            { value: 'scala',       label: 'Scala' },
            { value: 'elixir',      label: 'Elixir' }
          ]
        },
        {
          label: 'フレームワーク',
          options: [
            { value: 'react',         label: 'React' },
            { value: 'vue',           label: 'Vue.js' },
            { value: 'angular',       label: 'Angular' },
            { value: 'nextjs',        label: 'Next.js' },
            { value: 'nuxt',          label: 'Nuxt' },
            { value: 'rails',         label: 'Ruby on Rails' },
            { value: 'spring',        label: 'Spring' },
            { value: 'django',        label: 'Django' },
            { value: 'fastapi',       label: 'FastAPI' },
            { value: 'laravel',       label: 'Laravel' },
            { value: 'flutter',       label: 'Flutter' },
            { value: 'react_native',  label: 'React Native' }
          ]
        },
        {
          label: 'インフラ / クラウド',
          options: [
            { value: 'aws',         label: 'AWS' },
            { value: 'gcp',         label: 'GCP' },
            { value: 'azure',       label: 'Azure' },
            { value: 'kubernetes',  label: 'Kubernetes' },
            { value: 'docker',      label: 'Docker' },
            { value: 'terraform',   label: 'Terraform' }
          ]
        },
        {
          label: 'データ / ML',
          options: [
            { value: 'spark',       label: 'Apache Spark' },
            { value: 'pytorch',     label: 'PyTorch' },
            { value: 'tensorflow',  label: 'TensorFlow' },
            { value: 'bigquery',    label: 'BigQuery' },
            { value: 'snowflake',   label: 'Snowflake' }
          ]
        }
      ]
    },
    {
      id: 'currentSalary',
      type: 'salary_input',
      title: '現在の年収は？',
      subtitle: '額面（税引前）で入力してください',
      placeholder: '例: 500',
      unit: '万円',
      min: 200,
      max: 2500
    },
    {
      id: 'companySize',
      type: 'single',
      title: '現在の勤務先の規模は？',
      options: [
        { value: 'startup_early',  label: 'スタートアップ（〜30名）' },
        { value: 'startup_growth', label: 'スタートアップ（30〜100名）' },
        { value: 'mid',            label: '中堅企業（100〜500名）' },
        { value: 'mega_venture',   label: 'メガベンチャー（500名〜）' },
        { value: 'large',          label: '大手 / SIer' },
        { value: 'foreign',        label: '外資系' },
        { value: 'freelance',      label: 'フリーランス / 業務委託' }
      ]
    },
    {
      id: 'region',
      type: 'single',
      title: '勤務地域は？',
      options: [
        { value: 'tokyo',    label: '東京都' },
        { value: 'kanagawa', label: '神奈川県' },
        { value: 'osaka',    label: '大阪府' },
        { value: 'nagoya',   label: '愛知県' },
        { value: 'fukuoka',  label: '福岡県' },
        { value: 'remote',   label: 'フルリモート' },
        { value: 'other',    label: 'その他' }
      ]
    },
    {
      id: 'management',
      type: 'single',
      title: 'マネジメント・リーダー経験は？',
      options: [
        { value: 'none',     label: 'なし（IC専任）' },
        { value: 'lead',     label: 'テックリード / 数名のリード経験' },
        { value: 'manager',  label: 'マネージャー（10名以上）' },
        { value: 'director', label: '部門長 / VP of Engineering' }
      ]
    },
    {
      id: 'ageRange',
      type: 'single',
      title: '年齢を教えてください',
      subtitle: 'マッチする求人の精度向上に使用します',
      options: [
        { value: '20s_early', label: '20〜24歳' },
        { value: '20s_late',  label: '25〜29歳' },
        { value: '30s_early', label: '30〜34歳' },
        { value: '30s_late',  label: '35〜39歳' },
        { value: '40s_plus',  label: '40歳以上' }
      ]
    }
  ];

  // ========================================
  // 詳細診断用 追加質問（+12問 = 合計20問）
  // ========================================
  const DETAILED_EXTRA = [
    {
      id: 'education',
      type: 'single',
      title: '最終学歴は？',
      optional: true,
      options: [
        { value: 'highschool',  label: '高卒' },
        { value: 'vocational',  label: '専門学校卒' },
        { value: 'bachelor',    label: '大卒（学士）' },
        { value: 'master',      label: '大学院卒（修士）' },
        { value: 'phd',         label: '大学院卒（博士）' },
        { value: 'self_taught', label: '独学 / その他' }
      ]
    },
    {
      id: 'skillLevel',
      type: 'single',
      title: '技術レベルを最も的確に表すのは？',
      subtitle: '日常業務ベースで選んでください',
      options: [
        { value: 'junior',    label: '指示をもらって実装する',       description: '設計はリーダーが担当。実装中心。' },
        { value: 'mid',       label: '一人で機能を完遂できる',       description: 'タスクを渡されれば設計〜実装まで自走。' },
        { value: 'senior',    label: '設計から主導する',             description: 'プロジェクトの技術方針策定に関わる。' },
        { value: 'architect', label: 'アーキテクチャを設計する',      description: 'システム全体の構造設計・技術選定を担当。' },
        { value: 'principal', label: '組織の技術戦略を牽引する',      description: '複数チーム横断で技術的意思決定を行う。' }
      ]
    },
    {
      id: 'companyIndustry',
      type: 'single',
      title: '勤務先の業界は？',
      options: [
        { value: 'web_service',  label: '自社Webサービス / SaaS' },
        { value: 'ec',           label: 'EC / リテール' },
        { value: 'fintech',      label: 'フィンテック / 金融' },
        { value: 'healthcare',   label: 'ヘルスケア / 医療' },
        { value: 'gaming',       label: 'ゲーム / エンタメ' },
        { value: 'ad_media',     label: '広告 / メディア' },
        { value: 'sier',         label: 'SIer / 受託開発' },
        { value: 'ses',          label: 'SES' },
        { value: 'consulting',   label: 'ITコンサルティング' },
        { value: 'other_ind',    label: 'その他（非IT事業会社等）' }
      ]
    },
    {
      id: 'teamSize',
      type: 'single',
      title: '所属しているチームの規模は？',
      subtitle: '直属のエンジニアチーム',
      options: [
        { value: 'solo',   label: '1人（自分だけ）' },
        { value: 'small',  label: '2〜5人' },
        { value: 'medium', label: '6〜15人' },
        { value: 'large',  label: '16〜30人' },
        { value: 'xl',     label: '30人以上' }
      ]
    },
    {
      id: 'devProcess',
      type: 'multi',
      title: '開発プロセスで経験があるものは？',
      subtitle: '該当するものをすべて選択',
      maxSelect: 8,
      groups: [
        {
          label: null,
          options: [
            { value: 'agile',    label: 'アジャイル / スクラム' },
            { value: 'ci_cd',    label: 'CI/CD パイプライン構築' },
            { value: 'code_review', label: 'コードレビュー文化' },
            { value: 'tdd',      label: 'TDD / テスト駆動開発' },
            { value: 'devops',   label: 'DevOps実践' },
            { value: 'monitoring', label: '監視 / オブザーバビリティ' },
            { value: 'incident',   label: 'インシデント対応・ポストモーテム' },
            { value: 'ddd',      label: 'DDD / ドメイン駆動設計' }
          ]
        }
      ]
    },
    {
      id: 'certifications',
      type: 'multi',
      title: '保有している資格は？',
      subtitle: '該当するものをすべて選択（任意）',
      optional: true,
      maxSelect: 10,
      groups: [
        {
          label: 'クラウド',
          options: [
            { value: 'aws_saa',    label: 'AWS SAA' },
            { value: 'aws_sap',    label: 'AWS SAP' },
            { value: 'aws_devops', label: 'AWS DevOps Pro' },
            { value: 'gcp_pca',    label: 'GCP PCA' },
            { value: 'gcp_pde',    label: 'GCP PDE' },
            { value: 'azure_admin', label: 'Azure Admin' }
          ]
        },
        {
          label: '情報処理技術者',
          options: [
            { value: 'ipa_fe',  label: '基本情報' },
            { value: 'ipa_ap',  label: '応用情報' },
            { value: 'ipa_db',  label: 'DB スペシャリスト' },
            { value: 'ipa_nw',  label: 'NW スペシャリスト' },
            { value: 'ipa_sc',  label: '安全確保支援士' },
            { value: 'ipa_sa',  label: 'システムアーキテクト' },
            { value: 'ipa_pm',  label: 'プロジェクトマネージャ' }
          ]
        },
        {
          label: 'その他',
          options: [
            { value: 'ckad',  label: 'CKAD' },
            { value: 'cka',   label: 'CKA' },
            { value: 'cissp', label: 'CISSP' },
            { value: 'pmp',   label: 'PMP' }
          ]
        }
      ]
    },
    {
      id: 'english',
      type: 'single',
      title: '英語力はどのくらい？',
      options: [
        { value: 'none',     label: 'ほぼ使わない' },
        { value: 'reading',  label: '読み書きは問題ない',     description: 'ドキュメント読解やコードレビュー程度' },
        { value: 'business', label: 'ビジネスレベル',         description: '英語での会議・プレゼンが可能' },
        { value: 'native',   label: 'ネイティブレベル',       description: '日常的に英語で業務遂行' }
      ]
    },
    {
      id: 'sideWork',
      type: 'single',
      title: '副業・個人開発の経験は？',
      options: [
        { value: 'none',        label: 'なし' },
        { value: 'personal',    label: '個人開発・OSSコントリビュート経験あり' },
        { value: 'side_income', label: '副業で収入を得ている（〜月10万）' },
        { value: 'side_high',   label: '副業で月10万以上の収入あり' }
      ]
    },
    {
      id: 'workStyle',
      type: 'single',
      title: '現在の働き方は？',
      options: [
        { value: 'full_office',  label: '完全出社' },
        { value: 'hybrid',       label: 'ハイブリッド（週2-3出社）' },
        { value: 'mostly_remote', label: 'ほぼリモート（月数回出社）' },
        { value: 'full_remote',  label: '完全リモート' }
      ]
    },
    {
      id: 'jobSatisfaction',
      type: 'single',
      title: '現在の仕事の満足度は？',
      subtitle: '総合的に判断してください',
      options: [
        { value: 'very_low',  label: 'かなり不満',   description: '転職を強く考えている' },
        { value: 'low',       label: 'やや不満',     description: '改善されなければ転職も視野' },
        { value: 'neutral',   label: '普通',         description: '特に大きな不満はない' },
        { value: 'high',      label: '満足',         description: '概ね良い環境だと思う' },
        { value: 'very_high', label: 'とても満足',   description: '今の環境が気に入っている' }
      ]
    },
    {
      id: 'salaryPriority',
      type: 'single',
      title: '転職で最も重視するのは？',
      subtitle: '1つだけ選んでください',
      options: [
        { value: 'salary',       label: '年収・報酬' },
        { value: 'tech',         label: '技術的なチャレンジ' },
        { value: 'growth',       label: 'キャリア成長・スキルアップ' },
        { value: 'work_life',    label: 'ワークライフバランス' },
        { value: 'product',      label: 'プロダクトへの共感' },
        { value: 'culture',      label: '組織文化・チーム' }
      ]
    },
    {
      id: 'transferTiming',
      type: 'single',
      title: '転職の検討状況は？',
      options: [
        { value: 'active',    label: '積極的に活動中' },
        { value: 'open',      label: '良い話があれば検討したい' },
        { value: 'future',    label: 'いずれは考えたい（半年〜1年後）' },
        { value: 'not_now',   label: '今は考えていない（市場価値の確認のみ）' }
      ]
    },
    {
      id: 'pastTransfers',
      type: 'single',
      title: '過去の転職回数は？',
      options: [
        { value: '0',   label: '0回（現職が初めて）' },
        { value: '1',   label: '1回' },
        { value: '2',   label: '2回' },
        { value: '3+',  label: '3回以上' }
      ]
    }
  ];

  /**
   * 診断モードに応じた質問リストを返す
   */
  function getQuestions(mode) {
    if (mode === 'detailed') {
      // 共通8問 + 詳細12問 = 20問
      return [...COMMON_QUESTIONS, ...DETAILED_EXTRA];
    }
    // 簡易: 共通8問
    return [...COMMON_QUESTIONS];
  }

  function getQuestionCount(mode) {
    return getQuestions(mode).length;
  }

  return { getQuestions, getQuestionCount };
})();
