import { FC } from "react";
import getComposeConfig from "./server/get-compose-config";
export const Host: FC<{
  host: string;
}> = async ({ host }) => {
  const { config } = await getComposeConfig(host);
  return (
    <pre className="text-xs p-4 bg-muted/40">
      <code>{config || "暂无配置"}</code>
    </pre>
  );
};
