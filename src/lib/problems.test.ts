import { describe, expect, it } from "vitest";
import { createProblem, createProblemSet } from "./problems";

describe("createProblem", () => {
  it("creates two-digit addition with carrying and a two-digit answer", () => {
    for (let index = 0; index < 200; index += 1) {
      const problem = createProblem("addition");
      expect(problem.left).toBeGreaterThanOrEqual(10);
      expect(problem.right).toBeGreaterThanOrEqual(10);
      expect(problem.left % 10 + (problem.right % 10)).toBeGreaterThanOrEqual(10);
      expect(problem.answer).toBe(problem.left + problem.right);
      expect(problem.answer).toBeLessThanOrEqual(99);
    }
  });

  it("creates two-digit subtraction that requires borrowing", () => {
    for (let index = 0; index < 200; index += 1) {
      const problem = createProblem("subtraction");
      expect(problem.left % 10).toBeLessThan(problem.right % 10);
      expect(problem.answer).toBe(problem.left - problem.right);
      expect(problem.answer).toBeGreaterThan(0);
    }
  });

  it("creates multiplication problems from the 1–9 times tables", () => {
    for (let index = 0; index < 200; index += 1) {
      const problem = createProblem("multiplication");
      expect(problem.left).toBeGreaterThanOrEqual(1);
      expect(problem.left).toBeLessThanOrEqual(9);
      expect(problem.right).toBeGreaterThanOrEqual(1);
      expect(problem.right).toBeLessThanOrEqual(9);
      expect(problem.answer).toBe(problem.left * problem.right);
    }
  });

  it("creates exact division with a one-digit divisor and quotient", () => {
    for (let index = 0; index < 200; index += 1) {
      const problem = createProblem("division");
      expect(problem.left % problem.right).toBe(0);
      expect(problem.right).toBeGreaterThanOrEqual(2);
      expect(problem.right).toBeLessThanOrEqual(9);
      expect(problem.answer).toBeGreaterThanOrEqual(1);
      expect(problem.answer).toBeLessThanOrEqual(9);
    }
  });
});

describe("createProblemSet", () => {
  it("creates ten unique problems", () => {
    const problems = createProblemSet("multiplication");
    expect(problems).toHaveLength(10);
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(10);
  });
});
