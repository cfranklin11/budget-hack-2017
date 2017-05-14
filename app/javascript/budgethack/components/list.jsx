import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class List extends Component {
  render () {
    return (
      <div className="list-wrapper">
        <ul className="list">
          { this.props.items.map(
            (item, i) =>
              <li className="list__item" key={i} >
                <Link to="/programs">{ item.name }</Link>
              </li>,
            )
          }
        </ul>
      </div>

    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

List.defaultProps = {
  items: [],
};
