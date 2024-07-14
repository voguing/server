import { FC } from "react";
import getComposeConfig from "../server/get-compose-config";
import getComposeStatus from "../server/get-compose-status";
import HostClient from "./host-client";
import getDockerStatus from "../server/get-docker-status";

export const Host: FC<{
  host: string;
}> = async ({ host }) => {
  const { dockerVersion, composeVersion } = await getDockerStatus(host);
  const { config } = await getComposeConfig(host);
  const { status } = await getComposeStatus(host);

  return (
    <HostClient
      config={config}
      status={status}
      host={host}
      composeVersion={composeVersion}
      dockerVersion={dockerVersion}
    />
  );
};
