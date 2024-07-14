import { sshExecOnce } from "../lib/ssh";

const Page = async ({
  searchParams: { host },
}: {
  searchParams: { host: string };
}) => {
  const result = await sshExecOnce(host)(
    "docker compose -f /root/docker-compose.yml logs --tail=10"
  );
  const { stdout } = result;
  console.log(result, "result");
  return (
    <div className="py-12 bg-slate-100 min-h-screen px-4">
      <main className="max-w-5xl mx-auto gap-4 flex flex-col">
        <pre>
          <code className="text-wrap leading-normal">{stdout}</code>
        </pre>
      </main>
    </div>
  );
};

export default Page;
