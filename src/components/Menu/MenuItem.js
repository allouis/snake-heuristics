import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class MenuItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { active, children } = this.props;
    const classes = classnames('sh-menu__item', {
      'sh-menu__item--active': active,
      'sh-menu__item--activatable': active !== undefined,
    });

    return (
      <div className={ classes }>
        { children }
      </div>
    );
  }
}
