// types.ts (추가)
export type NewsletterRow = {
  id: number;
  issue: number | null;
  comment: string | null;
  created_at: string;
  is_sent: boolean | null;
};
