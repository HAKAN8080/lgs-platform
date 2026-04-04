// LGS Resmi Puan Katsayıları
// Kaynak: MEB LGS puan hesaplama formülü
export const LGS_COEFFICIENTS = {
  turkce: 4.348,
  matematik: 4.2538,
  fen: 4.1230,
  inkilap: 1.666,
  din: 1.899,
  ingilizce: 1.5075,
} as const;

// Teorik katsayılar (referans için)
export const LGS_BASE_COEFFICIENTS = {
  turkce: 4,
  matematik: 4,
  fen: 4,
  inkilap: 1,
  din: 1,
  ingilizce: 1,
} as const;

// Resmi sabit katsayı
export const LGS_CONSTANT = 194.752082;

export const QUESTION_COUNTS = {
  turkce: 20,
  matematik: 20,
  fen: 20,
  inkilap: 10,
  din: 10,
  ingilizce: 10,
} as const;

export const SUBJECTS = [
  { key: 'turkce', label: 'Türkçe', icon: '📖', max: 20, color: '#3B82F6' },
  { key: 'matematik', label: 'Matematik', icon: '🔢', max: 20, color: '#8B5CF6' },
  { key: 'fen', label: 'Fen Bilimleri', icon: '🔬', max: 20, color: '#10B981' },
  { key: 'inkilap', label: 'İnkılap Tarihi', icon: '📜', max: 10, color: '#F59E0B' },
  { key: 'din', label: 'Din Kültürü', icon: '🕌', max: 10, color: '#EC4899' },
  { key: 'ingilizce', label: 'İngilizce', icon: '🌍', max: 10, color: '#06B6D4' },
] as const;

export interface SubjectInput {
  correct: number;
  wrong: number;
}

export interface SubjectResult {
  net: number;
  contribution: number;
}

export interface ScoreResult {
  nets: Record<string, number>;
  totalNet: number;
  score: number;
  breakdown: Record<string, SubjectResult>;
  verbalNet: number;
  numericalNet: number;
}

// Net hesaplama: Doğru - (Yanlış / 3)
export function calculateNet(correct: number, wrong: number): number {
  return Math.max(0, correct - wrong / 3);
}

// LGS Puan hesaplama
// Formül: Σ(Net × Katsayı) + Sabit
export function calculateLGSScore(inputs: Record<string, SubjectInput>): ScoreResult {
  const nets: Record<string, number> = {};
  const breakdown: Record<string, SubjectResult> = {};

  let totalNet = 0;
  let scoreContribution = 0;

  for (const [subject, { correct, wrong }] of Object.entries(inputs)) {
    const net = calculateNet(correct, wrong);
    nets[subject] = net;
    totalNet += net;

    const coefficient = LGS_COEFFICIENTS[subject as keyof typeof LGS_COEFFICIENTS];
    const contribution = net * coefficient;
    scoreContribution += contribution;

    breakdown[subject] = { net, contribution };
  }

  // Resmi LGS formülü: Toplam Katkı + Sabit Katsayı
  const rawScore = scoreContribution + LGS_CONSTANT;
  const score = Math.min(500, Math.max(200, rawScore));

  // Sözel ve Sayısal net (toplam soru sayıları: sözel 50, sayısal 40)
  const verbalNet = (nets.turkce || 0) + (nets.inkilap || 0) + (nets.din || 0) + (nets.ingilizce || 0);
  const numericalNet = (nets.matematik || 0) + (nets.fen || 0);

  return {
    nets,
    totalNet,
    score,
    breakdown,
    verbalNet,
    numericalNet,
  };
}

// Puan yorumu
export function getScoreInterpretation(score: number): { label: string; color: string; description: string } {
  if (score >= 480) {
    return { label: 'Mükemmel', color: '#059669', description: 'Fen Lisesi ve nitelikli okullar seviyesi' };
  } else if (score >= 450) {
    return { label: 'Çok İyi', color: '#10B981', description: 'İyi Anadolu Liseleri seviyesi' };
  } else if (score >= 400) {
    return { label: 'İyi', color: '#3B82F6', description: 'Anadolu Lisesi seviyesi' };
  } else if (score >= 350) {
    return { label: 'Orta', color: '#F59E0B', description: 'Geliştirilmeli, düzenli çalışma gerekli' };
  } else if (score >= 250) {
    return { label: 'Gelişmeli', color: '#EF4444', description: 'Temel eksiklerini kapatmalısın' };
  } else {
    return { label: 'Acil Destek', color: '#7F1A1A', description: 'Konu eksiklerini belirleyip çalışmaya başla' };
  }
}

