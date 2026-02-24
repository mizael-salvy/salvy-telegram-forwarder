interface SmsReceivedData {
  id: string;
  virtualPhoneAccountId: string;
  receivedAt: string; // ISO-8601 timestamp
  originPhoneNumber: string; // Might not always be a number
  destinationPhoneNumber: string; // Always in E.164 format
  message: string; // Raw contents of the message
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isSmsReceivedEventPayload(
  event: { type?: string, data?: object }
): event is { type: "sms.received", data: SmsReceivedData } {
  return event.type === "sms.received" && typeof event.data === "object" && event.data !== null;
}

export function formatSmsMessage(data: SmsReceivedData): string {
  const from = data.originPhoneNumber || "Desconhecido";
  const to = data.destinationPhoneNumber || "Desconhecido";
  const body = data.message || "(sem conteúdo)";
  const timestamp = data.receivedAt || new Date().toISOString();

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
