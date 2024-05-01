"use client";

import { useGetNews } from "@/hooks";

export default function Home() {
  const { news } = useGetNews({
    query: undefined,
    skip: [],
    page: 1,
    pageSize: 5,
  });
  console.log(news);
  return (
    <main className="flex justify-center items-center h-screen">News</main>
  );
}
