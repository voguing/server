"use server";

import path from "path";
import { connect } from "../lib/ssh";

export const dockerInstall = async (host: string) => {
  const ssh = await connect(host);

  console.log(
    await ssh.putFile(
      path.join(process.cwd(), "objects", "get-docker.sh"),
      "/root/get-docker.sh"
    )
  );
  console.log(await ssh.execCommand("chmod u+x /root/get-docker.sh"));
  console.log(
    await ssh.execCommand("sudo /root/get-docker.sh --mirror Aliyun")
  );
  console.log(
    await ssh.execCommand(
      `docker login -u '${process.env.ALIYUN_REGISTRY_USER}' -p '${process.env.ALIYUN_REGISTRY_PASSWORD}' ${process.env.ALIYUN_REGISTRY}`
    )
  );

  ssh.dispose();
};
