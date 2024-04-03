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
                register_login_name: undefined,
                register_password: undefined,
                password_repeat: undefined,
            },
            showLoginError: false,
            showRegistrationError: false,
            showRegistrationSuccess: false,
            showRequiredFieldsWarning: false,
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShowRegistration = this.handleShowRegistration.bind(this);
    }

    handleShowRegistration = () => {
        this.setState({
            showRegistrationError: false,
            showRequiredFieldsWarning: false,
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
                console.log(user);
                this.props.changeUser(user);
                this.setState({
                    showLoginError: false,
                    showRegistrationSuccess: false,
                    showRegistrationError: false,
                });
            })
            .catch( error => {
                this.setState({
                    showLoginError: true,
                    showRegistrationSuccess: false,
                    showRegistrationError: false,
                });
                console.log(error);
            });
    };

    handleRegister = () => {
        if (this.state.user.register_password !== this.state.user.password_repeat){
            this.setState({
                showRegistrationError: true,
                showRequiredFieldsWarning: false,
            });
            return;
        }
        //const currentState = JSON.stringify(this.state.user);

        const currentState = {
            first_name: this.state.user.first_name,
            last_name: this.state.user.last_name,
            location: this.state.user.location,
            description: this.state.user.description,
            occupation: this.state.user.occupation,
            register_login_name: this.state.user.register_login_name,
            register_password: this.state.user.password,
            password_repeat: this.state.user.password_repeat,
        };

        axios.post(
            "/user/",
            currentState,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) =>
            {
                const user = response.data;
                this.setState({
                    showRegistrationSuccess: true,
                    showRegistrationError: false,
                    showLoginError: false,
                    showRequiredFieldsWarning: false,

                });
                this.props.changeUser(user);
                window.location.href = `#/users/${user._id}`;
            })
            .catch( error => {
                this.setState({
                    showRegistrationError: true,
                    showLoginError: false,
                    showRegistrationSuccess: false,
                    showRequiredFieldsWarning: false,
                });
                console.log(error.response.data);
            });
    };

    handleChange(event){
        const {id, value} = event.target;
        this.setState((prevState) => ({
            user:{
                ...prevState.user,
                [id]: value
            }
        })
        );
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
                    <Box component="form" autoComplete="off">
                        
                        
                        <div>
                            <TextField id="register_login_name" label="Login Name" variant="outlined" fullWidth
                                       margin="normal" required={true} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="register_password" label="Password" variant="outlined" fullWidth
                                       margin="normal" type="password" required={true} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="password_repeat" label="Repeat Password" variant="outlined" fullWidth
                                       margin="normal" type="password" required={true} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="first_name" label="First Name" variant="outlined" fullWidth
                                       margin="normal" autoComplete="off" required={true} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <TextField id="last_name" label="Last Name" variant="outlined" fullWidth
                                       margin="normal" required={true} onChange={this.handleChange}/>
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
                        {this.state.showRequiredFieldsWarning && <Alert severity = "warning">Please fill in all required fields.</Alert>}
                        {this.state.showRegistrationSuccess && <Alert severity="success">Registration Succeeded</Alert>}
                        {this.state.showRegistrationError && <Alert severity="error">Registration Failed</Alert>}
                    </Box>
                </div>
            </div>
        ) : (
            <div/>
        );
    }
}

export default LoginRegister;
