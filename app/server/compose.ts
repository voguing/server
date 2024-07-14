"use server";

import fs from "fs-extra";
import os from "os";
import path from "path";
import { write } from "../lib/cache";
import redis from "../lib/redis";
import { connect } from "../lib/ssh";

const DOWN_COMMAND = "docker compose -f /root/docker-compose.yml down";
const UP_COMMAND = "docker compose -f /root/docker-compose.yml up -d";

export const composeStop = write({
  expire: 30,
  json: false,
  getKey(host) {
    return `docker:status:${host}`;
  },
  request: async (host: string) => {
    const ssh = await connect(host);
    await ssh.execCommand(DOWN_COMMAND);
    ssh.dispose();

    return "none";
  },
});

export const composeStart = write({
  expire: 30,
  json: false,
  getKey(host) {
    return `docker:status:${host}`;
  },
  request: async (host: string) => {
    const ssh = await connect(host);
    console.log(
      await ssh.execCommand(
        `docker login -u '${process.env.ALIYUN_REGISTRY_USER}' -p '${process.env.ALIYUN_REGISTRY_PASSWORD}' ${process.env.ALIYUN_REGISTRY}`
      )
    );
    await ssh.execCommand(UP_COMMAND).then(console.log);
    ssh.dispose();

    return "running";
  },
});

export const composeRestart = async (host: string) => {
  const ssh = await connect(host);
  await ssh.execCommand(`${DOWN_COMMAND} && ${UP_COMMAND}`);
  ssh.dispose();
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

export const composeSaveAndRestart = async (host: string, config: string) => {
  await composeChange(host, config);
  await composeRestart(host);
};
