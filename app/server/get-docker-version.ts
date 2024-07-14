"use server";

import cache from "../lib/cache";
import { connect } from "../lib/ssh";

const getDockerStatus = cache({
  expire: 6000,
  json: true,
  getKey: (host) => {
    return `docker:version:${host}`;
  },
  request: async (host: string) => {
    const ssh = await connect(host);
    const { stdout } = await ssh.execCommand(
      "docker version --format '{{json .}}'"
    );
    const dockerVersion = JSON.parse(stdout || "{}")?.Server?.Version;
    const { stdout: composeOut } = await ssh.execCommand(
      "docker compose version"
    );
    const composeVersion = /v\d+\.\d+\.\d+/.exec(composeOut)?.[0];

    ssh.dispose();

    return { dockerVersion, composeVersion };
  },
});

export default getDockerStatus;
