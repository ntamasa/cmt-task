import { useDispatch, useSelector } from "react-redux";
import { FieldDataType } from "../../assets/fieldDataType";
import { setField } from "./gameSlice";
import { Field } from "../../assets/Field";
import { useEffect } from "react";

interface CellProps {
  cell: Field;
}

export const Cell = ({ cell }: CellProps) => {
  const dispatch = useDispatch();
  const { lines } = useSelector((store: any) => store.game);

  useEffect(() => {
    console.log(lines);
  }, [lines]);

  const handleClick = () => {
    if (cell.content !== FieldDataType.UNOCCUPIED) return;

    dispatch(setField(cell.id));
  };

  return (
    <td
      className={`h-10 w-10 cursor-pointer border border-black text-center font-semibold ${cell.content && "cursor-pointer"} text-${cell.color}${cell.color !== "black" ? "-500" : ""}`}
      onClick={handleClick}
    >
      {cell.content}
    </td>
  );
};
