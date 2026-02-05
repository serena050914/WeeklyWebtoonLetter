import { Link } from "@heroui/link";
import { Link as RouterLink } from "react-router-dom";

export function TopBacklink() {
  return (
    <div className="flex justify-start pl-4 w-full">
      <Link as={RouterLink} to="/reviewList" className="text-3xl font-bold">
        돌아가기
      </Link>
    </div>
  );
}
