import { RailwayCompanyGroup } from "./RailwayCompanyGroup";

interface Line {
  id: number;
  name: string;
  co: number;
}

export function RailwayCompanyGroupShell({
  co,
  companyName,
  lineList,
}: {
  co: string | number;
  companyName: string;
  lineList: Line[];
}) {
  return (
    <RailwayCompanyGroup
      co={co}
      companyName={companyName}
      lineList={lineList}
    />
  );
}
