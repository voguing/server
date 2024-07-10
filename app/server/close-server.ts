"use server";

import { connect } from "../lib/ssh";

const closeServer = async (host: string) => {
  connect();

  return {};
};

export default closeServer;
