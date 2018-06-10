import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import '@mdi/font/css/materialdesignicons.min.css';

const styles = theme => ({
  card: {},
  item: {
    display: 'inline-flex',
    width: '100%',
    padding: '10px 8px',
  },
  icon: {
    margin: '0 14px 0 0',
    fontSize: 22,
  },
  label: {
    flexGrow: 1,
    verticalAlign: 'middle',
  },
});

class StateCard extends React.Component {
  render() {
    const { classes, entity } = this.props;
    console.log('entity:', entity);

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
              <div key={item[0]} className={classes.item}>
                {item[1].attributes.icon &&
                  <i className={classNames('mdi', item[1].attributes.icon.replace(':', '-'), classes.icon)} />
                }
                <Typography className={classes.label} component="span">
                  {item[1].attributes.friendly_name}
                </Typography>
              </div>
            )
          })}
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
  entity: PropTypes.object.isRequired,
};

export default withStyles(styles)(StateCard);
