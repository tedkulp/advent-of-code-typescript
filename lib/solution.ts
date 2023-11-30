import { Input, Result } from "./types";

export abstract class SolutionBase {
  protected input: Input = [];

  constructor(input: Input) {
    this.input = input;
  }

  public abstract part1(): Result;
  public abstract part2(): Result;
}

export type SolutionDerevation<T extends SolutionBase> = {
  new(input: Input): T
}

