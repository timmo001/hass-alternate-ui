import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  entity: {
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

class StateEntity extends React.Component {

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
    const { classes, entity, handleChange } = this.props;
    const domain = entity[0].substring(0, entity[0].indexOf('.'));

    return (
      <div key={entity[0]} className={classes.entity}>
        <i className={classNames('mdi',
          'mdi-24px',
          entity[1].attributes.icon ?
            entity[1].attributes.icon.replace(':', '-')
            : this.getDefaultIcon(domain),
          classes.icon)} />
        <Typography className={classes.label} component="span">
          {entity[1].attributes.friendly_name}
        </Typography>
        <div className={classes.flexGrow} />
        {domain === 'switch' | domain === 'light' ?
          <Switch
            checked={entity[1].state === 'on'}
            onChange={() => handleChange(domain, !entity[1].state === 'on')}
            value="on" />
          : domain === 'scene' | domain === 'script' ?
            <Button color="secondary" onClick={() => handleChange(domain, true)}>
              Activate
            </Button>
            :
            <Typography className={classes.label} component="span">
              {entity[1].state}
            </Typography>
        }
      </div>
    );
  }
}

StateEntity.propTypes = {
  classes: PropTypes.object.isRequired,
  entity: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(StateEntity);
