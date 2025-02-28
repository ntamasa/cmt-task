import { useDispatch } from "react-redux";
import { FieldDataType } from "../../assets/fieldDataType";
import { setField } from "./gameSlice";
import { Field } from "../../assets/Field";

interface CellProps {
  cell: Field;
}

export const Cell = ({ cell }: CellProps) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (cell.content !== FieldDataType.UNOCCUPIED) return;

    dispatch(setField(cell.id));
  };

  return (
    <td
      className="h-10 w-10 cursor-pointer border border-black text-center font-semibold"
      style={{
        color: cell.color,
      }}
      onClick={handleClick}
    >
      {cell.content}
    </td>
  );
};
