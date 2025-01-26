import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Button from "./components/Button";
import { Board } from "./features/game/Board";
import { init } from "./features/game/gameSlice";
import Message from "./components/Message";

function App() {
  const dispatch = useDispatch();
  const { status, message } = useSelector((store: any) => store.game);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {status === "starting" && (
        <Message styles={"mb-10"}>Game is starting...</Message>
      )}
      {status === "playing" && (
        <Message styles={"mb-10"}>
          Score points by creating lines, horizontally, vertically or diagonally
        </Message>
      )}
      {status === "finished" && <Message styles={"mb-10"}>{message}</Message>}

      <Board />
      <Button onClick={() => dispatch(init())}>Click me</Button>
    </main>
  );
}

export default App;
