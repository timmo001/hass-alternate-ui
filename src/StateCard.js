import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  card: {},
});

class StateCard extends React.Component {
  render() {
    const { classes, entities } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            Heading
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Subheading
          </Typography>
          <Typography component="p">
            Content
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
  }
}

StateCard.propTypes = {
  classes: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
};

export default withStyles(styles)(StateCard);
