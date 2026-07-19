export const problemTypes = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
] as const;

export type ProblemType = (typeof problemTypes)[number];

export interface Problem {
  id: string;
  left: number;
  right: number;
  answer: number;
  type: ProblemType;
  symbol: "+" | "−" | "×" | "÷";
}

export interface ProblemTypeInfo {
  type: ProblemType;
  label: string;
  shortLabel: string;
  description: string;
  example: string;
  icon: string;
  color: "coral" | "mint" | "sun" | "grape";
}

export const problemTypeInfo: Record<ProblemType, ProblemTypeInfo> = {
  addition: {
    type: "addition",
    label: "くり上がりの たし算",
    shortLabel: "たし算",
    description: "2けたの 数を たそう",
    example: "27 + 18",
    icon: "+",
    color: "coral",
  },
  subtraction: {
    type: "subtraction",
    label: "くり下がりの ひき算",
    shortLabel: "ひき算",
    description: "2けたの 数を ひこう",
    example: "52 − 18",
    icon: "−",
    color: "mint",
  },
  multiplication: {
    type: "multiplication",
    label: "九九の かけ算",
    shortLabel: "九九",
    description: "1のだんから 9のだん",
    example: "6 × 7",
    icon: "×",
    color: "sun",
  },
  division: {
    type: "division",
    label: "かんたんな わり算",
    shortLabel: "わり算",
    description: "あまりは ないよ",
    example: "24 ÷ 6",
    icon: "÷",
    color: "grape",
  },
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function createProblem(type: ProblemType): Problem {
  if (type === "addition") {
    // 両方を2桁、答えも2桁にし、一の位で必ず繰り上がるようにする。
    while (true) {
      const left = randomInt(11, 88);
      const right = randomInt(11, 88);
      const answer = left + right;

      if (left % 10 + (right % 10) >= 10 && answer <= 99) {
        return makeProblem(type, left, right, answer, "+");
      }
    }
  }

  if (type === "subtraction") {
    // 両方を2桁、答えを正の数にし、一の位で必ず繰り下がるようにする。
    while (true) {
      const left = randomInt(21, 99);
      const right = randomInt(11, left - 1);

      if (left % 10 < right % 10) {
        return makeProblem(type, left, right, left - right, "−");
      }
    }
  }

  if (type === "multiplication") {
    const left = randomInt(1, 9);
    const right = randomInt(1, 9);
    return makeProblem(type, left, right, left * right, "×");
  }

  const right = randomInt(2, 9);
  const answer = randomInt(1, 9);
  return makeProblem(type, right * answer, right, answer, "÷");
}

function makeProblem(
  type: ProblemType,
  left: number,
  right: number,
  answer: number,
  symbol: Problem["symbol"],
): Problem {
  return {
    id: `${type}-${left}-${right}`,
    left,
    right,
    answer,
    type,
    symbol,
  };
}

export function createProblemSet(type: ProblemType, count = 10): Problem[] {
  const problems = new Map<string, Problem>();
  let safety = 0;

  while (problems.size < count && safety < 1_000) {
    const problem = createProblem(type);
    problems.set(problem.id, problem);
    safety += 1;
  }

  return [...problems.values()];
}

export function isProblemType(value: string | undefined): value is ProblemType {
  return problemTypes.includes(value as ProblemType);
}
