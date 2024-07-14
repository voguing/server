"use client";

import { Spinner } from "@radix-ui/themes";
import { Button, Textarea } from "@voguing/components";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  composeChange,
  composeRestart,
  composeSaveAndRestart,
  composeStart,
  composeStop,
} from "../server/compose";
import { dockerInstall } from "../server/docker";
import getComposeConfig from "../server/get-compose-config";
import getComposeStatus from "../server/get-compose-status";
import getDockerStatus from "../server/get-docker-version";

const HostClient = ({ host }: any) => {
  const {
    data: { dockerVersion, composeVersion } = {},
    isLoading: isLoadingDocker,
  } = useSWR([host, "docker"], () => getDockerStatus(host), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
  const { data: config, isValidating: isLoadingConfig } = useSWR(
    [host, "config"],
    async () => {
      const result = await getComposeConfig(host);
      setValue(result);
      return result;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const { data: status = {}, isLoading: isLoadingStatus } = useSWR(
    [host, "status"],
    () => getComposeStatus(host),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const isLoading = isLoadingDocker || isLoadingConfig || isLoadingStatus;

  const [value, setValue] = useState(config);
  let buttonList: any[] = [];
  buttonList.push(
    <Link href={`/logs?host=${host}`}>
      <Button key="logs" variant="outline">
        查看日志
      </Button>
    </Link>
  );
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
      disabled={!value || config === value}
      variant="outline"
      onClick={() => composeChange(host, value!)}
    >
      保存配置
    </Button>
  );
  buttonList.push(
    <Button
      key="save-restart"
      disabled={!value || config === value}
      variant="outline"
      onClick={() =>
        composeSaveAndRestart(host, value!).then(() => mutate([host, "status"]))
      }
    >
      保存并重启配置
    </Button>
  );
  if (status === "running") {
    buttonList.push(
      <Button
        key="stop"
        variant="destructive"
        onClick={() => composeStop(host).then(() => mutate([host, "status"]))}
      >
        全部停止
      </Button>
    );
  } else {
    buttonList.push(
      <Button
        key="start"
        onClick={() => composeStart(host).then(() => mutate([host, "status"]))}
      >
        全部启动
      </Button>
    );
  }

  return (
    <div className="gap-2 flex flex-col">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={20}
            className="font-mono text-xs"
          />

          <pre className="text-xs p-4 bg-muted/60 flex gap-4 justify-between items-center rounded">
            <div className="flex gap-4">
              {dockerVersion ? (
                <>
                  <div>docker: {dockerVersion}</div>
                  <div>compose: {composeVersion}</div>
                </>
              ) : (
                <Button
                  key="install-docker"
                  onClick={async () => {
                    await dockerInstall(host);
                    await mutate([host, "docker"]);
                  }}
                >
                  安装 docker
                </Button>
              )}
            </div>
            {Boolean(buttonList.length) && (
              <div className="flex gap-4">{buttonList}</div>
            )}
          </pre>
        </>
      )}
    </div>
  );
};

export default HostClient;
