import {
  getHandSize,
  getEmptyDiscardPile,
  getEmptyPiles,
  mapToColours,
  getColours,
} from "../src/api";
import * as _ from "lodash";

describe("getHandSize", () => {
  it("Returns 5 for 2 or 3 players", () => {
    expect(getHandSize(2)).toBe(5);
    expect(getHandSize(3)).toBe(5);
  });
  it("Returns 4 for 4 or 5 players", () => {
    expect(getHandSize(4)).toBe(4);
    expect(getHandSize(5)).toBe(4);
  });
});

const basicColours = getColours("basic");
const rainbowColours = getColours("rainbow");

describe("mapToColours", () => {
  it("Maps a value to keys of basic colours", () => {
    const value = 1;
    const res = mapToColours(value, "basic");
    expect(Object.keys(res)).toHaveLength(basicColours.length);
    expect(_.every(Object.values(res), val => val === value)).toBeTruthy;
  });
  it("Maps a value to keys of colours including rainbow", () => {
    const value = 2;
    const res = mapToColours(value, "rainbow");
    expect(Object.keys(res)).toHaveLength(rainbowColours.length);
    expect(_.every(Object.values(res), val => val === value)).toBeTruthy;
  });
});

describe("getEmptyPiles", () => {
  it("Creates basic empty piles", () => {
    const piles = getEmptyPiles("basic");
    expect(Object.keys(piles)).toHaveLength(basicColours.length);
    expect(piles["red"]).toEqual(0);
  });
  it("Creates rainbow empty piles", () => {
    const piles = getEmptyPiles("rainbow");
    expect(Object.keys(piles)).toHaveLength(rainbowColours.length);
    expect(piles["rainbow"]).toEqual(0);
  });
});

describe("getEmptyDiscardPile", () => {
  it("Creates basic empty discard piles", () => {
    const piles = getEmptyDiscardPile("basic");
    expect(Object.keys(piles)).toHaveLength(basicColours.length);
    expect(piles["red"]).toEqual([]);
  });
  it("Creates rainbow empty discard piles", () => {
    const piles = getEmptyDiscardPile("rainbow");
    expect(Object.keys(piles)).toHaveLength(rainbowColours.length);
    expect(piles["rainbow"]).toEqual([]);
  });
});
