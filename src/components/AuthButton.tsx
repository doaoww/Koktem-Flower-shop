"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") return (
    <div className="w-8 h-8 rounded-full bg-rose-100 animate-pulse" />
  );

  if (!session) return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-colors"
    >
      <User className="w-4 h-4" />
      Войти
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
      >
        {session.user?.image ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={session.user.image}
    alt="avatar"
    width={32}
    height={32}
    className="rounded-full w-8 h-8 object-cover"
  />
) : (
  <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center">
    <User className="w-4 h-4 text-rose-600" />
  </div>
)}
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg border border-rose-50 p-3 w-48 z-50">
          <p className="text-sm font-semibold text-stone-700 px-2 mb-2 truncate">
            {session.user?.name}
          </p>
          
          <Link
            href="/profile"
            className="block px-2 py-1.5 text-sm text-stone-600 hover:text-rose-500 rounded-lg hover:bg-rose-50"
            onClick={() => setOpen(false)}
          >
            Мой профиль
          </Link>
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-stone-600 hover:text-red-500 rounded-lg hover:bg-red-50 mt-1"
          >
            <LogOut className="w-3 h-3" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}