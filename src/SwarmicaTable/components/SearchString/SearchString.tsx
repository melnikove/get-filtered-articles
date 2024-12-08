import React, { FC, ForwardRefRenderFunction, forwardRef } from "react";
import { ISearchStringProps } from "./type";
import { FormControl, TextField } from "@mui/material";

const SearchString: ForwardRefRenderFunction<
  HTMLInputElement,
  ISearchStringProps
> = ({ disabled, handleChange }, ref) => {
  return (
    <FormControl fullWidth sx={{ marginTop: "20px" }}>
      <TextField
        required={true}
        disabled={disabled}
        label={"Search string"}
        onChange={handleChange}
        inputRef={ref}
      />
    </FormControl>
  );
};

export default React.memo(forwardRef(SearchString));
