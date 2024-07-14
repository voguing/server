"use server";

import cache from "../lib/cache";
import { connect } from "../lib/ssh";

const getComposeStatus = cache({
  expire: 60,
  json: true,
  getKey: (host) => {
    return `docker:status:${host}`;
  },
  request: async (host: string) => {
    if (!host) throw new Error("host is required");

    const ssh = await connect(host);

    const { stdout } = await ssh.execCommand(
      "docker compose ls --format json",
      {
        cwd: "/root",
      }
    );

    ssh.dispose();

    const compose = JSON.parse(stdout || "[]").find(
      (item: any) => item.ConfigFiles === "/root/docker-compose.yml"
    );

    return {
      status: compose?.Status?.replace(/\(.+\)/, "") || "none",
    };
  },
});

export default getComposeStatus;
