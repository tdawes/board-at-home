import { isFinished, getInitialBoard } from "../../src/engine/board";
import { Board, mapToColours } from "../../src/api";
import { defaultConfig } from "../../src/client";
import * as _ from "lodash";

describe("isFinished", () => {
  const basicConfig = {
    royalFavour: false,
    ...defaultConfig,
  };
  const board: Board = getInitialBoard(2, defaultConfig);
  const fullPiles = mapToColours(5);
  it("returns false for an initial state", () => {
    expect(isFinished(board, 0, basicConfig.royalFavour)).toBeFalsy();
  });
  it("return true if all piles have been completed", () => {
    expect(
      isFinished({ ...board, piles: fullPiles }, 0, basicConfig.royalFavour),
    ).toBeTruthy();
  });
  it("return true if there are no fuse tokens left", () => {
    expect(
      isFinished({ ...board, fuseTokens: 0 }, 0, basicConfig.royalFavour),
    ).toBeTruthy();
  });
  it("return false if we have not yet completed a full round since running out of cards in a normal game", () => {
    expect(
      isFinished({ ...board, deck: [] }, 0, basicConfig.royalFavour, 1),
    ).toBeFalsy();
  });
  it("return true if we have completed a full round since running out of cards in a normal game", () => {
    expect(
      isFinished({ ...board, deck: [] }, 0, basicConfig.royalFavour, 0),
    ).toBeTruthy();
  });

  // Royal Favour variant
  const rfConfig = {
    ...defaultConfig,
    royalFavour: true,
  };
  const rfBoard: Board = getInitialBoard(2, rfConfig);
  it("returns false for an initial state  in RF", () => {
    expect(isFinished(rfBoard, 0, rfConfig.royalFavour)).toBeFalsy();
  });
  it("return true if all piles have been completed  in RF", () => {
    expect(
      isFinished({ ...rfBoard, piles: fullPiles }, 0, rfConfig.royalFavour),
    ).toBeTruthy();
  });
  it("return true if there are no fuse tokens left in RF", () => {
    expect(
      isFinished({ ...rfBoard, fuseTokens: 0 }, 0, rfConfig.royalFavour),
    ).toBeTruthy();
  });
  it("return true if any pile can no longer be completed in RF", () => {
    expect(
      isFinished(
        {
          ...rfBoard,
          discardPile: {
            ...rfBoard.discardPile,
            red: [{ colour: "red", num: 5 }],
          },
        },
        0,
        rfConfig.royalFavour,
      ),
    ).toBeTruthy();
  });
  it("return true if a player runs out of cards in RF", () => {
    expect(
      isFinished(
        { ...rfBoard, hands: [[], ...rfBoard.hands] },
        0,
        rfConfig.royalFavour,
      ),
    ).toBeTruthy();
  });
});
