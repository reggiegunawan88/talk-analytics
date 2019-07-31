import React, { PureComponent } from 'react';

class Footer extends PureComponent {
  render() {
    return (
      <div className="container-fluid container-fixed-lg footer">
        <div className="copyright sm-text-center">
          <p className="small no-margin pull-left sm-pull-reset">
            <span className="hint-text">Copyright © 2017</span>
            <span className="font-montserrat"> TALKABOT</span>.
            <span className="hint-text"> All rights reserved.</span>
            <span className="sm-block">
              <a className="m-l-10 m-r-10">Terms of use</a>
              &nbsp;|&nbsp;
              <a className="m-l-10"> Privacy Policy</a>
            </span>
          </p>
          <p className="small no-margin pull-right sm-pull-reset">
            <a>Hand-crafted </a>
            <span className="hint-text">&amp; Made with Love ®</span>
          </p>
          <div className="clearfix" />
        </div>
      </div>
    );
  }
}

export default Footer;
