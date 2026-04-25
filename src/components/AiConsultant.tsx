"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiConsultant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      console.log("Отправляем на API:", updated); // для дебага

      const res = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      console.log("Статус ответа:", res.status); // для дебага

      const data = await res.json();
      console.log("Данные ответа:", data); // для дебага

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Ошибка: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Произошла ошибка соединения. Попробуйте ещё раз.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-rose-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-rose-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold text-sm">AI Флорист</p>
                <p className="text-rose-200 text-xs">Подберу букет для вас</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-rose-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Приветствие всегда показываем */}
            <div className="flex justify-start">
              <div className="bg-rose-50 text-stone-700 px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%] text-sm leading-relaxed">
                Привет! 🌸 Я помогу подобрать идеальный букет. Расскажите — для
                кого и по какому поводу?
              </div>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-rose-500 text-white rounded-br-sm"
                      : "bg-rose-50 text-stone-700 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-rose-50 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-rose-50 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напишите пожелания..."
              className="flex-1 border border-rose-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300 text-stone-700"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
