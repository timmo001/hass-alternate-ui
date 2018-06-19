import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { createConnection, subscribeEntities } from 'home-assistant-js-websocket';
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
    position: 'absolute',
    paddingBottom: 8,
    minHeight: '100%',
    minWidth: '100%',
    backgroundColor: theme.palette.mainBackground,
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
      createConnection(`wss://${localStorage.getItem('host')}/api/websocket?latest`, { authToken: sessionStorage.getItem('password') })
        .then(conn => {
          conn.removeEventListener('ready', this.eventHandler);
          conn.addEventListener('ready', this.eventHandler);
          subscribeEntities(conn, this.updateEntities);
        }, err => {
          console.error('Connection failed with code', err);
          this.setState({ snackMessage: { open: true, text: 'Connection failed' }, entities: undefined });
          localStorage.setItem('host', '');
          sessionStorage.setItem('password', '');
        });
    }
  }

  handleChange = (domain, state, data = undefined) => {
    createConnection(`wss://${localStorage.getItem('host')}/api/websocket?latest`, { authToken: sessionStorage.getItem('password') })
      .then(conn => {
        conn.callService(domain, state ? 'turn_on' : 'turn_off', data).then(v => {
          this.setState({ snackMessage: { open: true, text: 'Changed.' } });
          setTimeout(() => this.connectToHASS(), 2000);
        });
      }, err => {
        console.error('Connection failed with code', err);
        this.setState({ snackMessage: { open: true, text: 'Connection failed' }, entities: undefined });
        localStorage.setItem('host', '');
        sessionStorage.setItem('password', '');
      });
  };

  updateEntities = entities => {
    const allEntities = Object.entries(entities);
    const page = allEntities.find(entity => {
      return entity[0] === this.props.match.params.entity_id
    });

    // Pages
    const pages = allEntities.filter(entity => {
      return entity[0].startsWith('group.') && entity[1].attributes.view
    });

    this.setState({ allEntities, pages, page }, () => this.getEntities());
  };

  getEntities = () => {
    // Get groups and entites
    const groups = this.state.allEntities.filter(thePage => {
      return this.state.page[1].attributes.entity_id.indexOf(thePage[0]) > -1
    });
    // console.log('groups:', groups);
    const entitiesItemsArr = [];
    groups.map(group => {
      const items = this.state.allEntities.filter(entity => {
        return group[1].attributes.entity_id.indexOf(entity[0]) > -1
      });
      return entitiesItemsArr.push({
        name: group[0],
        friendly_name: group[1].attributes.friendly_name,
        order: group[1].attributes.order,
        state: group[1].state,
        items,
      });
    });
    entitiesItemsArr.sort((a, b) => a.order > b.order);
    // console.log('entitiesItemsArr:', entitiesItemsArr);
    this.setState({ entities: entitiesItemsArr });

    this.setTheme();
  };

  setTheme = (themeId = undefined) => {
    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0)
      themeId = -1;
    if (themeId === -1) {
      // theme from sunlight
      const sun = this.state.allEntities.find(entity => {
        return entity[0] === 'sun.sun'
      });
      if (sun)
        this.props.setTheme(sun[1].state === 'below_horizon' ? 1 : 0);
      else
        this.props.setTheme(0);
    } else
      this.props.setTheme(themeId);
    localStorage.setItem('theme', themeId);
  };

  handleClose = (event, reason) => {
    // if (reason === 'clickaway') return;
    this.setState({ snackMessage: { open: false, text: '' } });
  };

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getEntities(this.state.allEntities, page);
    });
  };

  render() {
    const { classes } = this.props;
    const { /*title,*/snackMessage, entities, page, pages } = this.state;

    return (
      <div className={classes.root}>
        {/* <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar> */}

        {entities && pages ?
          <Main
            entities={entities}
            page={page}
            handleChange={this.handleChange} />
          : !localStorage.getItem('host') ?
            <Login login={this.connectToHASS} />
            :
            <CircularProgress className={classes.progress} size={50} />
        }

        {pages && page &&
          <Navigation
            pages={pages}
            page={page}
            theme={Number(localStorage.getItem('theme'))}
            setTheme={this.setTheme}
            handlePageChange={this.handlePageChange} />
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

export default withStyles(styles)(withRouter(Root));
