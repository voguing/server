"use server";

import fs from "fs-extra";
import os from "os";
import path from "path";
import YAML from "yaml";
import { connect } from "../lib/ssh";

const getComposeConfig = async (host: string) => {
  if (!host) throw new Error("host is required");

  const ssh = await connect(host);
  const tmpdir = os.tmpdir();
  const tmpfile = path.join(tmpdir, "docker-compose.yml");

  await ssh.getFile(tmpfile, "/root/docker-compose.yml").catch((err) => {
    console.log(host, err.message);
  });

  if (!fs.existsSync(tmpfile)) {
    return {
      message: "docker-compose.yml not found",
    };
  }

  const config = fs.readFileSync(tmpfile, "utf-8")?.trim();
  const configJson = YAML.parse(config);
  fs.removeSync(tmpfile);

  ssh.dispose();

  return {
    configJson,
    config,
  };
};

export default getComposeConfig;
