"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Role = "merchant" | "staff";

const roleCopy: Record<Role, { message: string; submitLabel: string; redirect: string }> = {
  merchant: {
    message: "Welcome back, Merchant Partner",
    submitLabel: "Log in as Merchant",
    redirect: "/merchant",
  },
  staff: {
    message: "Staff Portal — Enter your credentials",
    submitLabel: "Log in as Staff",
    redirect: "/admin",
  },
};

export function LoginModal({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("merchant");
  const copy = roleCopy[role];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(false);
    router.push(copy.redirect);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="data-open:zoom-in-100 data-closed:zoom-out-100 data-open:slide-in-from-bottom-5 data-closed:slide-out-to-bottom-5 data-open:duration-300 data-closed:duration-200 sm:max-w-sm">
        <DialogTitle>Log in to Cube Sprout</DialogTitle>

        <div className="login-tabs">
          <motion.div
            className="login-tab-indicator"
            animate={{ x: role === "merchant" ? 0 : "100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
          <button
            type="button"
            className="login-tab-btn"
            data-active={role === "merchant"}
            onClick={() => setRole("merchant")}
          >
            Merchant
          </button>
          <button
            type="button"
            className="login-tab-btn"
            data-active={role === "staff"}
            onClick={() => setRole("staff")}
          >
            Staff
          </button>
        </div>

        <p className="hero-text">{copy.message}</p>

        <form className="stack-md" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" autoComplete="email" required />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="button-primary">
            {copy.submitLabel}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
