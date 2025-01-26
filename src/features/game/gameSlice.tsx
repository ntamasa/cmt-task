import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../assets/fieldData";
import { FieldDataType } from "../../assets/fieldDataType";
import { Field } from "../../assets/Field";

const initialState = {
  status: "starting", // starting, playing, finished
  lines: 0,
  currentCharIndex: 0,
  field: data,
  message: "",
  isFinished: false,
};

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
    // TODO store existing lines separately, and check them separately
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
      const directions = [
        { dx: 0, dy: 1 }, // horizontal
        { dx: 1, dy: 0 }, // vertical
        { dx: 1, dy: -1 }, // diagonal up-right and down-left
        { dx: 1, dy: 1 }, // diagonal up-left and down-right
      ];

      directions.forEach(({ dx, dy }) => {
        let count = 1;
        const currLineCoords = [{ x, y }];

        // positive direction
        for (let i = 1; i < 5; i++) {
          const nx = x + i * dx;
          const ny = y + i * dy;

          if (
            nx >= 0 &&
            nx < 5 &&
            ny >= 0 &&
            ny < 5 &&
            state.field[nx][ny].content === currentChar.data
          ) {
            currLineCoords.unshift({ x: nx, y: ny });
            count++;
          } else break;
        }

        for (let i = 1; i < 5; i++) {
          const nx = x - i * dx;
          const ny = y - i * dy;

          if (
            nx >= 0 &&
            nx < 5 &&
            ny >= 0 &&
            ny < 5 &&
            state.field[nx][ny].content === currentChar.data
          ) {
            currLineCoords.push({ x: nx, y: ny });
            count++;
          } else break;
        }

        // if line is long enough
        if (count >= 3) {
          // and it isn't connected to an already existing line
          if (
            currLineCoords.every(
              (node) => state.field[node.x][node.y].color === "black",
            )
          )
            state.lines++; // increment the number of lines

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
      state.status = "finished";

      if (state.lines === 0) state.message = "You have no lines, try again!";
      else state.message = `Congratulations, you have ${state.lines} lines!`;
    },
  },
});

export default gameSlice.reducer;

export const { init, setField, finish } = gameSlice.actions;
