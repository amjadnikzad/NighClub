import { customAlphabet, nanoid } from "nanoid";

export const createGameID = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTWXYZ',
    6
);

export const createUserID = () => nanoid();