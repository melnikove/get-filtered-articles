import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { ForwardRefRenderFunction, forwardRef } from "react";
import { ISelectLocaleProps } from "./type";

const SelectLocale: ForwardRefRenderFunction<
  SelectProps,
  ISelectLocaleProps
> = ({ locale, localeList, disabled, handleChangeLocale }, ref) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-locale-label-id">Locale</InputLabel>
      <Select
        labelId="select-locale-label-id"
        disabled={disabled}
        id="select-locale"
        value={locale || ""}
        label={"Locale"}
        onChange={handleChangeLocale}
        inputProps={{
          width: 150,
        }}
        inputRef={ref}
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
  );
};

export default React.memo(forwardRef(SelectLocale));
