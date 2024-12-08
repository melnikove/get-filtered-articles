import { SelectChangeEvent } from "@mui/material";
import { ICategory } from "../../type";

export interface ISelectCategoriesProps {
  categoriesList: Array<ICategory>;
  selectedCategories: string[];
  disabled: boolean;
  handleChangeSelectedCategory: (event: SelectChangeEvent<string[]>) => void;
}
