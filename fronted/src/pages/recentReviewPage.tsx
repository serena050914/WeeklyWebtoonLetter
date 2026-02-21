// RecentReviewPage.tsx
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
  link: string;
};

export default function RecentReviewPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastCursor, setLastCursor] = React.useState<string | null>(null);

  const handleClick = () => {
    navigate("/subscribe");
  };

  const handlePostClick = (post: Post) => {
    if (!post.link) return;
    window.open(post.link, "_blank", "noopener,noreferrer");
  };

  const loadMore = async (latestCursor: string | null) => {
    if (loading) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("newsletter_post")
      .select(
        `
          rss_item (
            title,
            summary,
            published_at,
            img_src,
            link,
            rss_source ( creater )
          )
        `,
      )
      .order("published_at", { foreignTable: "rss_item", ascending: false })
      .gt("published_at", latestCursor)
      .limit(5, { foreignTable: "rss_item" });

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
          img_src: item?.img_src ?? "",
          title: item?.title ?? "",
          summary: item?.summary ?? "",
          creater: source?.creater ?? "출처 미상",
          published_at: item?.published_at ?? "",
          link: item?.link ?? "",
        };
      }) ?? [];

    setPosts((prevPosts) => [...prevPosts, ...mappedPosts]);
    setLoading(false);

    if (data && data.length > 0) {
      const lastPost = data[data.length - 1];
      setLastCursor(lastPost.rss_item[0].published_at); // 마지막 게시물의 published_at을 lastCursor로 설정
    }
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
              img_src,
              link,
              rss_source ( creater )
            )
          `,
        )
        .order("published_at", { foreignTable: "rss_item", ascending: false })
        .limit(5, { foreignTable: "rss_item" });

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
            img_src: item?.img_src ?? "",
            title: item?.title ?? "",
            summary: item?.summary ?? "",
            creater: source?.creater ?? "출처 미상",
            published_at: item?.published_at ?? "",
            link: item?.link ?? "",
          };
        }) ?? [];

      setPosts(mappedPosts);
      setLoading(false);

      if (data && data.length > 0) {
        const lastPost = data[data.length - 1];
        setLastCursor(lastPost.rss_item[0].published_at); // 첫 로드에서 lastCursor 설정
      }
    };

    fetchPosts();
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore(lastCursor); // 마지막 커서 이후의 데이터를 불러옴
      }
    });

    const sentinel = document.getElementById("sentinel"); // sentinel을 DOM으로 찾기
    if (sentinel) {
      observer.observe(sentinel); // intersection observer로 감시
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel); // 컴포넌트 언마운트 시 observer 해제
      }
    };
  }, [lastCursor]);

  return (
    <RecentReviewList
      posts={posts}
      onClick={handleClick}
      onPostClick={handlePostClick}
    />
  );
}
