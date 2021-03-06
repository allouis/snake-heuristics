import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { auth, database } from 'firebase';
import { applicationShowSavedSolutions } from '../store/application';
import {
  notifierAddErrorNotification,
  notifierAddSuccessNotification,
} from '../store/notifier';
import { userLoginSuccessful } from '../store/user';
import Link from '../components/Link/Link';

const provider = new auth.GithubAuthProvider();

class GithubAuthenticationLink extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    displayName: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isSavedSolutionsActive: PropTypes.bool.isRequired,
    onErrorNotification: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onShowSavedSolutions: PropTypes.func.isRequired,
    onSuccessNotification: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      authenticating: false,
    };
  }

  handleOnClick() {
    const { authenticating } = this.state;
    const { onLogin, onErrorNotification, onSuccessNotification } = this.props;

    if (authenticating) {
      return;
    }

    this.setState({ authenticating: true });
    auth().signInWithPopup(provider).then((result) =>
      database()
        .ref(`users/${result.user.uid}`)
        .update({
          avatar: result.user.photoURL,
          displayName: result.user.displayName,
        }).then(() => {
          onLogin({
            id: result.user.uid,
            avatar: result.user.photoURL,
            displayName: result.user.displayName,
          });
          onSuccessNotification(`You are now signed in with GitHub.
            Get yourself up on the Leaderboard!`);
        })
    ).catch((error) => {
      this.setState({ authenticating: false });
      onErrorNotification(`GitHub signin failed: ${error}`);
    });
  }

  render() {
    return (
      <Link onClick={ () => this.handleOnClick() }>
        Sign in with Github
      </Link>
    );
  }
}

export default connect((state) => ({
  avatar: state.user.avatar,
  displayName: state.user.displayName,
  isLoggedIn: !!state.user.id,
  isSavedSolutionsActive: state.application.savedSolutions,
}), {
  onErrorNotification: notifierAddErrorNotification,
  onLogin: userLoginSuccessful,
  onShowSavedSolutions: applicationShowSavedSolutions,
  onSuccessNotification: notifierAddSuccessNotification,
})(GithubAuthenticationLink);
