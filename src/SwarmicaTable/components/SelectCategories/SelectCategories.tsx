import React, { FC } from "react";
import { ISelectCategoriesProps } from "./type";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectedCategories: FC<ISelectCategoriesProps> = ({
    categoriesList,
    selectedCategories,
    disabled,
    handleChangeSelectedCategory,
}) => {
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
    );
};

export default React.memo(SelectedCategories);
