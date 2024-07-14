"use server";

import { connect } from "../lib/ssh";

export const composeStop = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand("docker compose -f /root/docker-compose.yml down");
};

export const composeStart = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand("docker compose -f /root/docker-compose.yml up -d");
};
