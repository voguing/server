import { Card, Tabs } from "@voguing/components";
import { FC } from "react";
import { Host } from "./host";

export const Servers: FC<{
  servers: { host: string; region: string }[];
}> = ({ servers }) => {
  return (
    <Card>
      <Tabs
        items={servers.map(({ host }) => ({
          title: host,
          value: host,
          children: <Host host={host} key={host} />,
        }))}
      />
    </Card>
  );
};
