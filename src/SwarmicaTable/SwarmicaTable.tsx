import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRecoilState } from "recoil";
import { ArticleItem } from "./type";
import {
  articlesListAtom,
  categoriesListAtom,
  localesListAtom,
} from "../atoms";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  debounce,
} from "@mui/material";
import { markToLS } from "../helpers";
import { useRequestData } from "./useRequestData";
import { SELECTED_COLOR } from "../constants";
import SelectLocale from "./components/SelectLocale/SelectLocale";
import SelectedCategories from "./components/SelectCategories/SelectCategories";
import SearchString from "./components/SearchString/SearchString";

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

  const searchRef = useRef(null);
  const selectLocaleRef = useRef(null);
  const selectCategoriesRef = useRef(null);

  const currentFocusRef = useRef(null);

  useEffect(() => {
    if (isDictFetched && selectLocaleRef.current) {
      (selectLocaleRef.current as HTMLInputElement).focus();
    }
  }, [isDictFetched, selectLocaleRef]);

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

  const handleChangeLocale = useCallback(
    (event: SelectChangeEvent<string>) => {
      setLocale(event.target.value);
      currentFocusRef.current = selectLocaleRef.current;
    },
    [selectLocaleRef, currentFocusRef],
  );

  const handleChangeSelectedCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      setSelectedCategories(event.target.value as string[]);
      currentFocusRef.current = selectCategoriesRef.current;
    },
    [currentFocusRef, selectCategoriesRef],
  );

  const handleResetClick = useCallback(() => {
    setLocale(undefined);
    setSelectedCategories([]);
    setArticlesList([]);
    if (searchRef.current) {
      (searchRef.current as HTMLInputElement).value = "";
      setSearchString("");
    }
    if (currentFocusRef.current) {
      (currentFocusRef.current as HTMLInputElement).focus();
    }
  }, [searchRef, currentFocusRef]);

  useEffect(() => {
    if (currentFocusRef.current) {
      (currentFocusRef.current as HTMLInputElement).focus();
    }
  }, [isLoading, currentFocusRef]);

  const handleChangeSearchStr = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchString(event.target.value);
      currentFocusRef.current = searchRef.current;
    },
    [currentFocusRef, searchRef],
  );

  const debouncedHandler = debounce(handleChangeSearchStr, 300);

  const haveNoFilterValues = useMemo(
    () => !locale && !selectedCategories.length && !searchString,
    [locale, selectedCategories, searchString],
  );

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
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ fontWeight: "bolder" }}
        >
          <div>Блок фильтрации</div>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <SelectLocale
            {...{
              locale,
              localeList,
              disabled: isLoading,
              ref: selectLocaleRef,
              handleChangeLocale,
            }}
          />
          <SelectedCategories
            {...{
              categoriesList,
              selectedCategories,
              disabled: isLoading,
              ref: selectCategoriesRef,
              handleChangeSelectedCategory,
            }}
          />
          <SearchString
            disabled={isLoading}
            handleChange={debouncedHandler}
            ref={searchRef}
          />
          <Button
            variant="contained"
            sx={{
              width: "150px",
              marginTop: "20px",
            }}
            disabled={isLoading || haveNoFilterValues}
            onClick={handleResetClick}
          >
            Reset
          </Button>
        </AccordionDetails>
      </Accordion>

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
                  tabIndex={index}
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

export default SwarmicTable;
