import React, { useState } from 'react';
import { BarChart3, Users, Wrench, Target, ArrowRight, RotateCcw, Share2 } from 'lucide-react';

// 型定義
interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    director: string;
    specialist: string;
    assistant: string;
  };
}

interface JobType {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  lightColor: string;
  description: string;
  detail: string;
  skills: string[];
  tasks: string[];
  rate: string;
  advice: string;
}

interface Scores {
  director: number;
  specialist: number;
  assistant: number;
}

interface Results {
  scores: Scores;
  mainType: keyof Scores;
  isBalanced: boolean;
  maxScore: number;
  totalQuestions: number;
}

interface RadarChartProps {
  scores: Scores;
}

const VACareerTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'start' | 'test' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, Partial<Scores>>>({});
  const [results, setResults] = useState<Results | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      category: "仕事の進め方",
      question: "新しいクライアントから複数の業務依頼が来た時、あなたが最初に取る行動は？",
      options: {
        director: "全体のゴールを把握し、業務の優先順位と進行スケジュールを組み立てる",
        specialist: "各業務に必要なスキルや技術を整理し、自分の専門分野を確認する",
        assistant: "クライアントの要望を詳しくヒアリングし、期待値を正確に把握する"
      }
    },
    {
      id: 2,
      category: "仕事の進め方",
      question: "業務の途中で予想外の問題が発生した時、どう対応しますか？",
      options: {
        director: "全体への影響を考えて代替案を検討し、プロジェクト全体を調整する",
        specialist: "問題の原因を徹底的に分析し、技術的な解決方法を見つける",
        assistant: "すぐにクライアントに報告し、一緒に解決策を相談する"
      }
    },
    {
      id: 3,
      category: "仕事の進め方",
      question: "複数の業務が同時に進行している時、あなたの管理方法は？",
      options: {
        director: "全体を俯瞰できるスケジュール表を作り、戦略的に業務を振り分ける",
        specialist: "最も得意で重要な業務に集中し、高品質な成果を出すことを優先する",
        assistant: "各クライアントとこまめに連絡を取り、進捗を共有しながら進める"
      }
    },
    {
      id: 4,
      category: "仕事の進め方",
      question: "新しい業務領域にチャレンジする時の判断基準は？",
      options: {
        director: "ビジネス全体への影響と将来的な発展性を考えて判断する",
        specialist: "自分の専門スキルが活かせるか、技術的に成長できるかで判断する",
        assistant: "クライアントのニーズに応えられるか、役に立てるかで判断する"
      }
    },
    {
      id: 5,
      category: "仕事の進め方",
      question: "効率的に業務を進めるために重視することは？",
      options: {
        director: "業務プロセス全体を最適化し、システム化できる部分を見つける",
        specialist: "自分の得意分野に特化し、専門性を高めて作業スピードを上げる",
        assistant: "クライアントとの連携を密にし、認識のズレをなくす"
      }
    },
    {
      id: 6,
      category: "コミュニケーション",
      question: "クライアントとのやり取りで最も重視することは？",
      options: {
        director: "ビジネス成果につながる建設的な提案をすること",
        specialist: "専門知識を活かした的確で価値のある情報提供をすること",
        assistant: "相手の立場に立った丁寧で分かりやすいコミュニケーション"
      }
    },
    {
      id: 7,
      category: "コミュニケーション",
      question: "クライアントから曖昧な指示を受けた時の対応は？",
      options: {
        director: "ビジネスゴールを確認し、最適と思われる方向性を提案する",
        specialist: "技術的な観点から複数の選択肢を整理して説明する",
        assistant: "丁寧に質問を重ね、クライアントの真意を引き出す"
      }
    },
    {
      id: 8,
      category: "コミュニケーション",
      question: "チームで作業する時のあなたの役割は？",
      options: {
        director: "全体の方向性を示し、メンバーをまとめるリーダー役",
        specialist: "専門知識で技術的な問題を解決するエキスパート役",
        assistant: "メンバー間の調整や情報共有を担うサポート役"
      }
    },
    {
      id: 9,
      category: "コミュニケーション",
      question: "クライアントへの報告で心がけることは？",
      options: {
        director: "成果と今後の戦略について建設的な提案を含める",
        specialist: "技術的な根拠を示し、専門的で正確な情報を伝える",
        assistant: "相手が理解しやすい言葉で、丁寧に状況を説明する"
      }
    },
    {
      id: 10,
      category: "コミュニケーション",
      question: "難しいクライアントとの関係構築で大切にすることは？",
      options: {
        director: "ビジネス価値を明確に示し、Win-Winの関係を築く",
        specialist: "専門性で信頼を得て、技術的なパートナーとして認められる",
        assistant: "誠実な対応を続け、人間関係の信頼を深める"
      }
    },
    {
      id: 11,
      category: "スキル・学習",
      question: "新しいスキルを身につける時の主な動機は？",
      options: {
        director: "ビジネス全体に活かせて、より大きな価値を提供できるから",
        specialist: "専門性を高めて、その分野のエキスパートになれるから",
        assistant: "クライアントの多様なニーズに応えて、役に立てるから"
      }
    },
    {
      id: 12,
      category: "スキル・学習",
      question: "スキルアップの方法として好むのは？",
      options: {
        director: "経営やマネジメントに関する書籍やセミナーで学ぶ",
        specialist: "専門分野の技術書や実践的なコースで深く学ぶ",
        assistant: "実際の業務を通じて、クライアントから学ぶ"
      }
    },
    {
      id: 13,
      category: "スキル・学習",
      question: "自分の強みを活かす方法は？",
      options: {
        director: "複数のスキルを組み合わせて、総合的なソリューションを提供する",
        specialist: "特定分野に特化して、その道のプロフェッショナルになる",
        assistant: "コミュニケーション力を活かし、クライアントとの橋渡し役になる"
      }
    },
    {
      id: 14,
      category: "スキル・学習",
      question: "業界のトレンドや新技術への対応は？",
      options: {
        director: "ビジネスへの影響を分析し、戦略的に取り入れるべきものを選ぶ",
        specialist: "技術的な詳細まで深く理解し、実用レベルまで習得する",
        assistant: "クライアントのニーズに合わせて、必要な分だけ学ぶ"
      }
    },
    {
      id: 15,
      category: "スキル・学習",
      question: "長期的なキャリア形成で目指すのは？",
      options: {
        director: "複数分野を統括できるディレクターやコンサルタント",
        specialist: "特定分野のスペシャリストとして確固たる地位を築く",
        assistant: "多くのクライアントから信頼される頼れるパートナー"
      }
    },
    {
      id: 16,
      category: "価値観・志向",
      question: "仕事で最もやりがいを感じる瞬間は？",
      options: {
        director: "自分が企画・管理したプロジェクトが成功した時",
        specialist: "高品質で専門性の高い成果物を完成させた時",
        assistant: "クライアントから感謝の言葉をもらえた時"
      }
    },
    {
      id: 17,
      category: "価値観・志向",
      question: "理想的な働き方は？",
      options: {
        director: "複数のプロジェクトを同時に管理し、大きな成果を生み出す",
        specialist: "得意分野に集中し、その道のプロとして認められる",
        assistant: "クライアントに寄り添い、長期的なパートナー関係を築く"
      }
    },
    {
      id: 18,
      category: "価値観・志向",
      question: "仕事選びで重視する条件は？",
      options: {
        director: "自分の裁量が大きく、ビジネス全体に関われること",
        specialist: "専門スキルを活かせて、技術的に成長できること",
        assistant: "クライアントとの関係が良好で、安定して続けられること"
      }
    },
    {
      id: 19,
      category: "価値観・志向",
      question: "ストレスを感じるのはどんな時？",
      options: {
        director: "全体の方向性が見えない、非効率な進め方をしている時",
        specialist: "専門外の業務ばかりで、自分のスキルが活かせない時",
        assistant: "クライアントとのコミュニケーションがうまくいかない時"
      }
    },
    {
      id: 20,
      category: "価値観・志向",
      question: "バーチャルアシスタントとして目指す姿は？",
      options: {
        director: "クライアントのビジネス成長を戦略的にサポートするパートナー",
        specialist: "特定分野のエキスパートとして、高い価値を提供するプロフェッショナル",
        assistant: "クライアントに信頼され、長く頼りにされる心強いサポーター"
      }
    }
  ];

  const jobTypes: Record<keyof Scores, JobType> = {
    director: {
      name: "ディレクター",
      icon: Target,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      description: "統括・企画型",
      detail: "クライアントのビジネス全体を俯瞰し、戦略的に業務を組み立てる",
      skills: ["プロジェクト管理", "戦略企画", "チームマネジメント", "ビジネス分析", "課題解決力", "リーダーシップ"],
      tasks: [
        "プロジェクトマネージャー",
        "ローンチ顧問・アドバイザー", 
        "チーム統括",
        "戦略企画",
        "マーケティング企画",
        "ディレクター",
        "イベント企画・運営",
        "Webディレクター",
        "ビジネスコンサルティング",
        "組織運営サポート",
        "KPI設計・分析",
        "事業計画策定支援"
      ],
      rate: "時給3,000-8,000円",
      advice: "複数のスキルを組み合わせて総合的なソリューション提供を目指しましょう"
    },
    specialist: {
      name: "スペシャリスト",
      icon: Wrench,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      description: "専門・技術型",
      detail: "特定分野の深い知識とスキルで高品質な成果物を作る",
      skills: ["専門技術", "品質管理", "継続学習", "技術革新", "クリエイティブ力", "問題解決力"],
      tasks: [
        "動画編集",
        "AIを活用した業務効率化",
        "LINE構築・運用",
        "Webサイト・ランディングページ制作",
        "システム構築・設定",
        "コンテンツの横展開",
        "SNS運用・クリエイティブ制作",
        "翻訳",
        "ライター",
        "グラフィックデザイン",
        "SEO対策・分析",
        "データ分析・可視化",
        "マーケティングオートメーション構築",
        "オンライン講座制作",
        "ブランディング支援"
      ],
      rate: "時給2,500-6,000円",
      advice: "得意分野を深く極めて、その道のプロフェッショナルを目指しましょう"
    },
    assistant: {
      name: "アシスタント",
      icon: Users,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      description: "サポート・調整型",
      detail: "クライアントの日常業務を丁寧にサポートする",
      skills: ["コミュニケーション", "細やかな気配り", "顧客対応", "業務効率化", "調整力", "継続力"],
      tasks: [
        "カスタマーサポート",
        "資料作成",
        "リサーチ業務",
        "タスク・スケジュール管理",
        "顧客管理",
        "予約手配",
        "コミュニティ運営アシスタント",
        "講座やコースの運営・管理",
        "広報",
        "メール対応・管理",
        "データ入力・整理",
        "アポイント調整",
        "経理・請求書管理",
        "在庫管理",
        "イベント運営サポート",
        "オンライン会議運営",
        "文書校正・編集",
        "多言語対応サポート"
      ],
      rate: "時給1,500-4,000円",
      advice: "信頼関係を大切にし、長期的なパートナーとしての価値を高めましょう"
    }
  };

  const handleAnswer = (questionId: number, type: keyof Scores, score: number): void => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: score
      }
    }));
  };

  const nextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const previousQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = (): void => {
    const scores: Scores = {
      director: 0,
      specialist: 0,
      assistant: 0
    };

    Object.values(answers).forEach(questionAnswers => {
      if (questionAnswers.director) scores.director += questionAnswers.director;
      if (questionAnswers.specialist) scores.specialist += questionAnswers.specialist;
      if (questionAnswers.assistant) scores.assistant += questionAnswers.assistant;
    });

    const maxScore = Math.max(...Object.values(scores));
    const mainType = Object.keys(scores).find(key => scores[key as keyof Scores] === maxScore) as keyof Scores;
    
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const isBalanced = sortedScores[0] - sortedScores[1] <= 10;

    setResults({
      scores,
      mainType,
      isBalanced,
      maxScore,
      totalQuestions: questions.length
    });
    setCurrentStep('result');
  };

  const resetTest = (): void => {
    setCurrentStep('start');
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
    const isMobile = window.innerWidth < 768;
    const maxScore = 100;
    const center = isMobile ? 120 : 140;
    const radius = isMobile ? 60 : 80;
    const svgSize = isMobile ? 240 : 300;
    
    const points = [
      { name: 'ディレクター', value: scores.director, angle: -90 },
      { name: 'スペシャリスト', value: scores.specialist, angle: 30 },
      { name: 'アシスタント', value: scores.assistant, angle: 150 }
    ];

    const getPoint = (angle: number, value: number) => {
      const radian = (angle * Math.PI) / 180;
      const r = (value / maxScore) * radius;
      return {
        x: center + r * Math.cos(radian),
        y: center + r * Math.sin(radian)
      };
    };

    const getLabelPoint = (angle: number) => {
      const radian = (angle * Math.PI) / 180;
      const r = radius + (isMobile ? 20 : 30);
      return {
        x: center + r * Math.cos(radian),
        y: center + r * Math.sin(radian)
      };
    };

    const dataPoints = points.map(p => getPoint(p.angle, p.value));
    const labelPoints = points.map(p => getLabelPoint(p.angle));
    const pathData = `M ${dataPoints[0].x} ${dataPoints[0].y} L ${dataPoints[1].x} ${dataPoints[1].y} L ${dataPoints[2].x} ${dataPoints[2].y} Z`;

    return (
      <div className="flex justify-center">
        <svg width={svgSize} height={svgSize}>
          {[20, 40, 60, 80, 100].map(value => {
            const r = (value / maxScore) * radius;
            return (
              <circle
                key={value}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {points.map(point => {
            const endPoint = getPoint(point.angle, maxScore);
            return (
              <line
                key={point.name}
                x1={center}
                y1={center}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          <path
            d={pathData}
            fill="rgba(139, 92, 246, 0.3)"
            stroke="rgba(139, 92, 246, 0.8)"
            strokeWidth="2"
          />

          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={isMobile ? "3" : "4"}
              fill="#8b5cf6"
            />
          ))}

          {labelPoints.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs sm:text-sm font-semibold fill-gray-700"
              style={{ fontSize: isMobile ? '11px' : '14px' }}
            >
              {points[index].name}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  if (currentStep === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-3 sm:p-4 lg:p-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-lg lg:max-w-2xl w-full relative overflow-hidden">
          {/* 背景装飾 - レスポンシブサイズ */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-yellow-200 to-orange-200 rounded-full opacity-20 -translate-y-10 translate-x-10 sm:-translate-y-12 sm:translate-x-12 lg:-translate-y-16 lg:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full opacity-20 translate-y-8 -translate-x-8 sm:translate-y-10 sm:-translate-x-10 lg:translate-y-12 lg:-translate-x-12"></div>
          
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center transform rotate-12 shadow-lg">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              バーチャルアシスタント適職診断
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-2 px-2">
              🌟 あなたにぴったりの働き方を見つけましょう！ 🌟
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Ver 3.0 - 完全版
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-100">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3 sm:mb-4 flex items-center">
              <span className="mr-2">📋</span>
              診断について
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-purple-700">
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-base sm:text-lg mr-2 sm:mr-3">✨</span>
                全20問の質問にお答えください
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-base sm:text-lg mr-2 sm:mr-3">⏰</span>
                所要時間：約5-10分
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-base sm:text-lg mr-2 sm:mr-3">🎯</span>
                3つの職種タイプから適性を診断
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {Object.entries(jobTypes).map(([key, type], index) => {
              const Icon = type.icon;
              const emojis = ['🎯', '🔧', '🤝'];
              return (
                <div key={key} className={`${type.lightColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transform hover:scale-105 transition-transform duration-200 border-2 border-opacity-20 ${type.color.replace('bg-', 'border-')} touch-manipulation`}>
                  <div className="text-2xl sm:text-3xl mb-2">{emojis[index]}</div>
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-gray-700`} />
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">{type.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentStep('test')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 text-sm sm:text-base touch-manipulation active:scale-95"
          >
            <span className="mr-2">🚀</span>
            診断を開始する
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'test') {
    const question = questions[currentQuestion];
    const currentAnswer = answers[question.id];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-3 sm:p-4 lg:p-8">
        <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto">
          {/* プログレスバー - レスポンシブ */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-purple-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-1 sm:space-y-0">
              <span className="text-xs sm:text-sm font-bold text-purple-600 flex items-center">
                <span className="mr-2">📝</span>
                質問 {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-pink-600 flex items-center">
                <span className="mr-2">🎯</span>
                {Math.round(progress)}% 完了
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 w-1 sm:w-2 h-2 sm:h-3 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 質問カード - 完全レスポンシブ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden border border-purple-100">
            {/* 背景装飾 */}
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-bl from-yellow-200 to-orange-200 rounded-full opacity-10 -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 lg:-translate-y-10 lg:translate-x-10"></div>
            
            <div className="mb-6 sm:mb-8 relative z-10">
              <div className="flex items-center mb-3 sm:mb-4">
                <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                  <span className="mr-1 sm:mr-2">📂</span>
                  {question.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 leading-relaxed">
                {question.question}
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {Object.entries(question.options).map(([type, option], index) => {
                const gradients = [
                  'from-blue-50 to-indigo-50 border-blue-200',
                  'from-green-50 to-emerald-50 border-green-200',
                  'from-purple-50 to-pink-50 border-purple-200'
                ];
                
                return (
                  <div key={type} className={`border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-r ${gradients[index]} hover:shadow-md transition-all duration-200 touch-manipulation`}>
                    <p className="text-gray-700 mb-4 sm:mb-6 font-medium leading-relaxed text-sm sm:text-base">{option}</p>
                    
                    {/* モバイル最適化されたスコア選択 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex justify-between w-full sm:hidden text-xs text-gray-500 mb-2">
                        <span>😔 当てはまらない</span>
                        <span>😊 とても当てはまる</span>
                      </div>
                      
                      <span className="hidden sm:block text-sm text-gray-500 w-20 text-left font-medium">😔 当てはまらない</span>
                      
                      <div className="flex space-x-2 sm:space-x-3 flex-1 justify-center w-full">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            onClick={() => handleAnswer(question.id, type as keyof Scores, score)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-3 transition-all duration-200 font-bold text-base sm:text-lg transform hover:scale-110 active:scale-95 touch-manipulation ${
                              currentAnswer?.[type as keyof Scores] === score
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white shadow-lg scale-110'
                                : 'border-gray-300 hover:border-purple-400 text-gray-600 bg-white shadow-md'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      
                      <span className="hidden sm:block text-sm text-gray-500 w-20 text-right font-medium">😊 とても当てはまる</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ナビゲーションボタン - モバイル最適化 */}
            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center touch-manipulation active:scale-95"
              >
                <span className="mr-2">⬅️</span>
                前の質問
              </button>
              <button
                onClick={nextQuestion}
                disabled={!currentAnswer || !currentAnswer.director || !currentAnswer.specialist || !currentAnswer.assistant}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-lg transform hover:scale-105 touch-manipulation active:scale-95"
              >
                <span className="mr-2">{currentQuestion === questions.length - 1 ? '🎉' : '➡️'}</span>
                {currentQuestion === questions.length - 1 ? '結果を見る' : '次の質問'}
                {currentQuestion !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'result' && results) {
    const mainJobType = jobTypes[results.mainType];
    const MainIcon = mainJobType.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-3 sm:p-4 lg:p-8">
        <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto">
          {/* 結果ヘッダー - レスポンシブ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 relative overflow-hidden border border-purple-100">
            {/* 背景装飾 */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-yellow-200 to-orange-200 rounded-full opacity-20 -translate-y-10 translate-x-10 sm:-translate-y-12 sm:translate-x-12 lg:-translate-y-16 lg:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full opacity-20 translate-y-8 -translate-x-8 sm:translate-y-10 sm:-translate-x-10 lg:translate-y-12 lg:-translate-x-12"></div>
            
            <div className="text-center mb-6 sm:mb-8 relative z-10">
              <div className="relative mb-4 sm:mb-6">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r ${mainJobType.color.replace('bg-', 'from-')} to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-xl transform rotate-6`}>
                  <MainIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-2xl sm:text-3xl animate-bounce">🎉</div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 text-xl sm:text-2xl animate-pulse">✨</div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                🎊 診断結果 🎊
              </h1>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 border-2 border-yellow-200">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                  あなたのタイプは「{mainJobType.name}」です！
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">{mainJobType.description}</p>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base px-2">{mainJobType.detail}</p>
            </div>

            {/* レーダーチャート - レスポンシブ */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center">
                <span className="mr-2">📊</span>
                <span className="text-sm sm:text-base lg:text-xl">あなたの適性スコア</span>
                <span className="ml-2">📈</span>
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <RadarChart scores={results.scores} />
              </div>
            </div>

            {/* スコア詳細 - レスポンシブグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {Object.entries(results.scores).map(([type, score], index) => {
                const jobType = jobTypes[type as keyof Scores];
                const Icon = jobType.icon;
                const percentage = Math.round((score / 100) * 100);
                const emojis = ['🎯', '🔧', '🤝'];
                
                return (
                  <div key={type} className={`${jobType.lightColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200 border-2 ${jobType.color.replace('bg-', 'border-')} border-opacity-30 shadow-lg touch-manipulation`}>
                    <div className="text-2xl sm:text-3xl mb-2">{emojis[index]}</div>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-gray-700" />
                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">{jobType.name}</h3>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">{score}点</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{percentage}%の適性</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 詳細解説 - レスポンシブレイアウト */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-purple-100">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🚀 あなたに向いている業務 🚀
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-6 flex items-center">
                  <span className="mr-2">💼</span>
                  おすすめの業務内容
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-60 sm:max-h-80 overflow-y-auto">
                  {mainJobType.tasks.map((task, index) => (
                    <div key={index} className="flex items-center py-2 px-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow touch-manipulation">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center">
                  <span className="mr-2">🛠️</span>
                  必要なスキル
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {mainJobType.skills.map((skill, index) => (
                    <div key={index} className="flex items-center py-2 px-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow touch-manipulation">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2 sm:mr-3"></div>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl sm:rounded-2xl border-2 border-yellow-300">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2 sm:mb-3 flex items-center">
                <span className="mr-2">💰</span>
                料金相場
              </h3>
              <p className="text-yellow-700 text-xl sm:text-2xl font-bold">{mainJobType.rate}</p>
            </div>

            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl sm:rounded-2xl border-2 border-purple-300">
              <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-2 sm:mb-3 flex items-center">
                <span className="mr-2">💡</span>
                キャリアアドバイス
              </h3>
              <p className="text-purple-700 font-medium leading-relaxed text-sm sm:text-base">{mainJobType.advice}</p>
            </div>
          </div>

          {/* アクションボタン - レスポンシブ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-purple-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={resetTest}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 touch-manipulation active:scale-95 text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="mr-2">🔄</span>
                もう一度診断する
              </button>
              <button
                onClick={() => {
                  const shareText = `🎉 バーチャルアシスタント適職診断の結果：${mainJobType.name}タイプでした！✨`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'バーチャルアシスタント適職診断',
                      text: shareText,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(shareText + ' ' + window.location.href);
                    alert('🎊 結果をクリップボードにコピーしました！');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 touch-manipulation active:scale-95 text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="mr-2">📱</span>
                結果をシェア
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VACareerTest;