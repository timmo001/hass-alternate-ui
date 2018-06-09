import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import 'typeface-roboto';
import './App.css';
import Root from './Root';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
  },
});
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Root />
      </MuiThemeProvider>
    );
  }
}

export default App;
