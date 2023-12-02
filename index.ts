import { Cli } from 'clipanion';

import RunCommand from './lib/commands/run';
import TestCommand from './lib/commands/test';
import SetupCommand from './lib/commands/setup';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `Advent of Code`,
  binaryName: `${node} ${app}`,
  binaryVersion: `1.0.0`,
});

cli.register(RunCommand);
cli.register(TestCommand);
cli.register(SetupCommand);

cli.runExit(args);
