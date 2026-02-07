import * as React from "react";
import LogoHeader from "../molecule/logo-header";
import SignForm from "../molecule/signWithEmailForm";

type UnsubscribeProps = {
  onSubmit?: (email: string) => void;
};

export default function Unsubscribe({ onSubmit }: UnsubscribeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <LogoHeader
        iconLabel="⚠"
        iconVariant="dark"
        titleText="구독 취소"
        subtitleText="정말 구독을 취소하시겠습니까?"
      />

      <SignForm
        buttonLabel="구독 취소하기"
        buttonVariant="dark"
        onSubmit={onSubmit}
      />
    </div>
  );
}
