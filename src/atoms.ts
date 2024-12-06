import { atom } from "recoil";
import { ArticleItemsList, ICategory } from "./SwarmicaTable/type";

const articlesListAtom = atom<ArticleItemsList>({
  key: "articlesList",
  default: [],
});

const categoriesListAtom = atom<Array<ICategory>>({
  key: "categoriesList",
  default: [],
});

const localesListAtom = atom<Array<string>>({
  key: "localesList",
  default: [],
});

export { articlesListAtom, categoriesListAtom, localesListAtom };
