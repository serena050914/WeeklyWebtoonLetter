import * as React from "react";
import { Form, Input, Button } from "@heroui/react";
import { TopBacklink } from "@/components/items";

export default function Subscribe() {
  const [action, setAction] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <TopBacklink />
      <span className="w-16 h-16 rounded-xl bg-red-200 flex justify-center items-center">
        편지모양
      </span>

      <h1>웹툰리뷰 구독하기</h1>
      <h6 className="whitespace-pre-line">
        매주 엄선된 웹툰 리뷰를
        {"\n"}이메일로 받아보세요
      </h6>

      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        onReset={() => setAction("reset")}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setAction("");

          try {
            const formData = new FormData(e.currentTarget);
            const username = String(formData.get("username") ?? "").trim();
            const email = String(formData.get("email") ?? "").trim();

            const res = await fetch("http://localhost:5174/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: username, email }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok || !json.ok) {
              setAction(`error: ${json.error ?? "unknown error"}`);
            } else {
              setAction("saved!");
              e.currentTarget.reset();
            }
          } catch (err) {
            setAction("error: network/server error");
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
        />

        <div className="flex gap-2">
          <Button color="primary" type="submit" isLoading={loading}>
            Submit
          </Button>
          <Button type="reset" variant="flat" isDisabled={loading}>
            Reset
          </Button>
        </div>

        {action && (
          <div className="text-small text-default-500">
            Action: <code>{action}</code>
          </div>
        )}
      </Form>
    </div>
  );
}
