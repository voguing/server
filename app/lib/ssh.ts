import { NodeSSH } from "node-ssh";

// TODO 隐藏敏感信息

export const ssh = new NodeSSH();

export const connect = async () => {
  return ssh
    .connect({
      host: "118.31.41.114",
      username: "root",
      password: process.env.SSH_PASSWORD,
    })
    .then(() => {
      console.log("SSH Connection established");
    })
    .catch((err) => {
      console.error("SSH Connection error:", err);
    });
};
