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
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";

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
                register_login_name: undefined,
                register_password: undefined,
                password_repeat: undefined,
            },
            loginName: '',
            password: '', // Added password state for login
            message: null
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShowRegistration = this.handleShowRegistration.bind(this);
        this.handleLoginNameChange = this.handleLoginNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this); // Binding the new method
    }

    handleShowRegistration = () => {
        this.setState({
            showRegistrationError: false,
            showRequiredFieldsWarning: false,
        });
    };

    handleLoginNameChange = (event) => {
        this.setState({ loginName: event.target.value });
    };

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();
        const { loginName, password } = this.state; // Destructure for easier access

        axios.post('/admin/login', { login_name: loginName, password: password })
            .then(response => {
                this.props.setUserLoggedIn(true);
                this.props.setTopName(`Hi ${response.data.first_name}`);
            })
            .catch(error => {
                this.setState({ message: 'Login failed. Please try again.' });
                console.error('Login error:', error);
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

        const { user } = this.state;
        const currentState = {
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation,
            register_login_name: user.register_login_name,
            register_password: user.register_password,
            password_repeat: user.password_repeat,
        };

        axios.post("/user/", currentState, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
            if (response && response.data) {
                const rUser = response.data;
                this.setState({
                    showRegistrationSuccess: true,
                    showRegistrationError: false,
                    showRequiredFieldsWarning: false,
                });
                // Assuming you handle user redirection or state update upon successful registration
                window.location.href = `#/users/${rUser._id}`;
            } else {
                console.error('Unexpected response format:', response);
            }
        })
        .catch(error => {
            this.setState({
                showRegistrationError: true,
                showRegistrationSuccess: false,
                showRequiredFieldsWarning: false,
            });
            console.error('Error during registration:', error);
        });
    };

    handleChange(event) {
        const {id, value} = event.target;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [id]: value
            }
        }));
    }

    render() {
        return (
            <div className="login-register-container">
                <div className='wrapper'>
                    <form>
                        <h1>Login</h1>
                        <div className='input-box'>
                            <input type='text'
                                value={this.state.loginName}
                                onChange={this.handleLoginNameChange}
                                placeholder='Username' 
                                required
                            />
                            <FaRegUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type='password'
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                placeholder='Password' 
                                required
                            />
                            <FaUnlockAlt className='icon'/>
                        </div>
                        <div className='message-div'>
                                {this.state.message && <p className='message'>{this.state.message}</p>}
                        </div>
                        <Button 
                                type='button'
                                onClick={this.handleLogin}
                        >
                            Login
                        </Button>
                    </form>
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
        );
    }
}

export default LoginRegister;
