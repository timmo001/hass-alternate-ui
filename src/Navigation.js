import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';

const styles = theme => ({
  navigation: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
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
          value={entities.find(entity => entity[0] === 'group.default_view')}
          label={'Home'}
          icon={<HomeIcon />} />

        {entities.filter(entity => {
          return entity[0].startsWith('group.') && entity[1].attributes.view && entity[0] !== 'group.default_view'
        }).map(entity => {
          return (
            <BottomNavigationAction
              key={entity[1].attributes.order}
              value={entity}
              label={entity[1].attributes.friendly_name}
              icon={<HomeIcon />} />
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
