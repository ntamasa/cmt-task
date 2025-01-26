interface Coords {
  x: number;
  y: number;
}

interface Directions {
  dx: number;
  dy: number;
}

interface CurrentChar {
  data: string;
}

interface FieldCell {
  content: string;
}

export const searchForLines = (
  coords: Coords,
  directions: Directions,
  currentChar: CurrentChar,
  field: FieldCell[][],
  currLineCoords: Coords[],
  count: number,
  type: "inc" | "dec",
): [Coords[], number] => {
  const { x, y } = coords;
  const { dx, dy } = directions;

  for (let i = 1; i < 5; i++) {
    let nx, ny;
    if (type === "inc") {
      nx = x + i * dx;
      ny = y + i * dy;
    } else {
      nx = x - i * dx;
      ny = y - i * dy;
    }

    // prettier-ignore
    if (nx < 0 || nx >= 5 || ny < 0 || ny >= 5 || field[nx][ny].content !== currentChar.data)
          break;

    if (type === "inc") currLineCoords.push({ x: nx, y: ny });
    else currLineCoords.unshift({ x: nx, y: ny });
    count++;
  }

  return [currLineCoords, count];
};
