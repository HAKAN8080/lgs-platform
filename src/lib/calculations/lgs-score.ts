// ==============================
// LGS OPTIX LEVEL ENGINE (CLEAN)
// ==============================

// ------------------------------
// SABİTLER
// ------------------------------

export const LGS_COEFFICIENTS = {
  turkce: 4.348,
  matematik: 4.2538,
  fen: 4.123,
  inkilap: 1.666,
  din: 1.899,
  ingilizce: 1.5075,
} as const;

export const LGS_CONSTANT = 194.752082;
export const TOTAL_STUDENTS = 1200000;

// ------------------------------
// TYPES
// ------------------------------

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
  percentile: number;
  rank: number;
}

// ------------------------------
// NET HESAPLAMA
// ------------------------------

export function calculateNet(correct: number, wrong: number): number {
  return Math.max(0, correct - wrong / 3);
}

// ------------------------------
// EXPONENTIAL MODEL (470+)
// ------------------------------

function exponentialPercentile(score: number): number {
  const x1 = 480;
  const y1 = 0.6;

  const x2 = 490;
  const y2 = 0.05;

  const b = Math.log(y1 / y2) / (x2 - x1);
  const a = y1 / Math.exp(-b * x1);

  return a * Math.exp(-b * score);
}

// ------------------------------
// ORTA DİLİM TABLOSU
// ------------------------------

const MID_TABLE = [
  { score: 470, percentile: 1.5 },
  { score: 460, percentile: 3.0 },
  { score: 450, percentile: 5.0 },
  { score: 440, percentile: 8.0 },
  { score: 430, percentile: 12.0 },
  { score: 420, percentile: 16.0 },
  { score: 400, percentile: 25.0 },
  { score: 380, percentile: 35.0 },
  { score: 360, percentile: 45.0 },
  { score: 340, percentile: 55.0 },
  { score: 320, percentile: 65.0 },
  { score: 300, percentile: 75.0 },
  { score: 280, percentile: 85.0 },
  { score: 260, percentile: 92.0 },
  { score: 240, percentile: 97.0 },
  { score: 200, percentile: 100.0 },
];

// ------------------------------
// INTERPOLATION
// ------------------------------

function interpolate(
  table: { score: number; percentile: number }[],
  score: number
): number {
  for (let i = 0; i < table.length - 1; i++) {
    const upper = table[i];
    const lower = table[i + 1];

    if (score <= upper.score && score >= lower.score) {
      const ratio =
        (score - lower.score) / (upper.score - lower.score);

      return (
        lower.percentile -
        ratio * (lower.percentile - upper.percentile)
      );
    }
  }

  return table[table.length - 1].percentile;
}

// ------------------------------
// PERCENTILE ENGINE (TEK)
// ------------------------------

export function getPercentile(score: number) {
  let percentile: number;

  if (score >= 470) {
    percentile = exponentialPercentile(score);
  } else {
    percentile = interpolate(MID_TABLE, score);
  }

  percentile = Math.max(0.01, Math.min(100, percentile));

  const rank = Math.round((percentile / 100) * TOTAL_STUDENTS);

  return {
    percentile,
    rank,
    totalStudents: TOTAL_STUDENTS,
  };
}

// ------------------------------
// ANA HESAPLAMA
// ------------------------------

export function calculateLGS(inputs: Record<string, SubjectInput>): ScoreResult {
  const nets: Record<string, number> = {};
  const breakdown: Record<string, SubjectResult> = {};

  let totalNet = 0;
  let scoreContribution = 0;

  for (const [subject, { correct, wrong }] of Object.entries(inputs)) {
    const net = calculateNet(correct, wrong);

    nets[subject] = net;
    totalNet += net;

    const coefficient =
      LGS_COEFFICIENTS[
        subject as keyof typeof LGS_COEFFICIENTS
      ];

    const contribution = net * coefficient;
    scoreContribution += contribution;

    breakdown[subject] = { net, contribution };
  }

  const rawScore = scoreContribution + LGS_CONSTANT;
  const score = Math.min(500, Math.max(200, rawScore));

  const verbalNet =
    (nets.turkce || 0) +
    (nets.inkilap || 0) +
    (nets.din || 0) +
    (nets.ingilizce || 0);

  const numericalNet =
    (nets.matematik || 0) + (nets.fen || 0);

  const { percentile, rank } = getPercentile(score);

  return {
    nets,
    totalNet,
    score,
    breakdown,
    verbalNet,
    numericalNet,
    percentile,
    rank,
  };
}

// ------------------------------
// YORUM
// ------------------------------

export function getScoreInterpretation(score: number) {
  if (score >= 480) {
    return {
      label: "Mükemmel",
      color: "#059669",
      description: "Fen Lisesi seviyesi",
    };
  } else if (score >= 450) {
    return {
      label: "Çok İyi",
      color: "#10B981",
      description: "İyi Anadolu Liseleri",
    };
  } else if (score >= 400) {
    return {
      label: "İyi",
      color: "#3B82F6",
      description: "Anadolu Lisesi",
    };
  } else if (score >= 350) {
    return {
      label: "Orta",
      color: "#F59E0B",
      description: "Geliştirilmeli",
    };
  } else {
    return {
      label: "Gelişmeli",
      color: "#EF4444",
      description: "Temel eksikler var",
    };
  }
}
