interface SmsReceivedData {
  from?: string;
  to?: string;
  body?: string;
  message?: string;
  sender?: string;
  recipient?: string;
  content?: string;
  virtual_number?: string;
  timestamp?: string;
  received_at?: string;
  [key: string]: unknown;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatSmsMessage(data: SmsReceivedData): string {
  const from = data.from || data.sender || "Desconhecido";
  const to = data.to || data.recipient || data.virtual_number || "Desconhecido";
  const body = data.body || data.message || data.content || "(sem conteúdo)";
  const timestamp =
    data.timestamp || data.received_at || new Date().toISOString();

  const date = new Date(timestamp);
  const formatted = isNaN(date.getTime())
    ? timestamp
    : date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return [
    `\u{1F4E9} <b>SMS Recebido</b>`,
    ``,
    `<b>De:</b> ${escapeHtml(String(from))}`,
    `<b>Para:</b> ${escapeHtml(String(to))}`,
    `<b>Mensagem:</b> ${escapeHtml(String(body))}`,
    ``,
    `\u{23F0} ${escapeHtml(formatted)}`,
  ].join("\n");
}
