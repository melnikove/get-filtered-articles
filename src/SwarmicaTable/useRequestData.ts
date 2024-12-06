import { useEffect } from "react";
import { EListEntityName, IArticle, ICategory, IGetEntitiesListPromiseValue, IGetInstancePromiseValue, IUseRequestDataProps } from "./type";
import { getArticlesListService, getCategoriesListService, getInstanceService } from "./services";
import { INSTANCE_ENTITY_NAME } from "../constants";

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
        isDictFetched
    } = params;


    useEffect(() => {
        setIsError(false);
        setIsLoading(true);
        const promiseList = [];
        promiseList.push(getArticlesListService({locale, categories: selectedCategories}));
        if (!isDictFetched) {
            promiseList.push(getCategoriesListService());
            promiseList.push(getInstanceService());
        }
        Promise.all(promiseList).then((promisesResult: Array<unknown>) => {
            setIsLoading(false);
            setIsError(false);
            setIsDictFetched(true);
            promisesResult.forEach(promiseResult => {
                const { entityName } = promiseResult as IGetEntitiesListPromiseValue<IArticle> 
                | IGetEntitiesListPromiseValue<ICategory> 
                | IGetInstancePromiseValue;
                switch (entityName) {
                    case EListEntityName.Article:
                        setArticlesList((promiseResult as IGetEntitiesListPromiseValue<IArticle> ).results);
                        break;
                    case EListEntityName.Category:
                        setCategoriesList((promiseResult as IGetEntitiesListPromiseValue<ICategory>).results);
                        break;
                    case INSTANCE_ENTITY_NAME: 
                        setLocaleList((promiseResult as IGetInstancePromiseValue).locales);
                        break;
                }
            });
        }).catch(() => {
            setIsError(true);
        })
    }, [locale, selectedCategories]);
}


export { useRequestData };