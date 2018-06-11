import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  card: {
    backgroundColor: theme.palette.background[50],
  },
  item: {
    display: 'inline-flex',
    width: '100%',
  },
  icon: {
    margin: '0 14px 0 0',
    lineHeight: '32px',
    paddingTop: 8,
  },
  label: {
    lineHeight: '32px',
    paddingTop: 8,
  },
  flexGrow: {
    flexGrow: 1,
  },
});

class StateCard extends React.Component {
  state = {
    on: this.props.entity.state === 'on'
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  getDefaultIcon = domain => {
    switch (domain) {
      case 'alarm_control_panel':
        return 'mdi-alarm-light';
      case 'binary_sensor':
        return 'mdi-';
      case 'camera':
        return 'mdi-camera';
      case 'device_tracker':
        return 'mdi-tablet-cellphone';
      case 'fan':
        return 'mdi-air-conditioner';
      case 'group':
        return 'mdi-group';
      case 'light':
        return 'mdi-lightbulb';
      case 'lock':
        return 'mdi-lock';
      case 'media-player':
        return 'mdi-play-circle';
      case 'switch':
        return 'mdi-light-switch';
      case 'sensor':
        return 'mdi-access-point';
      case 'sun':
        return 'mdi-white-balance-sunny';
      case 'input_number':
        return 'mdi-ray-vertex';
      case 'scene':
        return 'mdi-image-filter-hdr';
      case 'script':
        return 'mdi-script';
      default:
        return 'mdi-help'
    }
  };

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
            const domain = item[0].substring(0, item[0].indexOf('.'));
            return (
              <div key={item[0]} className={classes.item}>
                <i className={classNames('mdi',
                  'mdi-24px',
                  item[1].attributes.icon ?
                    item[1].attributes.icon.replace(':', '-')
                    : this.getDefaultIcon(domain),
                  classes.icon)} />
                <Typography className={classes.label} component="span">
                  {item[1].attributes.friendly_name}
                </Typography>
                <div className={classes.flexGrow} />
                {domain === 'switch' | domain === 'light' ?
                  <Switch
                    checked={this.state.on}
                    onChange={this.handleChange('on')}
                    value="on" />
                  : domain === 'scene' | domain === 'script' ?
                    <Button color="secondary" onClick={this.handleActivate}>Activate</Button>
                    :
                    <Typography className={classes.label} component="span">
                      {item[1].state}
                    </Typography>
                }
              </div>
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
