import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StateCard from './StateCard';

const styles = theme => ({});

class Navigation extends React.Component {
  state = {};

  render() {
    const { /*classes,*/ entities } = this.props;

    return (
      <Grid
        container
        spacing={24}>
        {entities.filter(entity => {
          return entity[0].startsWith('group.') && entity[1].attributes.view
        }).map(entity => {
          return (
            <Grid key={entity[1].attributes.order} item xs>
              <StateCard entities={entity[1].attributes.entity_id} />
            </Grid>
          )
        })
        }
      </Grid>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
};

export default withStyles(styles)(Navigation);
