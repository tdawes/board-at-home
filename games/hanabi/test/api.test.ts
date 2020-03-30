import { getHandSize } from "../src/api";

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
