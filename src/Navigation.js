import React from 'react';
import { withRouter } from "react-router-dom";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  appbar: {
    backgroundColor: theme.palette.primary[500],
    height: 58,
  },
  action: {
    minHeight: 58,
    color: theme.palette.defaultText + ' !important',
  },
  icon: {
    fontSize: 22,
  },
  navigation: {
    height: 58,
    [theme.breakpoints.up('lg')]: {
      marginLeft: 142,
    },
    marginRight: 142,
  },
  navigationRight: {
    top: 4,
    right: 14,
    position: 'fixed',
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Navigation extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.history.push('/view/' + value[0]);
    this.props.handlePageChange(value);
  };

  render() {
    const { classes, pages, page, theme, setTheme } = this.props;

    return (
      <AppBar className={classes.appbar} position="fixed" color="default">
        <Tabs
          className={classes.navigation}
          value={page}
          onChange={this.handleChange}
          fullWidth
          scrollable
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="primary">

          <Tab
            value={pages.find(entity => entity[0] === 'group.default_view')}
            className={classes.action}
            label={'Home'}
            icon={<i className={classNames('mdi', 'mdi-home', classes.icon)} />} />

          {pages.filter(entity => entity[0] !== 'group.default_view').map((page, i) => {
            return (
              <Tab
                key={page[1].attributes.order}
                value={page}
                className={classes.action}
                label={page[1].attributes.friendly_name}
                icon={page[1].attributes.icon &&
                  <i className={classNames('mdi', page[1].attributes.icon.replace(':', '-'), classes.icon)} />
                } />
            )
          })
          }
        </Tabs>

        <form className={classes.navigationRight} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="theme">Theme</InputLabel>
            <Select
              value={theme}
              onChange={event => setTheme(event.target.value)}
              inputProps={{
                name: 'theme',
                id: 'theme',
              }}>
              <MenuItem value={-1}>Auto</MenuItem>
              <MenuItem value={0}>Light</MenuItem>
              <MenuItem value={1}>Dark</MenuItem>
            </Select>
          </FormControl>
        </form>

      </AppBar>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  page: PropTypes.array.isRequired,
  theme: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default withStyles(styles)(withRouter(Navigation));
