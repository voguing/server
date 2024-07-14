"use server";

import fs from "fs-extra";
import os from "os";
import path from "path";
import YAML from "yaml";
import redis from "../lib/redis";
import { connect } from "../lib/ssh";

const getComposeConfig = async (host: string) => {
  if (!host) throw new Error("host is required");

  const redisKey = `docker-compose:${host}`;
  const redisCache = await redis.get(redisKey);
  let config: string = "";

  if (redisCache === null) {
    const ssh = await connect(host);
    const tmpdir = os.tmpdir();
    const tmpfile = path.join(tmpdir, "docker-compose.yml");
    await ssh
      .getFile(tmpfile, "/root/docker-compose.yml")
      .catch(async (err) => {
        await redis.set(redisKey, "", "EX", 60);
        console.log("Error connecting", host, ":", err.message);
      });
    if (!fs.existsSync(tmpfile)) {
      return {
        message: "docker-compose.yml not found",
      };
    }
    const result = fs.readFileSync(tmpfile, "utf-8")?.trim();
    fs.removeSync(tmpfile);

    ssh.dispose();
    await redis.set(redisKey, result, "EX", 60);
    config = result;
  } else {
    config = redisCache;
  }

  const configJson = YAML.parse(config);

  return {
    configJson,
    config,
  };
};

export default getComposeConfig;
