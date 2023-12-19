import { expect, test } from "bun:test";
import Solution from "./solution";

const year = 2023;
const day = 8;
const pathBits = `years/${year}/${String(day).padStart(2, '0')}`;

const data1 = await Bun.file(`./${pathBits}/test_input_1.txt`).text();
const data1a = await Bun.file(`./${pathBits}/test_input_1a.txt`).text();
const data2 = await Bun.file(`./${pathBits}/test_input_2.txt`).text();

const sol1 = new Solution(data1);
const sol1a = new Solution(data1a);
const sol2 = new Solution(data2);

test("test solution 1", () => {
  expect(sol1.part1()).toBe(2);
});

test("test solution 1a", () => {
  expect(sol1a.part1()).toBe(6);
});

test("test solution 2", () => {
  expect(sol2.part2()).toBe(6);
});
