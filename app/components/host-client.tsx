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
import { dockerInstall } from "../server/docker";

const HostClient = ({
  config,
  status,
  host,
  dockerVersion,
  composeVersion,
}: any) => {
  const [value, setValue] = useState(config);
  let buttonList: any[] = [];
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

      <pre className="text-xs p-4 bg-muted/60 flex gap-4 justify-between items-center rounded">
        <div className="flex gap-4">
          {dockerVersion ? (
            <div>docker: {dockerVersion}</div>
          ) : (
            <Button key="install-docker" onClick={() => dockerInstall(host)}>
              安装 docker
            </Button>
          )}
          {composeVersion ? (
            <div>compose: {composeVersion}</div>
          ) : (
            <Button key="install-docker" onClick={() => dockerInstall(host)}>
              安装 compose
            </Button>
          )}
        </div>
        {Boolean(buttonList.length) && (
          <div className="flex gap-4">{buttonList}</div>
        )}
      </pre>
    </div>
  );
};

export default HostClient;
