"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Loader2 } from "lucide-react";

interface Profile {
  name: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "", phone: "", address: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      }
    }
    if (session) loadProfile();
  }, [session]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (status === "loading") return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-rose-400 mx-auto" />
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="avatar"
            width={56}
            height={56}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="font-playfair text-2xl font-bold text-stone-800">
            Мой профиль
          </h1>
          <p className="text-stone-500 text-sm">{session?.user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 space-y-4">
        {[
          { key: "name", label: "Имя", placeholder: "Ваше имя" },
          { key: "phone", label: "Телефон", placeholder: "+7 (777) 000-00-00" },
          { key: "address", label: "Адрес доставки", placeholder: "Город, улица, дом" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              {f.label}
            </label>
            <input
              type="text"
              placeholder={f.placeholder}
              value={profile[f.key as keyof Profile]}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            "✓ Сохранено!"
          ) : (
            <><Save className="w-4 h-4" /> Сохранить</>
          )}
        </button>
      </div>
    </div>
  );
}