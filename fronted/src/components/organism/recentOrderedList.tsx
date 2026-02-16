import * as React from "react";
import LinkedPostCard from "../molecule/linkedPostCard";
import { subtitle } from "../../primitives";

type Post = {
  img_src: string;
  title: string;
  summary: string;
  creater: string;
  published_at: string; // ISO string
  link: string; // ✅ 추가 (상위와 타입 맞추기)
};

type RecentOrderedListProps = {
  posts: Post[];
  onPostClick?: (post: Post) => void; // ✅ 추가
};

export default function RecentOrderedList({
  posts,
  onPostClick, // ✅ 추가
}: RecentOrderedListProps) {
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );

  return (
    <div className="flex flex-col w-full items-start gap-3">
      <h2 className={subtitle({ size: "sm", color: "default" })}>
        최신 리뷰 피드 -2주
      </h2>

      <ol className="flex flex-col w-full gap-2">
        {sortedPosts.map((post, index) => (
          <LinkedPostCard
            key={`${post.title}-${index}`}
            img_src={post.img_src}
            title={post.title}
            summary={post.summary}
            creater={post.creater}
            published_at={post.published_at}
            onClick={() => onPostClick?.(post)} // ✅ 추가: 카드 클릭 → 상위로 전달
          />
        ))}
      </ol>
    </div>
  );
}
