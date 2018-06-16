import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Logo from './logo.svg';

const styles = theme => ({
  grid: {
    position: 'fixed',
    height: '100%',
  },
  media: {
    height: 240,
    backgroundSize: 'contain',
  },
  fill: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  fakeButton: {
    width: 256,
  },
});

class Login extends React.Component {
  state = {
    host: '',
    password: '',
    showPassword: false,
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogIn();
    }
  };

  handleLogIn = () => {
    if (this.state.host) {
      console.log('Log In');
      localStorage.setItem('host', this.state.host);
      sessionStorage.setItem('password', this.state.password);
      this.props.login();
    }
  };

  render() {
    const { classes } = this.props;
    const { host, password, showPassword } = this.state;

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Card className={classes.card}>
            <CardContent >
              <CardMedia
                className={classes.media}
                image={Logo}
                title="Logo" />
            </CardContent>
            <CardContent align="center">
              <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                <InputLabel htmlFor="host">Home Assistant Host</InputLabel>
                <Input
                  id="host"
                  type="text"
                  value={host}
                  onChange={this.handleChange('host')}
                  onKeyPress={this.handleKeyPress} />
              </FormControl>
              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={this.handleChange('password')}
                  onKeyPress={this.handleKeyPress}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  } />
              </FormControl>
            </CardContent>
            <CardActions>
              <div className={classes.fill} />
              <Button onClick={this.handleLogIn}>Log In</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
