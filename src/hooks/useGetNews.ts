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
  },
  abc: {
    searchFunction: abcNewsApi,
  },
  guardian: {
    searchFunction: guardianNewsApi,
  },
};

export const useGetNews = ({
  query,
  skip,
  page,
  pageSize,
}: ParamsType): GetNewsHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsType[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchPromises = Object.entries(newsApis)
          .filter(([key]) => !skip?.includes(key))
          .map(([, api]) => api.searchFunction({ query, page, pageSize }));

        const searchResults = await Promise.all(searchPromises);
        setNews(shuffle(searchResults.flat()));
      } catch (error) {
        setError("Error occured while fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, skip?.length]);

  return { loading, error, news };
};

async function bbcNewsApi({
  query,
  page,
  pageSize,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        sources: "bbc-news",
        qInTitle: query ?? "world",
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "BBC",
  }));
}

async function abcNewsApi({
  query,
  page,
  pageSize,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        sources: "abc-news",
        qInTitle: query ?? "world",
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "ABC News",
  }));
}

async function searchNewsApi({
  query,
  page,
  pageSize,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_NEWS_API_BASE_URL as string,
    {
      params: {
        qInTitle: query ?? "world",
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
        page,
        pageSize,
      },
    },
  );

  return response.data.articles?.map((article: NewsApiArticle) => ({
    id: uuidv4(),
    title: article.title,
    url: article.url,
    source: "World News",
  }));
}

async function guardianNewsApi({
  query,
  page,
  pageSize,
}: Exclude<ParamsType, "skip">): Promise<NewsType[]> {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_GUARDIAN_BASE_URL as string,
    {
      params: {
        q: query ?? "world",
        "api-key": process.env.NEXT_PUBLIC_GUARDIAN_API_KEY as string,
        page,
        "page-size": pageSize,
      },
    },
  );

  return response.data.response?.results.map((article: GuardianArticle) => ({
    id: uuidv4(),
    title: article.webTitle,
    url: article.webUrl,
    source: "The Guardian News",
  }));
}
