"use client";

import { Button, type TableColumn } from "@voguing/components";
import closeServer from "./server/close-server";

export const columns: TableColumn<any>[] = [
  { header: "服务器", accessorKey: "host", width: 400 },
  { header: "地域", accessorKey: "region", width: 100 },
  {
    header: "操作",
    width: 100,
    accessorFn: (record) => record,
    cell: (ctx) => {
      const { host } = ctx.getValue<any>();

      return (
        <Button variant="link" onClick={() => closeServer(host)}>
          关闭
        </Button>
      );
    },
  },
];