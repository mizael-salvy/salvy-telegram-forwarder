const TELEGRAM_API = "https://api.telegram.org";

interface TelegramResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface Message {
  message_id: number;
  chat: { id: number };
  date: number;
}

function botUrl(token: string, method: string): string {
  return `${TELEGRAM_API}/bot${token}/${method}`;
}

export async function sendMessage(
  token: string,
  chatId: string,
  text: string
): Promise<TelegramResponse<Message>> {
  const res = await fetch(botUrl(token, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
  return res.json() as Promise<TelegramResponse<Message>>;
}
