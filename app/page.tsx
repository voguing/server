import { Card, Table } from "@voguing/components";
import { columns } from "./columns";
import { servers } from "./consts";
import { Servers } from "./server";

export default async function Home() {
  const data = await Promise.all(
    servers.map(async (info) => {
      return { ...info };
    })
  );

  return (
    <div className="py-12 bg-slate-100 min-h-screen px-4">
      <main className="max-w-5xl mx-auto gap-4 flex flex-col">
        <Card title="服务器列表">
          <Table columns={columns} data={data} />
        </Card>
        <Servers servers={servers} />
      </main>
    </div>
  );
}
