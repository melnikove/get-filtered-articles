import React, { useCallback, useState } from 'react';
import { useRecoilState } from "recoil";
import { ArticleItem, IArticle, ICategory, IGetEntitiesListResponse, IInstance } from "./type";
import { articlesListAtom, categoriesListAtom, localesListAtom } from "./atoms";
import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { markToLS } from './helper';

const fetchEntitiesList = async function<T>(requestUrl: string, entityName: string): Promise<IGetEntitiesListResponse<T> | null> {
        const resp = await fetch(requestUrl);
        const result = await resp.json();
        return {
            ...result,
            entityName
        };
}

const fetchInstance = async (): Promise<IInstance | null> => {
        const resp = await fetch('/api/instance/');
        const result = await resp.json();
        return {
            ...result,
            entityName: 'Instance',
        };
}

function SwarmicTable() {
    const [articlesList, setArticlesList] = useRecoilState(articlesListAtom);
    const [categoriesList, setCategoriesList] = useRecoilState(categoriesListAtom);
    const [localeList, setLocaleList] = useRecoilState(localesListAtom);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [locale, setLocale] = useState<string | undefined>();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        setIsError(false);
        setIsLoading(true);
        const articlesBaseUrl = '/api/search/articles/?search=1';
        const localesQueryParam = locale ? ('&locale=' + locale) : '';
        const categoriesQueryParam = selectedCategories.length ? (`&category=${encodeURI(selectedCategories.join(','))}`) : ''
        const articlesReqUrl = articlesBaseUrl 
            + localesQueryParam +  categoriesQueryParam;
        const promiseList = [];
        promiseList.push(fetchEntitiesList(articlesReqUrl, 'Article'));
        if (!categoriesList.length && !localeList.length) {
            promiseList.push(fetchEntitiesList('/api/categories/', 'Categories'));
            promiseList.push(fetchInstance());
        }
        Promise.all(promiseList).then((promisesResult: Array<unknown>) => {
            setIsLoading(false);
            setIsError(false);
            console.log('promisesResult=', promisesResult);
            promisesResult.forEach(promiseResult => {
                const { entityName,  } = promiseResult as {entityName: string;};
                switch (entityName) {
                    case 'Article':
                        setArticlesList((promiseResult as IGetEntitiesListResponse<IArticle>).results);
                        break;
                    case 'Categories':
                        setCategoriesList((promiseResult as IGetEntitiesListResponse<ICategory>).results);
                        break;
                    case 'Instance': 
                        setLocaleList((promiseResult as IInstance).locales);
                        break;
                }
            });
        }).catch(() => {
            console.log('!!!!error');
            setIsError(true);
        })
    }, [locale, selectedCategories]);

    console.log('articlesList=', articlesList);
    console.log('categoriesList=', categoriesList);
    console.log('localeList=', localeList);

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
        console.log('handleChangeSelectedCategory:', event);
        setSelectedCategories(event.target.value as string[]);
    }, []);

    if (isLoading) return <h3>Загрузка...</h3>;

    if (isError) return <h3>Ошибка загрузки...</h3>;

    
    console.log('locale=', locale);

    return (
        <div>
            <FormControl fullWidth>
              <InputLabel id="select-locale-label-id">Locale</InputLabel>
              <Select
                labelId="select-locale-label-id"
                id="select-locale"
                // multiple
                value={locale}
                label={"Locale"}
                onChange={handleChangeLocale}
                // input={<OutlinedInput label="Locale" style={{width: 150}}/>}
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
                        // style={getStyles(name, personName, theme)}
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
                // @ts-ignore
                value={selectedCategories}
                label={"Categories"}
                onChange={handleChangeSelectedCategory}
                // input={<OutlinedInput label="Locale" style={{width: 150}}/>}
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
                        // style={getStyles(name, personName, theme)}
                    >
                        {category.name?.ru || category.name?.ru}
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
                            {article.highlight.title}
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