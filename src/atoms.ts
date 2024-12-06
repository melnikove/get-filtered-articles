import { atom } from "recoil";
import { ArticleItemsList } from "./type";

const articlesListAtom = atom<ArticleItemsList>({
    key: 'articlesList',
    default: []
  });
  
  const categoriesListAtom = atom<Array<any>>({
    key: 'categoriesList',
    default: []
  });
  
  const localesListAtom = atom<Array<any>>({
    key: 'localesList',
    default: []
  });

  export { articlesListAtom, categoriesListAtom, localesListAtom };