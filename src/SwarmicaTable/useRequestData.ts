import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ArticleItemsList,
  EListEntityName,
  IArticle,
  ICategory,
  IGetEntitiesListPromiseValue,
  IGetInstancePromiseValue,
  IUseRequestDataProps,
} from "./type";
import {
  getArticlesListService,
  getCategoriesListService,
  getInstanceService,
} from "./services";
import { INSTANCE_ENTITY_NAME } from "../constants";
import { getViewedIds } from "../helpers";

const useRequestData = (params: IUseRequestDataProps) => {
  const {
    setIsError,
    setIsLoading,
    setIsDictFetched,
    setArticlesList,
    setCategoriesList,
    setLocaleList,
    selectedCategories,
    locale,
    searchString,
    isDictFetched,
  } = params;

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    const promiseList = [];
    if (searchString) {
      promiseList.push(
        getArticlesListService({ locale, categories: selectedCategories, searchString }),
      );
    }
    if (!isDictFetched) {
      promiseList.push(getCategoriesListService());
      promiseList.push(getInstanceService());
    }
    Promise.all(promiseList)
      .then((promisesResult: Array<unknown>) => {
        setIsLoading(false);
        setIsError(false);
        setIsDictFetched(true);
        promisesResult.forEach((promiseResult) => {
          const { entityName } = promiseResult as
            | IGetEntitiesListPromiseValue<IArticle>
            | IGetEntitiesListPromiseValue<ICategory>
            | IGetInstancePromiseValue;
          switch (entityName) {
            case EListEntityName.Article:
              const isViewedIds = getViewedIds();
              const articlesList: ArticleItemsList = (
                promiseResult as IGetEntitiesListPromiseValue<IArticle>
              ).results.map((article: IArticle) => ({
                ...article,
                uuid: uuidv4(),
                isViewed: isViewedIds.includes(String(article.id)),
              }));
              setArticlesList(articlesList);
              break;
            case EListEntityName.Category:
              setCategoriesList(
                (promiseResult as IGetEntitiesListPromiseValue<ICategory>)
                  .results,
              );
              break;
            case INSTANCE_ENTITY_NAME:
              setLocaleList(
                (promiseResult as IGetInstancePromiseValue).locales,
              );
              break;
          }
        });
      })
      .catch(() => {
        setIsError(true);
      });
  }, [locale, selectedCategories, searchString]);
};

export { useRequestData };
