import { Webhook } from "svix";

export interface SvixHeaders {
  "svix-id": string;
  "svix-timestamp": string;
  "svix-signature": string;
}

export function verifyWebhook(
  secret: string,
  rawBody: string | Buffer,
  headers: SvixHeaders
): unknown {
  const wh = new Webhook(secret);
  return wh.verify(rawBody, headers);
}
