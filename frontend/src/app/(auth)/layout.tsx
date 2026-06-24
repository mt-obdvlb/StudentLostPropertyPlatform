"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas p-6">
      <div className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full bg-apple-blue-soft blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-apple-blue-soft blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[14px] border border-apple-blue/15 bg-apple-blue-soft text-[18px] font-semibold tracking-[-0.02em] text-apple-blue shadow-none">
              失
            </div>
            <div className="text-left">
              <p className="text-[17px] font-semibold tracking-[-0.02em] text-ink">校园失物招领</p>
              <p className="mt-0.5 text-[13px] text-muted-ink">Student Lost &amp; Found</p>
            </div>
          </Link>
        </div>
        <div className="rounded-[22px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
