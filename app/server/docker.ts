"use server";

import { connect } from "../lib/ssh";

export const dockerInstall = async (host: string) => {
  console.log("install docker");
  // docker version --format '{{json .}}'
  // 安装 docker 的
  // sudo ./get-docker.sh --mirror Aliyun
};