// 2025 LGS Yüzdelik Dilim Tahmini (yaklaşık 1.200.000 öğrenci bazında)
// NOT: Bu değerler tahminidir, gerçek MEB verileri ile güncellenmelidir
const PERCENTILE_TABLE = [
  { score: 500, percentile: 0.01, rank: 120 },
  { score: 495, percentile: 0.02, rank: 240 },
  { score: 490, percentile: 0.05, rank: 600 },
  { score: 485, percentile: 0.10, rank: 1200 },
  { score: 480, percentile: 0.20, rank: 2400 },
  { score: 475, percentile: 0.35, rank: 4200 },
  { score: 470, percentile: 0.50, rank: 6000 },
  { score: 465, percentile: 0.75, rank: 9000 },
  { score: 460, percentile: 1.00, rank: 12000 },
  { score: 455, percentile: 1.50, rank: 18000 },
  { score: 450, percentile: 2.00, rank: 24000 },
  { score: 445, percentile: 2.75, rank: 33000 },
  { score: 440, percentile: 3.50, rank: 42000 },
  { score: 435, percentile: 4.50, rank: 54000 },
  { score: 430, percentile: 5.50, rank: 66000 },
  { score: 425, percentile: 7.00, rank: 84000 },
  { score: 420, percentile: 8.50, rank: 102000 },
  { score: 415, percentile: 10.00, rank: 120000 },
  { score: 410, percentile: 12.00, rank: 144000 },
  { score: 405, percentile: 14.00, rank: 168000 },
  { score: 400, percentile: 16.00, rank: 192000 },
  { score: 390, percentile: 20.00, rank: 240000 },
  { score: 380, percentile: 25.00, rank: 300000 },
  { score: 370, percentile: 30.00, rank: 360000 },
  { score: 360, percentile: 35.00, rank: 420000 },
  { score: 350, percentile: 40.00, rank: 480000 },
  { score: 340, percentile: 45.00, rank: 540000 },
  { score: 330, percentile: 50.00, rank: 600000 },
  { score: 320, percentile: 55.00, rank: 660000 },
  { score: 310, percentile: 60.00, rank: 720000 },
  { score: 300, percentile: 65.00, rank: 780000 },
  { score: 280, percentile: 75.00, rank: 900000 },
  { score: 260, percentile: 85.00, rank: 1020000 },
  { score: 240, percentile: 92.00, rank: 1104000 },
  { score: 220, percentile: 97.00, rank: 1164000 },
  { score: 200, percentile: 100.00, rank: 1200000 },
];

export interface PercentileResult {
  percentile: number;      // Yüzdelik dilim (örn: 2.5 = ilk %2.5)
  rank: number;            // Tahmini sıralama
  totalStudents: number;   // Toplam öğrenci sayısı
  topPercent: number;      // İlk yüzde kaçta (örn: 2.5)
}

export function getPercentile(score: number): PercentileResult {
  const totalStudents = 1200000;
  const highest = PERCENTILE_TABLE[0];
  const lowest = PERCENTILE_TABLE[PERCENTILE_TABLE.length - 1];

  if (score >= highest.score) {
    return {
      percentile: highest.percentile,
      rank: highest.rank,
      totalStudents,
      topPercent: highest.percentile,
    };
  }

  if (score <= lowest.score) {
    return {
      percentile: lowest.percentile,
      rank: lowest.rank,
      totalStudents,
      topPercent: lowest.percentile,
    };
  }

  // Aynı puan için tam eşleşme varsa doğrudan kullan.
  const exact = PERCENTILE_TABLE.find(p => p.score === score);
  if (exact) {
    return {
      percentile: exact.percentile,
      rank: exact.rank,
      totalStudents,
      topPercent: exact.percentile,
    };
  }

  // İki değer arasında interpolasyon yap
  let lower = lowest;
  let upper = highest;

  for (let i = 0; i < PERCENTILE_TABLE.length - 1; i++) {
    if (score <= PERCENTILE_TABLE[i].score && score > PERCENTILE_TABLE[i + 1].score) {
      upper = PERCENTILE_TABLE[i];
      lower = PERCENTILE_TABLE[i + 1];
      break;
    }
  }

  // Lineer interpolasyon
  const ratio = (score - lower.score) / (upper.score - lower.score);
  const percentile = lower.percentile - (ratio * (lower.percentile - upper.percentile));
  const rank = Math.round(lower.rank - (ratio * (lower.rank - upper.rank)));
  const normalizedPercentile = Math.round(Math.max(0.01, Math.min(100, percentile)) * 100) / 100;

  return {
    percentile: normalizedPercentile,
    rank: Math.max(1, Math.min(totalStudents, rank)),
    totalStudents,
    topPercent: normalizedPercentile,
  };
}
