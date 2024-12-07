import { Dispatch, SetStateAction } from "react";
import { SetterOrUpdater } from "recoil";

interface RequestParams {
  [key: string]: unknown;
}

enum EArticleStatus {
  UNAPPROVED = "Unapproved",
  APPROVED = "Approved",
  PUBLISHED = "Published",
  ARCHIVED = "Archived",
}

interface IArticle {
  id: number;
  ext_id: number | null;
  rank: number;
  status: EArticleStatus;
  highlight: {
    title?: string;
  };
  public_urls: string;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
}

interface ICategory {
  id: number;
  name: {
    ru: string;
    en: string;
    hi: string;
  };
  public: boolean;
  image_path: string;
}

interface IInstance {
  plan: "string";
  locales: string[];
  default_locale: "string";
  currency: "string";
  base_url: "string";
  brand: "string";
  logo: "string";
  favicon: "string";
  spinner: "string";
  html_title: "string";
  authentication_providers: string[];
  issue_tracker: "string";
  n_weekly_aqi: number;
  n_weekly_lai: number;
  ticket_form: "string";
  features: string;
  license: object;
}

type ArticleItem = IArticle & {
  uuid: string;
  isViewed?: boolean;
};
type ArticleItemsList = Array<ArticleItem>;

interface IGetArticlesReqParams {
  categories: string[];
  searchString: string;
  locale?: string;
}

interface IGetEntitiesListResponse<T> {
  next: string | null;
  previous: string | null;
  results: Array<T>;
  entityName?: string;
}

interface IUseRequestDataProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsDictFetched: Dispatch<SetStateAction<boolean>>;
  setArticlesList: SetterOrUpdater<ArticleItemsList>;
  setCategoriesList: SetterOrUpdater<ICategory[]>;
  setLocaleList: SetterOrUpdater<string[]>;
  selectedCategories: string[];
  locale: string | undefined;
  searchString: string | null;
  isDictFetched: boolean;
}

enum EListEntityName {
  Article = "Article",
  Category = "Category",
}

type InstanceEntityName = "Instance";

type IGetEntitiesListPromiseValue<T> = IGetEntitiesListResponse<T> & {
  entityName?: EListEntityName;
};

type IGetInstanceResponse = IInstance;

type IGetInstancePromiseValue = IGetInstanceResponse & {
  entityName?: InstanceEntityName;
};

type ArticlesList = Array<IArticle>;

export type {
  RequestParams,
  IUseRequestDataProps,
  IArticle,
  ArticleItem,
  ArticleItemsList,
  IGetEntitiesListResponse,
  IGetInstanceResponse,
  ArticlesList,
  ICategory,
  IInstance,
  IGetEntitiesListPromiseValue,
  IGetInstancePromiseValue,
  IGetArticlesReqParams,
  InstanceEntityName,
};

export { EArticleStatus, EListEntityName };
