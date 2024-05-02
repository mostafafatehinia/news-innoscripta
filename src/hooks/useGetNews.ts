import { useState, useEffect } from "react";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { shuffle } from "@/utils";

import {
  NewsApiArticle,
  GuardianArticle,
  NewsApi,
  NewsType,
  ParamsType,
  GetNewsHook,
} from "./types";

export const newsApis: Record<string, NewsApi> = {
  news: {
    searchFunction: searchNewsApi,
  },
  bbc: {
    searchFunction: bbcNewsApi,
    domain: "bbc.com",
  },
  abc: {
    searchFunction: abcNewsApi,
    domain: "abcnews.go.com",
  },
  guardian: {
    searchFunction: guardianNewsApi,
  },
};

const calculateExcludedDomains = (skip: string[] | undefined) => {
  return skip
    ?.map((source) => {
      return newsApis[source].domain;
    })
    .join(",");
};

export const useGetNews = ({
  query: _query,
  skip,
  page,
  pageSize,
  from,
  to,
}: ParamsType): GetNewsHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsType[]>([]);
  const query = Boolean(_query) ? _query : "world";

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchPromises = Object.entries(newsApis)
          .filter(([key]) => !skip?.includes(key))
          .map(([, api]) =>
            api.searchFunction({ query, page, pageSize, from, to, skip }),
          );

        const searchResults = await Promise.all(searchPromises);
        setNews(shuffle(searchResults.flat()));
      } catch (error) {
        setError("Error occured while fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, skip?.length, page, query, pageSize, from, to]);

  return { loading, error, news };
};

async function bbcNewsApi({
  query,
  page,
  pageSize,
  from,
  to,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        sources: "bbc-news",
        qInTitle: query,
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
        from,
        to,
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "bbc",
  }));
}

async function abcNewsApi({
  query,
  page,
  pageSize,
  from,
  to,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        sources: "abc-news",
        qInTitle: query,
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
        from,
        to,
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "abc",
  }));
}

async function searchNewsApi({
  query,
  page,
  pageSize,
  from,
  to,
  skip,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        qInTitle: query,
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
        from,
        to,
        excludeDomains: calculateExcludedDomains(skip),
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "news",
  }));
}

async function guardianNewsApi({
  query,
  page,
  pageSize,
  from,
  to,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_GUARDIAN_BASE_URL as string,
    {
      params: {
        q: query,
        "api-key": process.env.NEXT_PUBLIC_GUARDIAN_API_KEY as string,
        page,
        "page-size": pageSize,
        "from-date": from,
        "to-date": to,
      },
    },
  );

  return response.data.response?.results.map((article: GuardianArticle) => ({
    id: uuidv4(),
    title: article.webTitle,
    url: article.webUrl,
    source: "guardian",
  }));
}
