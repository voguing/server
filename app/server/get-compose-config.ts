"use server";

import fs from "fs-extra";
import os from "os";
import path from "path";
import cache from "../lib/cache";
import { connect } from "../lib/ssh";

const getComposeConfig = cache({
  expire: 3600,
  getKey: (host) => {
    return `docker:compose:${host}`;
  },
  request: async (host: string) => {
    if (!host) throw new Error("host is required");

    const ssh = await connect(host);
    const tmpdir = os.tmpdir();
    const tmpfile = path.join(tmpdir, "docker-compose.yml");
    await ssh.getFile(tmpfile, "/root/docker-compose.yml").catch((e) => {
      console.log(e);
    });
    if (!fs.existsSync(tmpfile)) {
      return "";
    }
    const config = fs.readFileSync(tmpfile, "utf-8")?.trim();
    fs.removeSync(tmpfile);

    ssh.dispose();

    return config;
  },
});

export default getComposeConfig;
