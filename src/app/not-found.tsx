"use client";
import React from "react";
import Head from "next/head";
import { NotFoundClient } from "@/src/app/(client)/(NotFound)/NotFoundClient";
const NotFound = (): React.ReactElement => {
  return (
    <>
      <Head>
        <title>找不到頁面</title>
      </Head>
      <NotFoundClient></NotFoundClient>
    </>
  );
};

export default NotFound;
