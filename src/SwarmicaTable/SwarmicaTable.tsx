import React, { useCallback, useState } from 'react';
import { useRecoilState } from "recoil";
import { ArticleItem, EListEntityName, IArticle, ICategory, IGetEntitiesListPromiseValue, IGetInstancePromiseValue } from "./type";
import { articlesListAtom, categoriesListAtom, localesListAtom } from "../atoms";
import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { markToLS } from '../helpers';
import { getArticlesListService, getCategoriesListService, getInstanceService } from './services';
import { INSTANCE_ENTITY_NAME } from '../constants';
import { useRequestData } from './useRequestData';

function SwarmicTable() {
    const [articlesList, setArticlesList] = useRecoilState(articlesListAtom);
    const [categoriesList, setCategoriesList] = useRecoilState(categoriesListAtom);
    const [localeList, setLocaleList] = useRecoilState(localesListAtom);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isDictFetched, setIsDictFetched] = useState(false);

    const [locale, setLocale] = useState<string | undefined>();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useRequestData({
        setIsError,
        setIsLoading,
        setIsDictFetched,
        setArticlesList,
        setCategoriesList,
        setLocaleList,
        selectedCategories,
        locale,
        isDictFetched
    });

    const handleClickFabrick = useCallback((index: number) => {
        return () => {
            const list = articlesList.slice();
            list[index] = {...list[index], isViewed: true};
            setArticlesList(list);
            markToLS(String(list[index].id));
        }
    }, [articlesList, setArticlesList]);

    const handleChangeLocale = useCallback((event: SelectChangeEvent<string>) => {
        setLocale(event.target.value)
    }, []);

    const handleChangeSelectedCategory = useCallback((event: SelectChangeEvent<string[]>) => {
        setSelectedCategories(event.target.value as string[]);
    }, []);

    if (isLoading) return <h3>Загрузка...</h3>;

    if (isError) return <h3>Ошибка загрузки...</h3>;

    return (
        <div>
            <FormControl fullWidth>
              <InputLabel id="select-locale-label-id">Locale</InputLabel>
              <Select
                labelId="select-locale-label-id"
                id="select-locale"
                value={locale}
                label={"Locale"}
                onChange={handleChangeLocale}
                inputProps={{
                    width: 150
                }}
                MenuProps={{PaperProps: {
                    style: {
                      width: 150,
                    },
                  }}}
              >
                {localeList.map((locale) => (
                    <MenuItem
                        key={locale}
                        value={locale}
                    >
                        {locale}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            <FormControl fullWidth style={{marginTop: 20}}>
              <InputLabel id="select-category-label-id">Categories</InputLabel>
              <Select
                labelId="select-category-label-id"
                id="select-category"
                multiple
                value={selectedCategories}
                label={"Categories"}
                onChange={handleChangeSelectedCategory}
                inputProps={{
                    width: 150
                }}
                MenuProps={{PaperProps: {
                    style: {
                      width: 150,
                    },
                  }}}
              >
                {categoriesList.map((category) => (
                    <MenuItem
                        key={String(category.id)}
                        value={String(category.id)}
                    >
                        {category.name?.ru || category.name?.en}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
             <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left"><b>Title</b></TableCell>
                        <TableCell align="center"><b>Просмотрено</b></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {articlesList?.map(( article: ArticleItem, index) => (
                        <TableRow
                            key={article.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            onClick={handleClickFabrick(index)}
                        >
                        <TableCell component="th" scope="row">
                            {article.highlight.title || 'Нет данных'}
                        </TableCell>
                        <TableCell align="center">{article.isViewed ? 'Да' : 'Нет'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default React.memo(SwarmicTable);