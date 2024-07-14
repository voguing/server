"use server";

import path from "path";
import redis from "../lib/redis";
import { connect } from "../lib/ssh";
import os from "os";
import fs from "fs-extra";

const DOWN_COMMAND = "docker compose -f /root/docker-compose.yml down";
const UP_COMMAND = "docker compose -f /root/docker-compose.yml up -d";

export const composeStop = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand(DOWN_COMMAND);
};

export const composeStart = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand(UP_COMMAND);
};

export const composeRestart = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand(`${DOWN_COMMAND} && ${UP_COMMAND}`);
};

export const composeChange = async (host: string, config: string) => {
  const ssh = await connect(host);

  const redisKey = `docker-compose:${host}`;

  const tmpdir = os.tmpdir();
  const tmpfile = path.join(tmpdir, "docker-compose.yml");
  fs.writeFileSync(tmpfile, config);
  await ssh.putFile(tmpfile, "/root/docker-compose.yml").catch(async (err) => {
    console.log("Error connecting", host, ":", err.message);
  });
  fs.removeSync(tmpfile);

  ssh.dispose();

  await redis.set(redisKey, config, "EX", 3600);
};
