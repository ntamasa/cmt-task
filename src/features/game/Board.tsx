import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { init } from "./gameSlice";
import { Cell } from "./Cell";
import { Field } from "../../assets/Field";

export const Board = () => {
  const dispatch = useDispatch();
  const { field } = useSelector((store: any) => store.game);

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  return (
    <table className="mx-auto">
      <tbody>
        {field.map((row: Field[], rowIndex: number) => (
          <tr key={rowIndex} className="border">
            {row.map((cell: Field) => (
              <Cell key={cell.id} cell={cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
