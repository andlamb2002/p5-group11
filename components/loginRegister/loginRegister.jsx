import React from 'react';
import axios from 'axios';
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
import { Grid, Typography, Input, TextField } from "@mui/material";
import './loginRegister.css';


class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failedLogin: "",
            login_attempt: "malcolm",    //change to blank later
            password_attempt: "",
            register_name_attempt: "",
            register_password_attempt: "",
            occupation: "",
            password_verify_attempt: "",
            location: "",
            description: "",
            failedRegister: "",
            first_name: "",
            last_name: "",
            user: null, // Initialize user to null
            message: null
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleLoginNameChange = (event) => {
        this.setState({ login_attempt: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();

        axios.post('/admin/login', { login_name: this.state.login_attempt , password: this.state.password_attempt})
            .then(response => {
                let user = response.data;
                console.log(user);
                this.props.setUserLoggedIn(true);
                this.props.setTopName(`Hi ${response.data.first_name}`);
                this.setState({ failedLogin: "", user}); //update user details in the state
            })
            .catch(error => {
                this.setState({ message: 'Login failed. Please try again.' });
                console.error('Login error:', error);
            });
    };

    handleLogout = () => {
        axios.post('/admin/logout')
            .then(() => {
                this.props.setUserLoggedIn(false);
                this.props.setTopName('Please Login');
                this.setState({ user: null });
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    handleRegister = (event) => {
        event.preventDefault();

        if(this.state.register_password_attempt !== this.state.password_verify_attempt){
            this.setState({ message: 'Password do not match' , failedRegister: "Passwords don't match" });
            return;
        }

        axios.post('/user', {
            login_name: this.state.register_name_attempt,
            password: this.state.register_password_attempt,
            occupation: this.state.occupation,
            location: this.state.location,
            description: this.state.description,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
        })
        .then((response) => {
            let user = response.data;
            console.log(user);
            this.props.setUserLoggedIn(true);
            this.setState({ failedRegister: "", user });

        })
        .catch(error => {
            // Handle registration error
            console.error('Registration error:', error);
            this.setState({ message: 'Registration failed. Please try again.' , failedRegister: err.response.data});
        });
    };

    render() {
        return (

            <div className='wrapper'>
                <div className="form-container">
                    <form>
                        <h1>Login</h1>
                        <div className='input-box'>
                            <input type='text'
                                name='login_attempt'
                                value={this.state.login_attempt}
                                onChange={this.handleInputChange}
                                placeholder='Username'
                                required
                            />
                            <FaRegUser className='icon' />
                        </div>
                        <br />
                        <div className='input-box'>
                            <input type='password'
                                name='password_attempt'
                                value={this.state.password_attempt}
                                onChange={this.handleInputChange}
                                placeholder='Password'
                                required />
                            <FaUnlockAlt className='icon' />
                        </div>
                        <div className='message-div'>
                            {this.state.message && <p className='message'>{this.state.message}</p>}
                        </div>
                        <button
                            type='submit'
                            onClick={this.handleLogin}>
                            Login
                        </button>
                        
                        
                    </form>
                </div>

                <div className="form-container">
                    <form>
                        <Typography variant="h5">Register</Typography>
                        <Typography variant="body1" color="error">
                            {this.state.failedRegister}
                        </Typography>
                        <div className="input-box">
                            <input
                                type="text"
                                name="first_name"
                                value={this.state.first_name}
                                onChange={this.handleInputChange}
                                placeholder='First name'
                                required
                            />
                            
                        </div>
                        <div className='input-box'>
                            <input
                                type='text'
                                name="last_name"
                                value={this.state.last_name}
                                onChange={this.handleInputChange}
                                placeholder='Last Name'
                                required
                            />

                        </div>
                        <div className='input-box'>
                            <input
                                type='text'
                                name="register_name_attempt"
                                value={this.state.register_name_attempt}
                                onChange={this.handleInputChange}
                                placeholder='User Name'
                                required
                            />
                            
                            <FaRegUser className='icon' />
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                name="register_password_attempt"
                                value={this.state.register_password_attempt}
                                onChange={this.handleInputChange}
                                placeholder='Password'
                                required
                            />
                            <FaUnlockAlt className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password_verify_attempt"
                                value={this.state.password_verify_attempt}
                                onChange={this.handleInputChange}
                                placeholder='Verify Password'
                                required
                            />
                            <FaUnlockAlt className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="location"
                                value={this.state.location}
                                onChange={this.handleInputChange}
                                placeholder='Where are you from'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="description"
                                value={this.state.description}
                                onChange={this.handleInputChange}
                                placeholder='Describe yourself'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="occupation"
                                value={this.state.occupation}
                                onChange={this.handleInputChange}
                                placeholder='Occupation'
                                required
                            />
                        </div>



                        <div className='message-div'>
                            {this.state.message && <p className='message'>{this.state.message}</p>}
                        </div>




                        <button
                            type='submit'
                            onClick={this.handleRegister}>
                            Register
                        </button>
                        <div className='login-link'>
                            <p>Already have an account? <a href="#">Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginRegister;
