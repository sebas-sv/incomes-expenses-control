import { useContext } from "react";
import YearContext from "../contexts/YearContext";

const useYear = () => useContext(YearContext);

export default useYear;