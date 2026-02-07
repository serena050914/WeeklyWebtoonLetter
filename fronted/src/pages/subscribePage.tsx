import * as React from "react";
import Subscribe from "../components/template/subscribe";
import { supabase } from "../lib/supabase";

export default function SubscribePage() {
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
      const { error } = await supabase.from("subscriber").insert([{ email }]);

      if (error) {
        setAction(`error: ${error.message}`);
      } else {
        setAction("saved!");
      }
    } catch (err) {
      setAction("error: network/server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Subscribe onSubmit={handleSubmit} />

      {action && (
        <div className="mt-4 text-small text-default-500 text-center">
          Action: <code>{action}</code>
        </div>
      )}
    </>
  );
}
