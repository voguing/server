import { FC } from "react";
import getComposeConfig from "./server/get-compose-config";
import getComposeStatus from "./server/get-compose-status";
import { Button } from "@voguing/components";

export const Host: FC<{
  host: string;
}> = async ({ host }) => {
  const { config } = await getComposeConfig(host);
  const { status } = await getComposeStatus(host);
  // docker compose ls --format json
  return (
    <div className="gap-2 flex flex-col">
      <pre className="text-xs p-4 bg-muted/40">
        <code>{status === 'running' && <Button>停止</Button>}</code>
      </pre>
      <pre className="text-xs p-4 bg-muted/40">
        <code>{config || "暂无配置"}</code>
      </pre>
    </div>
  );
};
