import * as React from "react";

type MyInformCardProps = {
  value: string;
  label: string;
};

export default function MyInformCard({ value, label }: MyInformCardProps) {
  return (
    <div className="flex flex-1 h-24 rounded-lg bg-white p-4 shadow-md flex flex-col items-start gap-1 justify-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium text-default-500">{label}</p>
    </div>
  );
}
