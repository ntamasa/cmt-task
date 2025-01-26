import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../assets/fieldData";
import { FieldDataType } from "../../assets/fieldDataType";
import { Field } from "../../assets/Field";

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

      state.field.map((row: Field[], x: number) =>
        row.map((cell, y: number) => {
          if (cell.id === action.payload) {
            coords = { x, y };
            cell.content = currentChar.data;
          } else return cell;
        }),
      );

      state.currentCharIndex =
        state.currentCharIndex > 1 ? 0 : state.currentCharIndex + 1;

      // check if new horizontal line was created
      const { x, y } = coords;

      DIRECTIONS.forEach(({ dx, dy }, i) => {
        let count = 1;
        const currLineCoords = [{ x, y }];

        // positive direction
        for (let i = 1; i < 5; i++) {
          const nx = x + i * dx;
          const ny = y + i * dy;

          if (
            nx < 0 ||
            nx >= 5 ||
            ny < 0 ||
            ny >= 5 ||
            state.field[nx][ny].content !== currentChar.data
          )
            break;

          currLineCoords.push({ x: nx, y: ny });
          count++;
        }

        for (let i = 1; i < 5; i++) {
          const nx = x - i * dx;
          const ny = y - i * dy;

          if (
            nx < 0 ||
            nx >= 5 ||
            ny < 0 ||
            ny >= 5 ||
            state.field[nx][ny].content !== currentChar.data
          )
            break;

          currLineCoords.unshift({ x: nx, y: ny });
          count++;
        }

        // if line is long enough
        if (count >= 3) {
          // and it isn't connected to an already existing line
          if (
            currLineCoords.every(
              (node) => state.field[node.x][node.y].color === "black",
            ) ||
            // or it isn't an already existing line's part
            !state.lines[i].some((line) =>
              line.some((node) =>
                currLineCoords.some(
                  (coord) => coord.x === node.x && coord.y === node.y,
                ),
              ),
            )
          )
            state.lines[i].push(currLineCoords);

          // change color of the line
          currLineCoords.forEach((node) => {
            state.field[node.x][node.y].color = currentChar.color;
          });
        }
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
