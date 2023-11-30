import { SolutionDerevation, SolutionBase } from "./solution";

type Input = string[];
type Result = any;

type ModuleImport = {
  default: SolutionDerevation<SolutionBase>;
};

export { Input, Result, ModuleImport };
