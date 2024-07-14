import { Button, Textarea } from "@voguing/components";
import { FC } from "react";
import getComposeConfig from "../server/get-compose-config";
import getComposeStatus from "../server/get-compose-status";

export const Host: FC<{
  host: string;
}> = async ({ host }) => {
  const { config } = await getComposeConfig(host);
  const { status } = await getComposeStatus(host);
  let buttonList: any[] = [];
  if (status === "running") {
    buttonList = buttonList.concat([
      <Button key="stop" variant="destructive">
        全部停止
      </Button>,
      <Button key="restart" variant="outline">
        全部重启
      </Button>,
    ]);
  }
  buttonList.push(
    <Button key="save" variant="outline">
      保存配置
    </Button>
  );

  return (
    <div className="gap-2 flex flex-col">
      {config ? (
        <Textarea
          defaultValue={config}
          readOnly
          rows={20}
          className="font-mono text-xs"
        />
      ) : (
        <pre className="text-xs p-4 bg-muted/40">
          <code>{"暂无配置"}</code>
        </pre>
      )}
      {Boolean(buttonList.length) && (
        <pre className="text-xs p-4 bg-muted/60 flex gap-4 justify-end rounded">
          {buttonList}
        </pre>
      )}
    </div>
  );
};
