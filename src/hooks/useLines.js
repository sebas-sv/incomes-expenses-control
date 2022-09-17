import { useContext } from "react";
import LinesContext from "../contexts/LinesContext";

const useLines = () => useContext(LinesContext);

export default useLines;