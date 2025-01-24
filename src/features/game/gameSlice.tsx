import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../assets/fieldData";
import { FieldDataType } from "../../assets/fieldDataType";
import { Field } from "../../assets/Field";

const initialState = {
  status: "starting", // starting, playing, finished
  lines: 0,
  currentCharIndex: 0,
  field: data,
  usedCells: [],
  message: "",
};

const CHARACTERS: FieldDataType[] = [
  FieldDataType.OCCUPIED_C,
  FieldDataType.OCCUPIED_M,
  FieldDataType.OCCUPIED_T,
];

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    init() {
      return initialState;
    },
    setField(state, action) {
      state.status !== "playing" && (state.status = "playing");

      state.field.map((row: Field[]) =>
        row.map((cell) =>
          cell.id === action.payload
            ? (cell.content = CHARACTERS[state.currentCharIndex])
            : cell,
        ),
      );
      state.currentCharIndex =
        state.currentCharIndex > 1 ? 0 : state.currentCharIndex + 1;
    },
    // start(state, action) {},
    finish(state) {
      state.status = "finished";

      if (state.lines === 0) state.message = "You have no lines, try again!";
      else state.message = `Congratulations, you have ${state.lines} lines!`;
    },
  },
});

export default gameSlice.reducer;

export const { setField, finish, init } = gameSlice.actions;
