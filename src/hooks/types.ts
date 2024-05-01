export interface NewsApi {
  searchFunction: ({
    query,
    page,
    pageSize,
  }: Exclude<ParamsType, "skip">) => Promise<NewsType[]>;
}

export interface NewsApiArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
}

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: Date;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  isHosted: boolean;
  pillarId?: string;
  pillarName?: string;
}

export interface NewsType {
  id: string;
  title: string;
  url: string;
  source: string;
}
export interface ParamsType {
  query?: string;
  skip?: string[];
  page?: number;
  pageSize?: number;
}

export interface GetNewsHook {
  loading: boolean;
  error: string | null;
  news: NewsType[];
}
