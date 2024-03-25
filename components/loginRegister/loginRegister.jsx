import React from 'react';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '', 
            message: null
        };
    }

    handleLoginNameChange = (event) => {
        this.setState({ loginName: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();

        axios.post('/admin/login', { login_name: this.state.loginName })
            .then(response => {
                this.setState({ message: `Login successful for user: ${response.data.first_name} ${response.data.last_name}` });
                this.props.setUserLoggedIn(true);
            })
            .catch(error => {
                this.setState({ message: 'Login failed. Please try again.' });
                console.error('Login error:', error);
            });
    };

    handleLogout = () => {
        axios.post('/admin/logout')
            .then(response => {
                this.setState({ message: response.data });
            })
            .catch(error => {
                this.setState({ message: 'Logout failed' });
                console.error('Logout error:', error);
            });
    };

    checkClicked = () => {
        axios.get('/check-login')
            .then(response => {
                if (response.data.loggedIn) {
                    this.setState({ message: `User ${response.data.user.login_name} is logged in` });
                } else {
                    this.setState({ message: 'No user is logged in' });
                }
            })
            .catch(error => {
                console.error('Check login error:', error);
            });
    };

    render() {
        return (
            <div>
                <h1>Login/Register Component</h1>
                <label>
                    Login Name:
                    <input
                        type="text"
                        value={this.state.loginName}
                        onChange={this.handleLoginNameChange}
                    />
                </label>

                <button onClick={this.handleLogin}>Login</button>
                <button onClick={this.handleLogout}>Logout</button>
                <button onClick={this.checkClicked}>Check</button>
                {this.state.message && <p>{this.state.message}</p>}
            </div>
        );
    }
}

export default LoginRegister;
