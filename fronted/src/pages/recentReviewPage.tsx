import * as React from "react";
import { useNavigate } from "react-router-dom";
import RecentReviewList from "../components/template/recentReviewList";
import { supabase } from "../lib/supabase";

type Post = {
  img_src: string;
  title: string;
  summary: string;
  creater: string;
  published_at: string;
  link: string; // ✅ 추가
};

export default function RecentReviewPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    navigate("/subscribe");
  };

  // ✅ 추가: 카드 클릭 시 rss_item.link로 이동
  const handlePostClick = (post: Post) => {
    if (!post.link) return;
    window.open(post.link, "_blank", "noopener,noreferrer");
  };

  React.useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("newsletter_post")
        .select(
          `
          rss_item (
            title,
            summary,
            published_at,
            img,
            link,
            rss_source ( creater )
          )
        `,
        )
        .order("published_at", {
          foreignTable: "rss_item",
          ascending: false,
        })
        .limit(14, { foreignTable: "rss_item" });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mappedPosts: Post[] =
        data?.map((row: any) => {
          const item = Array.isArray(row.rss_item)
            ? row.rss_item[0]
            : row.rss_item;
          const source = Array.isArray(item?.rss_source)
            ? item.rss_source[0]
            : item?.rss_source;

          return {
            img_src: item?.img ?? "",
            title: item?.title ?? "",
            summary: item?.summary ?? "",
            creater: source?.creater ?? "출처 미상",
            published_at: item?.published_at ?? "",
            link: item?.link ?? "", // ✅ 추가
          };
        }) ?? [];

      setPosts(mappedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <RecentReviewList
      posts={posts}
      onClick={handleClick}
      onPostClick={handlePostClick} // ✅ 추가
    />
  );
}
