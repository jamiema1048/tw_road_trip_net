"use client";
import { ReactNode } from "react";

interface RailwayContentLayoutProps {
  children: ReactNode;
}

const RailwayContentLayout = ({ children }: RailwayContentLayoutProps) => {
  return <>{children}</>;
};

export default RailwayContentLayout;
