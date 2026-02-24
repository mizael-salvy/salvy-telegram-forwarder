import { Webhook } from "svix";

export interface SvixHeaders {
  "webhook-id": string;
  "webhook-timestamp": string;
  "webhook-signature": string;
}

export function verifyWebhook(
  secret: string,
  rawBody: string | Buffer,
  headers: SvixHeaders
): unknown {
  const wh = new Webhook(secret);
  return wh.verify(rawBody, headers);
}
