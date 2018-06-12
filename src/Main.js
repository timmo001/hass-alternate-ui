import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StateCard from './StateCard';

const styles = theme => ({
  grid: {
    padding: theme.spacing.unit * 2,
    marginTop: 56,
  },
});

class Navigation extends React.Component {

  render() {
    const { classes, entities, handleChange } = this.props;

    return (
      <Grid
        container
        className={classes.grid}
        spacing={16}>
        {entities && entities.map(entity => {
          return (
            <Grid key={entity.name} item lg={3} md={4} sm={6} xs={12}>
              <StateCard entity={entity} handleChange={handleChange} />
            </Grid>
          )
        })}
      </Grid>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  page: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Navigation);
