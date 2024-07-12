import { Card, Tabs } from "@voguing/components";
import { FC, useState } from "react";
import { Host } from "./host";

export const Servers: FC<{
  servers: { host: string; region: string }[];
}> = ({ servers }) => {
  // const [tab, setTab] = useState(servers[0].host);

  return (
    <Card>
      <Tabs
        // value={tab}
        // onValueChange={setTab}
        items={servers.map(({ host }) => ({
          title: host,
          value: host,
          children: <Host host={host} key={host} />,
        }))}
      />
    </Card>
  );
};
