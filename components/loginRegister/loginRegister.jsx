import React from 'react';
import {
    Button,
    Box,
    TextField,
    Alert, Typography
} from '@mui/material';
import './loginRegister.css';
import axios from 'axios';
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.initialUserState = {
            first_name: '',
            last_name: '',
            location: '',
            description: '',
            occupation: '',
            register_login_name: '',
            register_password: '',
            password_repeat: '',
        };

        this.state = {
            user: {...this.initialUserState},
            loginName: '',
            password: '',
            message: null
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShowRegistration = this.handleShowRegistration.bind(this);
        this.handleLoginNameChange = this.handleLoginNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this); 
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
        const { loginName, password } = this.state; 

        axios.post('/admin/login', { login_name: loginName, password: password })
            .then(response => {
                this.props.setUserLoggedIn(true, response.data._id);
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
                this.resetRegistrationForm(); 
                // const rUser = response.data;
                this.setState({
                    showRegistrationSuccess: true,
                    showRegistrationError: false,
                    showRequiredFieldsWarning: false,
                });
                // window.location.href = `/users/${rUser._id}`;
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

    resetRegistrationForm() {
        this.setState({ user: {...this.initialUserState} });
    }

    handleChange(event) {
        const {id, value} = event.target;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [id]: value
            }
        }));
    }

    // const [action, setAction] = useState('');

    // const registerLink = () => {
    //     setAction(' active');
    // };

    // const loginLink = () => {
    //     setAction('');
    // };

    render() {
        return (
            <div className="login-register-container">
                <div className='wrapper'>
                    <form>
                    <Typography variant="h4" style={{textAlign: 'center', color: 'Black'}}>Login</Typography>
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
                        {/* <div className="register-link">
                            <p>Don't have a account? <a href="#" onClick={registerLink}>Register</a> </p>
                        </div> */}
                    </form>
                </div> 



                <div className="register-box">
                    
                    <Typography variant="h4" style={{textAlign: 'center', color: 'Black'}}>User Registration</Typography>
                    <Box component="form" autoComplete="off">
                        <div>
                            <TextField 
                                id="register_login_name"
                                label="Login Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={this.state.user.register_login_name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="register_password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                required
                                value={this.state.user.register_password}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="password_repeat"
                                label="Repeat Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                required
                                value={this.state.user.password_repeat}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="first_name"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                                required
                                value={this.state.user.first_name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="last_name"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={this.state.user.last_name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="location"
                                label="Location"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={this.state.user.location}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="description"
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                margin="normal"
                                value={this.state.user.description}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <TextField 
                                id="occupation"
                                label="Occupation"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={this.state.user.occupation}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <Button variant="contained" onClick={this.handleRegister}>
                                Register Me
                            </Button>
                        </div>

                        {this.state.showRequiredFieldsWarning && <Alert severity="warning">Please fill in all required fields.</Alert>}
                        {this.state.showRegistrationSuccess && <Alert severity="success">Registration Succeeded</Alert>}
                        {this.state.showRegistrationError && <Alert severity="error">Registration Failed</Alert>}
                    </Box>

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default LoginRegister;
