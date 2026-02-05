import * as React from "react";
import { Form, Input, Button } from "@heroui/react";

export default function ReviewList() {
  const [action, setAction] = React.useState<string>("");

  return (
    <div className="flex flex-col items-center w-full pt-8">
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
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          setAction(`submit ${JSON.stringify(data)}`);
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
          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="flat">
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
