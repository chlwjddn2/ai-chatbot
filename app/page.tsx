"use client";

import { useState } from "react";

// 메시지 타입 정의
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    console.log(newMessages);

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // API 호출
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    // AI 응답 추가
    setMessages([
      ...newMessages,
      { role: "assistant", content: data.message },
    ]);
    setLoading(false);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="p-4 border-b border-gray-800 text-center font-bold text-lg">
        AI Chatbot
      </header>

      {/* 메시지 목록 */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            메시지를 입력해보세요 👋
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-2xl text-sm text-gray-400">
              답변 생성 중...
            </div>
          </div>
        )}
      </section>

      {/* 입력창 */}
      <footer className="p-4 border-t border-gray-800 flex gap-2">
        <input
          className="flex-1 bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none"
          placeholder="메시지 입력..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-medium"
        >
          전송
        </button>
      </footer>
    </main>
  );
}