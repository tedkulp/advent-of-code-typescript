import { expect, test } from "bun:test";
import Solution from "./solution";

const year = 2023;
const day = 7;
const pathBits = `years/${year}/${String(day).padStart(2, '0')}`;

const data1 = await Bun.file(`./${pathBits}/test_input_1.txt`).text();
const data2 = await Bun.file(`./${pathBits}/test_input_2.txt`).text();

const sol1 = new Solution(data1);
const sol2 = new Solution(data2);

test("test solution 1", () => {
  expect(sol1.part1()).toBe(6440);
});

test("count cards", () => {
  expect(sol1.calculateScore('AKQJT')).toBe(55);
  expect(sol1.calculateScore('99872')).toBe(30);
});

test("sort hands", () => {
  expect(sol1.sortHands(['99872', 'AKQJT', '2232T'])).toEqual(['AKQJT', '99872', '2232T']);
});

test("compare cards", () => {
  expect(sol1.compareCards('A', 'K')).toBe(1);
  expect(sol1.compareCards('K', 'A')).toBe(-1);
  expect(sol1.compareCards('K', 'K')).toBe(0);
  expect(sol1.compareCards('3', 'T')).toBe(-1);
});

test("hand types", () => {
  expect(sol1.handType('AAAAA')).toEqual('5ofakind');
  expect(sol1.handType('AA9AA')).toEqual('4ofakind');
  expect(sol1.handType('A3A9A')).toEqual('3ofakind');
  expect(sol1.handType('AAAQQ')).toEqual('FullHouse');
  expect(sol1.handType('AA3QQ')).toEqual('2pair');
  expect(sol1.handType('AA3QJ')).toEqual('1pair');
  expect(sol1.handType('A825Q')).toEqual('HighCard');
});

test("compare hands", () => {
  expect(sol1.compareHands('AAAAQ', 'AAAAA')).toBe(-1);
  expect(sol1.compareHands('AAAAK', 'AAAAA')).toBe(-1);
  expect(sol1.compareHands('AAAAA', 'AAAAA')).toBe(0);
  expect(sol1.compareHands('AAAAA', 'AAAAK')).toBe(1);
});

test("sort hands by card", () => {
  expect(sol1.sortHandsByCard(['AAAAQ', 'AAAAK', 'AAAAA'])).toEqual(['AAAAA', 'AAAAK', 'AAAAQ']);
  expect(sol1.sortHandsByCard(['QAAAA', 'KAAAA', 'AAAAA'])).toEqual(['AAAAA', 'KAAAA', 'QAAAA']);
});

test("test solution 2", () => {
  expect(sol2.part2()).toBe(5905);
});
