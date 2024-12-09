import React, { ForwardRefRenderFunction, forwardRef } from "react";
import { ISelectCategoriesProps } from "./type";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";

const SelectedCategories: ForwardRefRenderFunction<
  SelectProps,
  ISelectCategoriesProps
> = (
  {
    categoriesList,
    selectedCategories,
    disabled,
    handleChangeSelectedCategory,
  },
  ref,
) => {
  return (
    <FormControl fullWidth sx={{ marginTop: "20px" }}>
      <InputLabel id="select-category-label-id">Categories</InputLabel>
      <Select
        labelId="select-category-label-id"
        id="select-category"
        multiple
        disabled={disabled}
        value={selectedCategories}
        label={"Categories"}
        onChange={handleChangeSelectedCategory}
        inputRef={ref}
        inputProps={{
          width: 150,
        }}
        MenuProps={{
          PaperProps: {
            style: {
              width: 150,
              pointerEvents: disabled ? "none" : "auto",
            },
          },
        }}
      >
        {categoriesList.map((category) => (
          <MenuItem
            key={String(category.id)}
            value={String(category.id)}
            disabled={disabled}
          >
            {category.name?.ru || category.name?.en}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(forwardRef(SelectedCategories));
