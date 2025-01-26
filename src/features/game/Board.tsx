import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { finish, init } from "./gameSlice";
import { Cell } from "./Cell";
import { Field } from "../../assets/Field";

export const Board = () => {
  const dispatch = useDispatch();
  const { status, field } = useSelector((store: any) => store.game);

  useEffect(() => {
    if (status === "starting") dispatch(init());

    if (status === "finished") dispatch(finish());
  }, [dispatch, status, field]);

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
