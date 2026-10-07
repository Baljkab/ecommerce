"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function AuthExperience({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";
  const reduceMotion = useReducedMotion();
  const motionEnabled = reduceMotion !== true;
  const welcomeClass = isSignup
    ? "order-2 md:col-start-2 md:rounded-[2rem_5rem_5rem_2rem]"
    : "order-1 md:col-start-1 md:rounded-[5rem_2rem_2rem_5rem]";
  const formClass = isSignup
    ? "order-1 md:col-start-1"
    : "order-2 md:col-start-2";
  const direction = isSignup ? 1 : -1;

  return (
    <main className="flex min-h-[70vh] items-center justify-center shadow-orange-500 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-5xl rounded-[2.5rem] bg-[#f5edeb] p-2.5 shadow-[0_32px_90px_rgba(35,31,54,0.22)] ring-1 ring-white/50 sm:p-4">
        <div className="grid overflow-hidden rounded-[2rem] md:min-h-[570px] md:grid-cols-2">
          <motion.aside
            layout
            transition={{
              layout: {
                type: "spring",
                stiffness: motionEnabled ? 280 : 1000,
                damping: 30,
              },
            }}
            className={`relative isolate flex min-h-[235px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-6 py-8 text-center text-white sm:min-h-[260px] sm:px-10 md:min-h-[570px] md:px-12 ${welcomeClass}`}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full border border-white/10"
              animate={motionEnabled ? { rotate: 360 } : undefined}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-14 h-64 w-64 rounded-full border border-white/10"
              animate={motionEnabled ? { rotate: -360 } : undefined}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isSignup ? "signup-welcome" : "login-welcome"}
                initial={motionEnabled ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={motionEnabled ? { opacity: 0, y: -10 } : undefined}
                transition={{
                  duration: motionEnabled ? 0.2 : 0,
                  ease: "easeOut",
                }}
                className="relative z-10"
              >
                <p className="text-3xl font-black tracking-tight sm:text-4xl">
                  {isSignup ? "Тавтай морил!" : "Сайн байна уу!"}
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/80">
                  {isSignup
                    ? "Бүртгэлээ үүсгээд TechStore-ийн сонголтуудтай танилцаарай."
                    : "Бүртгэлдээ нэвтэрч худалдан авалтаа үргэлжлүүлээрэй."}
                </p>
                <p className="mt-7 text-sm font-medium text-white/90">
                  {isSignup ? "Бүртгэлтэй юу?" : "Бүртгэл байхгүй юу?"}
                </p>
                <Link
                  href={isSignup ? "/login" : "/signup"}
                  className="mt-3 inline-flex min-w-40 items-center justify-center rounded-xl border-2 border-white/80 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {isSignup ? "Нэвтрэх" : "Бүртгүүлэх"}
                </Link>
              </motion.div>
            </AnimatePresence>
            <p className="relative z-10 mt-7 max-w-xs text-[11px] leading-5 text-white/60 md:absolute md:right-7 md:bottom-6 md:left-7 md:mt-0">
              Сагсаа хадгалж, хүссэн үедээ худалдан авалтаа үргэлжлүүлээрэй.
            </p>
          </motion.aside>

          <motion.section
            layout
            transition={{
              layout: {
                type: "spring",
                stiffness: motionEnabled ? 280 : 1000,
                damping: 30,
              },
            }}
            className={`flex min-h-[390px] flex-col justify-center bg-[#f5edeb] px-6 py-9 sm:px-10 md:min-h-[570px] md:px-12 ${formClass}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={
                  motionEnabled ? { opacity: 0, x: direction * 16 } : false
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  motionEnabled
                    ? { opacity: 0, x: direction * -16 }
                    : undefined
                }
                transition={{
                  duration: motionEnabled ? 0.22 : 0,
                  ease: "easeOut",
                }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
