import { Card, Tabs } from "@voguing/components";
import { FC } from "react";
import HostClient from "./host-client";

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
          children: <HostClient host={host} key={host} />,
        }))}
      />
    </Card>
  );
};
