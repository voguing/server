import { connect } from "@/app/lib/ssh";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: any) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get("host")!;
  const ssh = await connect(host);
  const encoder = new TextEncoder();
  // Create a streaming response
  const customReadable = new ReadableStream({
    async start(controller) {
      // const message = "A sample message.";

      // controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      console.log("started");

      await ssh.execCommand(
        `docker login -u '${process.env.ALIYUN_REGISTRY_USER}' -p '${process.env.ALIYUN_REGISTRY_PASSWORD}' ${process.env.ALIYUN_REGISTRY}`,
        {
          onStdout(chunk) {
            controller.enqueue(encoder.encode(`data: ${chunk.toString()}\n\n`));
          },
          onStderr(chunk) {
            controller.enqueue(encoder.encode(`data: ${chunk.toString()}\n\n`));
          },
        }
      );
      ssh.dispose();
      controller.close();
    },
  });
  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
