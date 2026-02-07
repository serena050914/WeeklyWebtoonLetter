import * as React from "react";
import { Input } from "@heroui/react";

type MyInputProps = {
  errorMessage: string;
  label: string;
  name: string;
  placeholder: string;
};

export default function MyInput({
  errorMessage,
  label,
  name,
  placeholder,
}: MyInputProps) {
  return (
    <Input
      isRequired
      errorMessage={errorMessage}
      label={label}
      labelPlacement="outside"
      name={name}
      placeholder={placeholder}
      type="text"
      className="w-full font-bold"
    />
  );
}
