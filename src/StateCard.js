import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import StateEntity from './StateEntity';

const styles = theme => ({
  card: {
    backgroundColor: theme.palette.background[50],
  },
  heading: {
    display: 'inline-flex',
    width: '100%',
    marginBottom: 8,
  },
  label: {
    lineHeight: '32px',
    paddingTop: 8,
    flexGrow: 1,
  },
});

class StateCard extends React.Component {

  render() {
    const { classes, entity, handleChange } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.heading}>
            <Typography className={classes.label} variant="headline" component="h2">
              {entity.friendly_name}
            </Typography>
            {entity.state !== 'unknown' && entity.items.length > 1 &&
              <Switch
                value="on"
                checked={entity.state === 'on'}
                onChange={event => handleChange('homeassistant', event.target.checked, { entity_id: entity.name })} />
            }
          </div>
          {/* <Typography className={classes.pos} color="textSecondary">
            Subheading
          </Typography> */}
          {entity.items.map(item => {
            return (
              <StateEntity key={item[0]} entity={item} handleChange={handleChange} />
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
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(StateCard);
