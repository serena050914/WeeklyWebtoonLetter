// types.ts (추가)
export type NewsletterRow = {
  id: number;
  issue: number | null;
  comment: string | null;
  is_sent: boolean | null;
};

export type PostsData = {
  id: number;
  title: string;
  link: string;
  summary: string;
  published_at: string;
  img_src: string;
}[];

export type EmailData = {
  email: string;
};

export type EditedData = {
  issue_img_src: string;
  issue_title: string;
  issue_summary: string;
  issue_link: string;
  img_src1: string;
  title1: string;
  summary1: string;
  link1: string;
  img_src2: string;
  title2: string;
  summary2: string;
  link2: string;
  img_src3: string;
  title3: string;
  summary3: string;
  link3: string;
  img_src4: string;
  title4: string;
  summary4: string;
  link4: string;
  img_src5: string;
  title5: string;
  summary5: string;
  link5: string;
  img_src6: string;
  title6: string;
  summary6: string;
  link6: string;
  subscribe_link: string;
  email: string;
};
