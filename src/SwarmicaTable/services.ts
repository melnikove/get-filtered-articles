import { apiRequestGet } from "./api";
import {
  API_ARTICLES_URL,
  API_CATEGORIES_URL,
  API_INSTANCE_URL,
  INSTANCE_ENTITY_NAME,
} from "../constants";
import {
  EListEntityName,
  IArticle,
  IGetArticlesReqParams,
  IGetEntitiesListPromiseValue,
  IGetInstancePromiseValue,
} from "./type";

const getEntitiesList = async function <T>(
  requestUrl: string,
  entityName: EListEntityName,
): Promise<IGetEntitiesListPromiseValue<T>> {
  const resp = await apiRequestGet(requestUrl);
  if (!resp.ok) { 
    throw new Error('getEntitiesList error!!!')
  }
  const result = await resp.json();
  return {
    ...result,
    entityName,
  };
};

const getArticlesListService = async (params: IGetArticlesReqParams) => {
  const { locale, categories } = params;
  
  const url =
    API_ARTICLES_URL +
    "?search=1" +
    (locale ? "&locale=" + locale : "") +
    (categories.length ? `&category=${encodeURI(categories.join(","))}` : "");

  return getEntitiesList<IArticle>(url, EListEntityName.Article);
};

const getCategoriesListService = async () => {
  return getEntitiesList<IArticle>(
    API_CATEGORIES_URL,
    EListEntityName.Category,
  );
};

const getInstanceService = async (): Promise<IGetInstancePromiseValue> => {
  const resp = await apiRequestGet(API_INSTANCE_URL);
  if (!resp.ok) { 
    throw new Error('getInstanceService error!!!')
  }
  const result = await resp.json();
  return {
    ...result,
    entityName: INSTANCE_ENTITY_NAME,
  };
};

export { getArticlesListService, getCategoriesListService, getInstanceService };
