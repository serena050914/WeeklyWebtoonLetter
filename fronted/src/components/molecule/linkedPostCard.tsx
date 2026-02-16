import * as React from "react";
import { title as titleStyle, subtitle } from "../../primitives";

type LinkedPostCardProps = {
  img_src: string;
  title: string;
  summary: string;
  creater: string;
  published_at: string;
  onClick?: () => void;
};

export default function LinkedPostCard({
  img_src,
  title,
  summary,
  creater,
  published_at,
  onClick,
}: LinkedPostCardProps) {
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="flex w-full h-36 p-4 gap-3 bg-white rounded-xl shadow-md cursor-pointer"
    >
      <img
        src={img_src}
        alt={title}
        referrerPolicy="no-referrer"
        className="w-28 h-28 rounded-xl"
      />
      <div className="flex flex-col justify-between items-start pl-2 h-28">
        <h1 className={titleStyle({ size: "sm" })}>{title}</h1>
        <p className="text-gray-600 text-sm line-clamp-2">{summary}</p>
        <div className="flex gap-2">
          <span className={subtitle({ size: "sm", color: "default" })}>
            {creater}
          </span>
          <span className={subtitle({ size: "sm", color: "default" })}>
            {new Date(published_at).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>
    </li>
  );
}
