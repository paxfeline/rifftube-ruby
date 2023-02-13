import React from 'react';
import { connect } from 'react-redux';
import { attemptLogin } from '../../actions/index.js';

const Login = ({ attemptLogin /*, videoID */ }) => {
  const email_ref = React.createRef();
  const pwd_ref = React.createRef();
  return (
    <React.Fragment>
      <div class="form-group">
        <label for="session_email">Email</label><br/>
        <input class="form-control" type="email" name="session[email]" id="session_email" ref={email_ref} />
      </div>
      <div class="form-group">
        <label for="session_password">Password</label><br/>
        <input class="form-control" type="password" name="session[password]" id="session_password" ref={pwd_ref} />
      </div>
      <button onClick={() => {console.log(email_ref); debugger;
      attemptLogin(email_ref.current.value, pwd_ref.current.value);
      }}>login</button>
    </React.Fragment>
  );};

const mapStateToProps = (state) => ({
  //videoID: state.videoID,
});

const mapDispatchToProps = {
  attemptLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
