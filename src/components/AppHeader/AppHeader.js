import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import pluralize from 'pluralize';
import { IndexLink } from 'react-router';
import { Menu, MenuItem } from 'react-toolbox/lib/menu';
import Avatar from 'react-toolbox/lib/avatar';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import FindBar from '../FindBar/FindBar';
import styles from './AppHeader.css';

export default class AppHeader extends React.Component {

  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    collections: ImmutablePropTypes.orderedMap.isRequired,
    commands: PropTypes.array.isRequired, // eslint-disable-line
    defaultCommands: PropTypes.array.isRequired, // eslint-disable-line
    runCommand: PropTypes.func.isRequired,
    toggleNavDrawer: PropTypes.func.isRequired,
    onCreateEntryClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
  };

  state = {
    createMenuActive: false,
    userMenuActive: false,
  };

  handleCreatePostClick = (collectionName) => {
    const { onCreateEntryClick } = this.props;
    if (onCreateEntryClick) {
      onCreateEntryClick(collectionName);
    }
  };

  handleCreateButtonClick = () => {
    this.setState({
      createMenuActive: true,
    });
  };

  handleCreateMenuHide = () => {
    this.setState({
      createMenuActive: false,
    });
  };

  handleRightIconClick = () => {
    this.setState({
      userMenuActive: !this.state.userMenuActive,
    });
  };

  render() {
    const {
      user,
      collections,
      commands,
      defaultCommands,
      runCommand,
      toggleNavDrawer,
      onLogoutClick,
    } = this.props;

    const {
      createMenuActive,
      userMenuActive,
    } = this.state;

    return (
      <AppBar
        fixed
        theme={styles}
        leftIcon="menu"
        rightIcon={
          <div>
            <Avatar
              title={user.get('name')}
              image={user.get('avatar_url')}
            />
            <Menu
              active={userMenuActive}
              position="topRight"
              onHide={this.handleRightIconClick}
            >
              <MenuItem onClick={onLogoutClick}>Log out</MenuItem>
            </Menu>
          </div>
        }
        onLeftIconClick={toggleNavDrawer}
        onRightIconClick={this.handleRightIconClick}
      >
        <IndexLink to="/">
          Dashboard
        </IndexLink>

        <FindBar
          commands={commands}
          defaultCommands={defaultCommands}
          runCommand={runCommand}
        />
        <Button
          icon="create"
          inverse
          mini
          floating
          onClick={this.handleCreateButtonClick}
        >
          <Menu
            active={createMenuActive}
            position="topRight"
            onHide={this.handleCreateMenuHide}
          >
            {
              collections.valueSeq().map(collection =>
                <MenuItem
                  key={collection.get('name')}
                  value={collection.get('name')}
                  onClick={this.handleCreatePostClick.bind(this, collection.get('name'))} // eslint-disable-line
                  caption={pluralize(collection.get('label'), 1)}
                />
              )
            }
          </Menu>
        </Button>
      </AppBar>
    );
  }
}
