import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { ArticleItem } from "./type";
import {
  articlesListAtom,
  categoriesListAtom,
  localesListAtom,
} from "../atoms";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  debounce,
} from "@mui/material";
import { markToLS } from "../helpers";
import { useRequestData } from "./useRequestData";
import { SELECTED_COLOR } from "../constants";

function SwarmicTable() {
  const [articlesList, setArticlesList] = useRecoilState(articlesListAtom);
  const [categoriesList, setCategoriesList] =
    useRecoilState(categoriesListAtom);
  const [localeList, setLocaleList] = useRecoilState(localesListAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDictFetched, setIsDictFetched] = useState(false);

  const [locale, setLocale] = useState<string | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchString, setSearchString] = useState<string | null>(null);

  useRequestData({
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
  });

  const handleClickFabrick = useCallback(
    (index: number) => {
      return () => {
        const list = articlesList.slice();
        list[index] = { ...list[index], isViewed: true };
        setArticlesList(list);
        markToLS(String(list[index].id));
      };
    },
    [articlesList, setArticlesList],
  );

  const handleChangeLocale = useCallback((event: SelectChangeEvent<string>) => {
    setLocale(event.target.value);
  }, []);

  const handleChangeSelectedCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      setSelectedCategories(event.target.value as string[]);
    },
    [],
  );

  const searchRef = useRef(null);

  const handleResetClick = useCallback(() => {
    setLocale(undefined);
    setSelectedCategories([]);
    setArticlesList([]);
    if (searchRef.current) {
        (searchRef.current as HTMLInputElement).value = '';
        setSearchString('');
    }
  }, [searchRef]);

  const handleChangeSearchStr = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  }, []);

  const debouncedHandler = debounce(handleChangeSearchStr, 300);

  return (
    <Container
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        border: "1px solid grey",
        width: "100%",
        height: "auto",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="select-locale-label-id">Locale</InputLabel>
        <Select
          labelId="select-locale-label-id"
          disabled={isError || isLoading}
          id="select-locale"
          value={locale || ""}
          label={"Locale"}
          onChange={handleChangeLocale}
          inputProps={{
            width: 150,
          }}
          MenuProps={{
            PaperProps: {
              style: {
                width: 150,
              },
            },
          }}
        >
          {localeList.map((locale) => (
            <MenuItem key={locale} value={locale}>
              {locale}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: "20px" }}>
        <InputLabel id="select-category-label-id">Categories</InputLabel>
        <Select
          labelId="select-category-label-id"
          id="select-category"
          multiple
          disabled={isError || isLoading}
          value={selectedCategories}
          label={"Categories"}
          onChange={handleChangeSelectedCategory}
          inputProps={{
            width: 150,
          }}
          MenuProps={{
            PaperProps: {
              style: {
                width: 150,
              },
            },
          }}
        >
          {categoriesList.map((category) => (
            <MenuItem key={String(category.id)} value={String(category.id)}>
              {category.name?.ru || category.name?.en}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: "20px" }}>
        <TextField
            required={true}
            label={'Search'}
            placeholder={'Search'}
            onChange={debouncedHandler}
            inputRef={searchRef}
        />
      </FormControl>
      <Button
        variant="contained"
        sx={{
          width: "150px",
          marginTop: "20px",
        }}
        onClick={handleResetClick}
      >
        Reset
      </Button>

      {isError && <h3>Ошибка загрузки...</h3>}
      {isLoading && <h3>Загрузка...</h3>}
    
      {!isError && !isLoading && !articlesList.length && <h3>Нет данных</h3>}  
      {!isError && !isLoading && !!articlesList.length && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <b>Title</b>
                </TableCell>
                <TableCell align="center">
                  <b>Просмотрено</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articlesList.map((article: ArticleItem, index) => (
                <TableRow
                  key={article.uuid}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 },
                    ...(article.isViewed && {
                      backgroundColor: SELECTED_COLOR,
                    }),
                  }}
                  onClick={handleClickFabrick(index)}
                >
                  <TableCell component="th" scope="row">
                    {article.highlight.title || "Нет данных"}
                  </TableCell>
                  <TableCell align="center">
                    {article.isViewed ? "Да" : "Нет"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default React.memo(SwarmicTable);
