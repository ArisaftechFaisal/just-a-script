import { createTheme, ThemeProvider } from "@mui/material";
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ReplaceString from "./ReplaceString";

const theme = createTheme();

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" component={ReplaceString} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
