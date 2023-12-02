import { Input, Result } from "./types";

export abstract class SolutionBase {
  protected input: Input = [];
  protected rawInput: string = '';

  constructor(input: string) {
    this.rawInput = input;
    this.input = input.split('\n');
  }

  public abstract part1(): Result;
  public abstract part2(): Result;
}

export type SolutionDerevation<T extends SolutionBase> = {
  new(input: Input): T
}

