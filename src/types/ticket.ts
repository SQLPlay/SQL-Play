export type Ticket = {
  name: string;
  email: string;
  message: string;
  ticketId: string;
  timeZone: string;
  transactionId: string;
  deviceToken: string;
  createdAt: string;
  deviceInfo: Record<string, string | number>;
  commandHistory?: string[] | undefined;
};
