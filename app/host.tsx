import { FC } from "react";

export const Host: FC<{
  host: string;
}> = ({ host }) => {
  return <code>{`${host}: docker run -d -p 80:80 nginx`}</code>;
};
