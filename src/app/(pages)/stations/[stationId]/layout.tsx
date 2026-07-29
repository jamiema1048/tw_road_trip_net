"use client";
import { ReactNode } from "react";

interface StationContentLayoutProps {
  children: ReactNode;
}

const StationContentLayout = ({ children }: StationContentLayoutProps) => {
  return <>{children}</>;
};

export default StationContentLayout;
