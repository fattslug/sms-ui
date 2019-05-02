import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

export class Navbar extends React.Component {
  public render() {
    return(
      <nav>
        <Link to="/month">
          <div className="nav-logo">SMS Analyzer</div>
        </Link>
        <ul>
          <li>
            <Link to="/month">By Day of Month</Link>
          </li>
          <li>
            <Link to="/year">By Month of Year</Link>
          </li>
          <li>
            <Link to="/decade">By Year Over Year</Link>
          </li>
        </ul>
      </nav>
    );
  }
}