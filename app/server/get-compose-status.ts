"use server";

import { connect } from "../lib/ssh";

const getComposeStatus = async (host: string) => {
  if (!host) throw new Error("host is required");

  const ssh = await connect(host);

  const { stdout } = await ssh.execCommand("docker compose ls --format json", {
    cwd: "/root",
  });
  // .catch((err) => {
  //   console.log(host, err.message);
  // });

  ssh.dispose();

  const compose = JSON.parse(stdout || "[]").find(
    (item: any) => item.ConfigFiles === "/root/docker-compose.yml"
  );

  return {
    status: compose?.Status?.replace(/\(.+\)/, "") || "none",
  };
};

export default getComposeStatus;
