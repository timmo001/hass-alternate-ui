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

  componentWillMount = () => {
    this.handleGetEntities();
  };

  handleGetEntities = () => {
    const groups = this.props.entities.filter(page => {
      return this.props.page[1].attributes.entity_id.indexOf(page[0]) > -1
    });
    console.log('groups:', groups);

    const entities = [];
    groups.map(group => {
      const items = this.props.entities.filter(entity => {
        return group[1].attributes.entity_id.indexOf(entity[0]) > -1
      });
      return entities.push({
        name: group[0],
        friendly_name: group[1].attributes.friendly_name,
        order: group[1].attributes.order,
        items,
      });
    });

    entities.sort((a, b) => a.order > b.order);

    console.log('entities:', entities);
    this.setState({ entities });
  };

  render() {
    const { classes } = this.props;
    const { entities } = this.state;

    return (
      <Grid
        container
        className={classes.grid}
        spacing={16}>
        {entities && entities.map(entity => {
          return (
            <Grid key={entity.order} item lg={3} md={4} sm={6} xs={12}>
              <StateCard entity={entity} />
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
};

export default withStyles(styles)(Navigation);
