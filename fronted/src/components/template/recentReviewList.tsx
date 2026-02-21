// RecentReviewList.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../molecule/logo-header";
import MyButton from "../atom/button";
import RecentOrderedList from "../organism/recentOrderedList";
import { subtitle } from "../../primitives";
import InformCardList from "../molecule/InformCardList";

type Post = {
  img_src: string;
  title: string;
  summary: string;
  creater: string;
  published_at: string;
  link: string;
};

type RecentReviewListProps = {
  posts: Post[];
  onClick?: () => void;
  onPostClick?: (post: Post) => void;
};

export default function RecentReviewList({
  posts,
  onClick,
  onPostClick,
}: RecentReviewListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full">
      <LogoHeader
        iconLabel="✉︎"
        iconVariant="point"
        titleText="웹툰리뷰"
        subtitleText="네이버 블로그에서 선정한 최신 웹툰리뷰를 매주 받아보세요."
      />
      <MyButton
        label="뉴스레터 구독하기"
        variant="point"
        type="button"
        onClick={onClick}
      />
      <InformCardList
        informCardData={[
          { value: "240+", label: "구독자" },
          { value: "52", label: "발행 횟수" },
          { value: "2489+", label: "누적 리뷰" },
        ]}
      />
      <h2
        className={`${subtitle({ size: "sm", color: "default" })} cursor-pointer`}
        role="button"
        onClick={() => navigate("/unsubscribe")}
      >
        구독취소
      </h2>
      <RecentOrderedList posts={posts} onPostClick={onPostClick} />
      {/* ✅ sentinel ref 추가: ref로 DOM 요소로 접근 */}
      <div id="sentinel" className="h-4 w-full"></div>
    </div>
  );
}
