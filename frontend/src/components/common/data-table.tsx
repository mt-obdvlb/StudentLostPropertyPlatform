"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: React.ReactNode;
}) {
  if (!rows.length && empty) {
    return <>{empty}</>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="overflow-x-auto rounded-xl border border-border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={row.id}>
              {columns.map((c) => (
                <TableCell key={c.key} className={c.className}>
                  {c.render(row, i)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
