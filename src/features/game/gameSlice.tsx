import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../assets/fieldData";
import { FieldDataType } from "../../assets/fieldDataType";
import { Field } from "../../assets/Field";
import { searchForLines } from "../../utils/searchForLines";

const initialState: {
  status: string;
  lines: { x: number; y: number }[][][];
  currentCharIndex: number;
  field: Field[][];
  message: string;
  isFinished: boolean;
} = {
  status: "starting", // starting, playing, finished
  lines: [[], [], [], []], // hor, ver, diag-inc, diag-dec
  currentCharIndex: 0,
  field: data,
  message: "",
  isFinished: false,
};

const DIRECTIONS = [
  { dx: 0, dy: 1 }, // horizontal
  { dx: 1, dy: 0 }, // vertical
  { dx: 1, dy: -1 }, // diagonal up-right and down-left
  { dx: 1, dy: 1 }, // diagonal up-left and down-right
];

const CHARACTERS = [
  { data: FieldDataType.OCCUPIED_C, color: "green" },
  { data: FieldDataType.OCCUPIED_M, color: "blue" },
  { data: FieldDataType.OCCUPIED_T, color: "red" },
];

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    init() {
      return initialState;
    },
    setField(state, action) {
      if (state.status !== "playing") state.status = "playing";

      const currentChar = CHARACTERS[state.currentCharIndex];
      let coords = { x: 0, y: 0 };

      // change cell content to the next in line
      state.field.map((row: Field[], x: number) =>
        row.map((cell, y: number) => {
          if (cell.id === action.payload) {
            coords = { x, y };
            cell.content = currentChar.data;
          } else return cell;
        }),
      );

      // move index to the next character
      state.currentCharIndex =
        state.currentCharIndex > 1 ? 0 : state.currentCharIndex + 1;

      // check if new line was created,
      const { x, y } = coords;
      DIRECTIONS.forEach(({ dx, dy }, i) => {
        let count = 1;
        let currLineCoords = [{ x, y }];

        // positive direction
        [currLineCoords, count] = searchForLines(
          coords,
          { dx, dy },
          currentChar,
          state.field,
          currLineCoords,
          count,
          "inc",
        );

        // negative direction
        [currLineCoords, count] = searchForLines(
          coords,
          { dx, dy },
          currentChar,
          state.field,
          currLineCoords,
          count,
          "dec",
        );

        // if line is not long enough
        if (count < 3) return;

        // if it's a new line
        if (
          currLineCoords.every(
            (node) => state.field[node.x][node.y].color === "black",
          ) ||
          // or it isn't an already existing line's part (one node can be part of multiple lines)
          !state.lines[i].some((line) =>
            line.some((node) =>
              currLineCoords.some(
                (coord) => coord.x === node.x && coord.y === node.y,
              ),
            ),
          )
        )
          state.lines[i].push(currLineCoords);

        // change color of the line, and update stored line with new node
        currLineCoords.forEach((node) => {
          state.field[node.x][node.y].color = currentChar.color;
        });

        // update lines if new line is connected to an existing one
        const existingLineIndex = state.lines[i].findIndex((line) =>
          line.some((node) =>
            currLineCoords.some(
              (coord) => coord.x === node.x && coord.y === node.y,
            ),
          ),
        );

        if (existingLineIndex === -1) return;

        // update line with new nodes
        const existingLine = state.lines[i][existingLineIndex];
        const updatedLine = [
          ...existingLine,
          ...currLineCoords.filter(
            (coord) =>
              !existingLine.some(
                (node) => node.x === coord.x && node.y === coord.y,
              ),
          ),
        ];
        state.lines[i][existingLineIndex] = updatedLine;
      });

      // if every cell is used, finish the game
      if (
        state.field.every((row) =>
          row.every((cell) => cell.content !== FieldDataType.UNOCCUPIED),
        )
      )
        state.status = "finished";
    },
    finish(state) {
      // derive number of lines from lines array
      const linesCount = state.lines.reduce(
        (acc, lines) => acc + lines.length,
        0,
      );
      state.status = "finished";

      if (linesCount === 0) state.message = "You have no lines, try again!";
      else state.message = `Congratulations, you have ${linesCount} lines!`;
    },
  },
});

export default gameSlice.reducer;

export const { init, setField, finish } = gameSlice.actions;
