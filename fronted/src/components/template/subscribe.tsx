import * as React from "react";
import LogoHeader from "../molecule/logo-header";
import SignForm from "../molecule/signWithEmailForm";

type SubscribeProps = {
  onSubmit?: (email: string) => void; // ⭐ 수정
};

export default function Subscribe({ onSubmit }: SubscribeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <LogoHeader
        iconLabel="✉︎"
        iconVariant="point"
        titleText="웹툰리뷰 구독하기"
        subtitleText="매주 엄선된 웹툰리뷰를 이메일로 받아보세요"
      />

      <SignForm
        buttonLabel="무료로 구독하기"
        buttonVariant="point"
        onSubmit={onSubmit}
      />
    </div>
  );
}
