import React from 'react';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '', 
            loginResponse: null
        };
    }

    handleLoginNameChange = (event) => {
        this.setState({ loginName: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();

        axios.post('/admin/login', { login_name: this.state.loginName })
            .then(response => {
                this.setState({ loginResponse: `Login successful for user: ${response.data.first_name} ${response.data.last_name}` });
            })
            .catch(error => {
                this.setState({ loginResponse: 'Login failed. Please try again.' });
                console.error('Login error:', error);
            });
    };

    render() {
        return (
            <div>
                <h1>Login/Register Component</h1>
                <form onSubmit={this.handleLogin}>
                    <label>
                        Login Name:
                        <input
                            type="text"
                            value={this.state.loginName}
                            onChange={this.handleLoginNameChange}
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
                {this.state.loginResponse && <p>{this.state.loginResponse}</p>}
            </div>
        );
    }
}

export default LoginRegister;
