import { NodeSSH } from "node-ssh";

// TODO 隐藏敏感信息

export const connect = async (host: string) => {
  const ssh = new NodeSSH();
  return ssh.connect({
    host,
    username: "root",
    password: process.env.SSH_PASSWORD,
  });
};
