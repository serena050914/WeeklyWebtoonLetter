import * as React from "react";
import Unsubscribe from "../components/template/unsubscribe";
import { supabase } from "../lib/supabase";

export default function UnsubscribePage() {
  const [loading, setLoading] = React.useState(false);
  const [action, setAction] = React.useState<string>("");

  const handleSubmit = async (email: string) => {
    if (!email) {
      setAction("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    setAction("");

    try {
      const { data, error: selectError } = await supabase
        .from("subscriber")
        .select("id, unsubscribe_at")
        .eq("email", email)
        .single();

      if (selectError || !data) {
        setAction("구독 정보를 찾을 수 없습니다.");
        return;
      }

      if (data.unsubscribe_at) {
        setAction("이미 구독이 취소된 계정입니다.");
        return;
      }

      const { error: updateError } = await supabase
        .from("subscriber")
        .update({ unsubscribe_at: new Date().toISOString() })
        .eq("id", data.id);

      if (updateError) {
        setAction(`error: ${updateError.message}`);
      } else {
        setAction("구독이 정상적으로 취소되었습니다.");
      }
    } catch (err) {
      setAction("error: network/server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Unsubscribe onSubmit={handleSubmit} />

      {action && (
        <div className="mt-4 text-small text-default-500 text-center">
          {action}
        </div>
      )}
    </>
  );
}
