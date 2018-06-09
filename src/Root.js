import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createConnection, subscribeEntities, subscribeConfig } from 'home-assistant-js-websocket';
import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './Login';
import Main from './Main';
import Navigation from './Navigation';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    margin: theme.spacing.unit,
  },
  flex: {
    flex: 1,
  },
  progress: {
    position: 'fixed',
    top: `calc(50% - 25px)`,
    left: `calc(50% - 25px)`,
  },
});

class Root extends Component {
  state = {
    // title: 'Home Assistant Alternate UI'
    snackMessage: { open: false, text: '' },
  };

  componentWillMount = () => {
    this.connectToHASS();
  };

  stateChanged = (event) => {
    console.log('state changed', event);
  };

  eventHandler = (connection, data) => {
    console.log('Connection has been established again');
  };

  connectToHASS = () => {
    if (localStorage.getItem('host')) {
      console.log('Connecting to HASS..');
      createConnection(`ws://${localStorage.getItem('host')}/api/websocket`, { authToken: sessionStorage.password })
        .then(conn => {
          console.log('Connection established!');
          conn.addEventListener('ready', this.eventHandler);

          subscribeEntities(conn, entities => {
            console.log('New entities!', entities);
            this.setState({ entities: Object.entries(entities) });
          });
          subscribeConfig(conn, config => {
            console.log('New config!', config);
            this.setState({ config });
          });
        }, err => {
          console.error('Connection failed with code', err);
          this.setState({ snackMessage: { open: true, text: 'Connection failed' }, entities: undefined });
          localStorage.setItem('host', '');
          sessionStorage.setItem('password', '');
        });
    }
  }

  handleClose = (event, reason) => {
    // if (reason === 'clickaway') return;
    this.setState({ snackMessage: { open: false, text: '' } });
  };

  render() {
    const { classes } = this.props;
    const { /*title,*/ entities, snackMessage } = this.state;

    return (
      <div className={classes.root}>
        {/* <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar> */}

        {entities ?
          <div>
            <Main entities={entities} />
            <Navigation entities={entities} />
          </div>
          : !localStorage.getItem('host') ?
            <Login login={this.connectToHASS} />
            :
            <CircularProgress className={classes.progress} size={50} />
        }

        <Snackbar
          open={snackMessage.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackMessage.text}</span>} />

      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Root);