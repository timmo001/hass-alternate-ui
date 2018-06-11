import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import StateEntity from './StateEntity';

const styles = theme => ({
  card: {
    backgroundColor: theme.palette.background[50],
  },
});

class StateCard extends React.Component {

  render() {
    const { classes, entity } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {entity.friendly_name}
          </Typography>
          {/* <Typography className={classes.pos} color="textSecondary">
            Subheading
          </Typography> */}
          {entity.items.map(item => {
            return (
              <StateEntity key={item[0]} entity={item} />
            )
          })}
        </CardContent>
      </Card>
    );
  }
}

StateCard.propTypes = {
  classes: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
};

export default withStyles(styles)(StateCard);
