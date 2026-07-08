export interface ParticipationRecord {
  wallet: string;
  signature: string;
  timestamp: string;
  nonce: string;
}

export function buildParticipationMessage(wallet: string): {
  message: string;
  timestamp: string;
  nonce: string;
} {
  const timestamp = new Date().toISOString();
  const nonce = crypto.randomUUID();

  const message = `THE67 Participation

I choose to participate in THE67.

This signature does not transfer funds.

It simply records that I chose to participate.

Wallet: ${wallet}
Timestamp: ${timestamp}
Nonce: ${nonce}`;

  return { message, timestamp, nonce };
}

export function shortenSignature(signature: string): string {
  if (signature.length < 12) return signature;
  return `${signature.slice(0, 8)}...${signature.slice(-6)}`;
}

export const PARTICIPATION_MESSAGE_PREVIEW = `THE67 Participation

I choose to participate in THE67.

This signature does not transfer funds.

It simply records that I chose to participate.`;
