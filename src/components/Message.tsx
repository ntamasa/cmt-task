import { ReactNode } from "react";

interface MessageProps {
  children: ReactNode;
  styles?: string;
}

function Message({ children, styles = "" }: MessageProps) {
  return <p className={"text-2xl font-bold " + styles}>{children}</p>;
}

export default Message;
