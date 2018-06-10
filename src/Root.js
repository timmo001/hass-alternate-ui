import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
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
    position: 'absolute',
    paddingBottom: 8,
    minHeight: '100%',
    backgroundColor: theme.palette.background[200],
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
            // console.log('New entities!', entities);
            const allEntities = Object.entries(entities);
            const page = allEntities.find(entity => {
              return entity[0] === this.props.match.params.entity_id
            });

            // Pages
            const pages = allEntities.filter(entity => {
              return entity[0].startsWith('group.') && entity[1].attributes.view && entity[0] !== 'group.default_view'
            });

            this.setState({ allEntities, pages, page });

            this.getEntities();
          });
          subscribeConfig(conn, config => {
            // console.log('New config!', config);
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
        items,
      });
    });
    entitiesItemsArr.sort((a, b) => a.order > b.order);
    // console.log('entitiesItemsArr:', entitiesItemsArr);
    this.setState({ entities: entitiesItemsArr });

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
            page={page} />
          : !localStorage.getItem('host') ?
            <Login login={this.connectToHASS} />
            :
            <CircularProgress className={classes.progress} size={50} />
        }

        {pages && page &&
          <Navigation
            pages={pages}
            page={page}
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