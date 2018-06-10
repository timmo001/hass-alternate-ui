import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const styles = theme => ({
  navigation: {
    position: 'fixed',
    width: '100%',
    top: 0,
    backgroundColor: theme.palette.primary[500],
  },
  action: {
    color: '#000000 !important',
    // '&$selected': {
    //   color: '#000000',
    // },
  },
  icon: {
    fontSize: 22,
  },
});

class Navigation extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.handlePageChange(value);
  };

  render() {
    const { classes, entities, page } = this.props;

    return (
      <BottomNavigation
        value={page}
        onChange={this.handleChange}
        showLabels
        className={classes.navigation}>

        <BottomNavigationAction
          className={classes.action}
          value={entities.find(entity => entity[0] === 'group.default_view')}
          label={'Home'}
          icon={<i className={classNames('mdi', 'mdi-home', classes.icon)} />} />

        {entities.filter(entity => {
          return entity[0].startsWith('group.') && entity[1].attributes.view && entity[0] !== 'group.default_view'
        }).map(page => {
          return (
            <BottomNavigationAction
              key={page[1].attributes.order}
              className={classes.action}
              value={page}
              label={page[1].attributes.friendly_name}
              icon={page[1].attributes.icon &&
                <i className={classNames('mdi', page[1].attributes.icon.replace(':', '-'), classes.icon)} />
              } />
          )
        })
        }
      </BottomNavigation>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  page: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Navigation);
