import { ChangeEvent } from "react";

export interface ISearchStringProps {
  disabled: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
