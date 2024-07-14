"use client";

import { Button, Textarea } from "@voguing/components";
import {
  composeChange,
  composeStart,
  composeStop,
  composeRestart,
  composeSaveAndRestart,
} from "../server/compose";
import { useState } from "react";

const HostClient = ({ config, status, host }: any) => {
  const [value, setValue] = useState(config);
  let buttonList: any[] = [];
  // 安装 docker 的
  buttonList.push(<Button key="install-docker">安装 docker</Button>);
  buttonList.push(
    <Button
      key="restart"
      variant="outline"
      onClick={() => composeRestart(host)}
    >
      全部重启
    </Button>
  );
  buttonList.push(
    <Button
      key="save"
      disabled={config === value}
      variant="outline"
      onClick={() => composeChange(host, value)}
    >
      保存配置
    </Button>
  );
  buttonList.push(
    <Button
      key="save"
      disabled={config === value}
      variant="outline"
      onClick={() => composeSaveAndRestart(host, value)}
    >
      保存并重启配置
    </Button>
  );
  if (status === "running") {
    buttonList.push(
      <Button
        key="stop"
        variant="destructive"
        onClick={() => composeStop(host)}
      >
        全部停止
      </Button>
    );
  } else {
    buttonList.push(
      <Button key="start" onClick={() => composeStart(host)}>
        全部启动
      </Button>
    );
  }

  return (
    <div className="gap-2 flex flex-col">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={20}
        className="font-mono text-xs"
      />

      {Boolean(buttonList.length) && (
        <pre className="text-xs p-4 bg-muted/60 flex gap-4 justify-end rounded">
          {buttonList}
        </pre>
      )}
    </div>
  );
};

export default HostClient;
