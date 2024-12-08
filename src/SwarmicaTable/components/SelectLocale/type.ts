import { SelectChangeEvent } from "@mui/material";

export interface ISelectLocaleProps {
  locale: string | undefined;
  localeList: string[];
  disabled: boolean;
  handleChangeLocale: (event: SelectChangeEvent<string>) => void;
}
