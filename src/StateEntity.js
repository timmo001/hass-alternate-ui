import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import TextField from '@material-ui/core/TextField';

var timeoutVar;

const styles = theme => ({
  entity: {
    display: 'inline-flex',
    width: '100%',
  },
  icon: {
    margin: '0 14px 0 0',
    lineHeight: '32px',
    marginTop: 8,
  },
  label: {
    lineHeight: '32px',
    marginTop: 8,
  },
  state: {
    lineHeight: '32px',
    marginTop: 8,
    marginRight: 16,
  },
  flexGrow: {
    flexGrow: 1,
  },
  attributes: {
    display: 'inline-flex',
    width: 'calc(100% - 48px)',
    paddingLeft: 24,
    paddingRight: 24,
  },
  attributeIcon: {
    margin: '0 14px 0 0',
    lineHeight: '32px',
    marginTop: 8,
  },
  attributeState: {
    width: 72,
    marginTop: 18,
    marginLeft: 16,
    marginRight: 16,
  },
  container: {
    width: '100%',
  },
});

class StateEntity extends React.Component {

  componentWillMount = () => this.setState({ entity: this.props.entity });

  componentWillUpdate = (newProps) => {
    if (newProps.entity !== this.props.entity)
      this.setState({ entity: newProps.entity });
  };

  componentWillUnmount = () => {
    clearTimeout(timeoutVar);
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

  handleChange = (domain, state, data = undefined, delay = 0) => {
    const entity = this.state.entity;
    entity[1].state = state ? 'on' : 'off';
    if (data.brightness) entity[1].attributes.brightness = data.brightness;
    this.setState({ entity }, () => {
      clearTimeout(timeoutVar);
      timeoutVar = setTimeout(() => {
        this.props.handleChange(domain, state, data);
      }, delay);
    });
  };

  render() {
    const { classes } = this.props;
    const { entity } = this.state;
    const domain = entity[0].substring(0, entity[0].indexOf('.'));

    return (
      <div>
        <div className={classes.entity}>
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
          {domain === 'switch' || domain === 'light' ?
            <Switch
              value="on"
              checked={entity[1].state === 'on'}
              onChange={event => this.handleChange(domain, event.target.checked, { entity_id: entity[0] })} />
            : domain === 'scene' | domain === 'script' ?
              <Button color="secondary" onClick={() => this.handleChange(domain, true, { entity_id: entity[0] })}>
                Activate
              </Button>
              :
              <Typography className={classes.state} component="span">
                {entity[1].state}
              </Typography>
          }
        </div>
        {domain === 'light' && entity[1].state === 'on' &&
          <div>
            {entity[1].attributes.brightness &&
              <div className={classes.attributes}>
                <i className={classNames('mdi', 'mdi-24px', 'mdi-brightness-6', classes.attributeIcon)} />
                <div className={classes.container}>
                  <Typography id="brightness">Brightness</Typography>
                  <Slider
                    value={entity[1].attributes.brightness}
                    min={1}
                    max={255}
                    step={1}
                    aria-labelledby="brightness"
                    onChange={(event, value) => {
                      this.handleChange(domain, true, {
                        entity_id: entity[0],
                        brightness: value
                      }, 200);
                    }} />
                </div>
                <TextField
                  id="brightness"
                  type="number"
                  inputProps={{
                    max: 255,
                  }}
                  className={classes.attributeState}
                  value={entity[1].attributes.brightness}
                  onChange={event => {
                    this.handleChange(domain, true, {
                      entity_id: entity[0],
                      brightness: Number(event.target.value)
                    }, 500)
                  }} />
              </div>
            }
          </div>
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
