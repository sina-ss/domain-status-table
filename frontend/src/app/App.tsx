import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import LogsTable from "../pages/table/LogsTable";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LogsTable />
    </ThemeProvider>
  );
}

export default App;
