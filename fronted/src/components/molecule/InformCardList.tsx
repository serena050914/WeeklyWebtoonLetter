import * as React from "react";
import MyInformCard from "../atom/informCard";

type InformCardData = {
  value: string;
  label: string;
};

type InformCardListProps = {
  informCardData: InformCardData[];
};

export default function InformCardList({ informCardData }: InformCardListProps) {
  return (
    <div className="w-full h-auto flex items-stretch gap-4">
      {informCardData.map((data, index) => (
        <MyInformCard key={index} value={data.value} label={data.label} />
      ))}
    </div>
  );
}
