import React from 'react';
import {
    Button,
    Box,
    TextField,
    Alert,
    Typography
} from '@mui/material';
import './loginRegister.css';
import axios from 'axios';

/**
 * Define LoginRegister, a React component for user login and registration
 */
class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                first_name: undefined,
                last_name: undefined,
                location: undefined,
                description: undefined,
                occupation: undefined,
                login_name: undefined,
                password: undefined,
                password_repeat: undefined,
            },
            showLoginError: false,
            showRegistration: false
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShowRegistration = this.handleShowRegistration.bind(this);
    }

    handleShowRegistration = () => {
        const showRegistration = this.state.showRegistration;
        this.setState({
            showRegistration: !showRegistration
        });
    };

    handleLogin = () => {
        const currentState = JSON.stringify(this.state.user);
        axios.post(
            "/admin/login",
            currentState,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) =>
            {
                const user = response.data;
                this.setState({
                    showLoginError: false,
                });
                this.props.changeUser(user);
            })
            .catch( error => {
                this.setState({
                    showLoginError: true,
                });
                console.log(error);
            });
    };

    handleRegister = () => {
        if (this.state.password !== this.state.password_repeat){
            return;
        }
        const currentState = JSON.stringify(this.state.user);
        axios.post(
            "/user/",
            currentState,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) =>
            {
                const user = response.data;
                this.setState({
                    showRegistration: false
                });
                this.props.changeUser(user);
            })
            .catch( error => {
                console.log(error);
            });
    };

    handleChange(event){
        this.setState((state) => {state.user[event.target.id] = event.target.value;});
    }
    componentDidMount() {
        //this.handleAppInfoChange();
    }
    render() {
        return this.state.user ? (
            <div className="login-register-container">
                <div className="login-box">
                    <Typography>Login</Typography>
                    <Box component="form" autoComplete="off">
                        {this.state.showLoginError && <Alert severity="error">Login Failed</Alert>}
                        <div>
                            <TextField id="login_name" label="Login Name" variant="outlined" fullWidth
                                       margin="normal" required={true} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="password" label="Password" variant="outlined" fullWidth
                                       margin="normal" type="password" required={true} onChange={this.handleChange}/>
                        </div>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" onClick={this.handleLogin}>
                                Login
                            </Button>
                        </Box>
                    </Box>
                </div>
                <div className="register-box">
                    <Typography>User Registration</Typography>
                    <Box>
                        <div>
                            <TextField id="register_login_name" label="Login Name" variant="outlined" fullWidth
                                       margin="normal" required={this.state.showRegistration} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="register_password" label="Password" variant="outlined" fullWidth
                                       margin="normal" type="password" required={this.state.showRegistration} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="password_repeat" label="Repeat Password" variant="outlined" fullWidth
                                       margin="normal" type="password" required={this.state.showRegistration} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="first_name" label="First Name" variant="outlined" fullWidth
                                       margin="normal" autoComplete="off" required={this.state.showRegistration} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="last_name" label="Last Name" variant="outlined" fullWidth
                                       margin="normal" required={this.state.showRegistration} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="location" label="Location" variant="outlined" fullWidth
                                       margin="normal" onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="description" label="Description" variant="outlined" multiline rows={4}
                                       fullWidth margin="normal" onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="occupation" label="Occupation" variant="outlined" fullWidth
                                       margin="normal" onChange={this.handleChange}/>
                        </div>
                        <div>
                            <Button variant="contained" onClick={this.handleRegister}>
                                Register Me
                            </Button>
                        </div>
                    </Box>
                </div>
            </div>
        ) : (
            <div/>
        );
    }
}

export default LoginRegister;
