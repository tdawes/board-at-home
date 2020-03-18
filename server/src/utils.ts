import * as _ from "lodash";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const randomLetter = () =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

export const randomCode = (length: number) =>
  _.range(length)
    .map(() => randomLetter())
    .join("");
