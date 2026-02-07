import * as React from "react";
import { Form } from "@heroui/react";
import MyInput from "../atom/input";
import MyButton from "../atom/button";

type SignFormProps = {
  buttonLabel: string;
  buttonColor?: "primary" | "success" | "warning" | "default";
  buttonVariant?: "default" | "point" | "dark";
  onSubmit?: (email: string) => void; // ⭐ 수정
};

//form 안에 있는 버튼의 기본 타입은 summit임.
//onSubmit 이란 프롭스는 있을수도 있고 없을 수도 있는데, 있다면 아무인자도 받지 않고 아무 것도 리턴하지 않는 함수다
//e.preventDefault(); <- form 태크 기본행동 하지마.

export default function SignForm({
  buttonLabel,
  buttonColor = "primary",
  buttonVariant = "default",
  onSubmit,
}: SignFormProps) {
  return (
    <Form
      className="flex flex-col gap-6 w-full p-6 bg-background rounded-xl shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget); // ⭐ 추가
        const email = String(formData.get("email") ?? "").trim(); // ⭐ 추가

        onSubmit?.(email); // ⭐ 수정
      }}
    >
      <MyInput
        errorMessage="이메일 주소를 입력해주세요"
        label="이메일"
        name="email"
        placeholder="이메일 주소를 입력해주세요"
      />

      <MyButton
        label={buttonLabel}
        color={buttonColor}
        variant={buttonVariant}
        type="submit"
      />
    </Form>
  );
}
