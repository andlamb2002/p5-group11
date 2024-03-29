import React from 'react';
import axios from 'axios';
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
import './loginRegister.css';


class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: 'malcolm', // Change to blank later 
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            location: '',
            description: '',
            occupation: '',
            message: null
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleLoginNameChange = (event) => {
        this.setState({ loginName: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();

        axios.post('/admin/login', { login_name: this.state.loginName , password: this.state.password})
            .then(response => {
                let user = response.data;
                console.log(user);
                this.props.setUserLoggedIn(true);
                this.props.setTopName(`Hi ${response.data.first_name}`);
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
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    handleRegister = (event) => {
        event.preventDefault();
        const { password, confirmPassword } = this.state;

        if(password !== confirmPassword){
            this.setState({ message: 'Password do not match' });
            return;
        }

        axios.post('/user', {
            login_name: this.state.loginName,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            location: this.state.location,
            description: this.state.description,
            occupation: this.state.occupation
        })
        .then((response) => {
            let user = response.data;
            console.log(user);
            this.props.setUserLoggedIn(true);
            this.setState({
                message: 'Registration successful!',
                loginName: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                location: '',
                description: '',
                occupation: ''
            });
        })
        .catch(error => {
            // Handle registration error
            console.error('Registration error:', error);
            this.setState({ message: 'Registration failed. Please try again.' });
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
                                name='username'
                                value={this.state.loginName}
                                onChange={this.handleInputChange}
                                placeholder='Username'
                                required
                            />
                            <FaRegUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type='password'
                                name='password'
                                value={this.state.password}
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
                        <div className='register-link'>
                            <p>Don&apos;t have an account? <a href="#">Register</a></p>
                        </div>
                    </form>
                </div>

                <div className="form-container">
                    <form>
                        <h1>Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                name="loginName"
                                value={this.state.loginName}
                                onChange={this.handleInputChange}
                                placeholder='Username'
                                required
                            />
                            <FaRegUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input
                                type='password'
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                placeholder='Password'
                                required
                            />
                            <FaUnlockAlt className='icon' />
                        </div>
                        <div className='input-box'>
                            <input
                                type='password'
                                name="confirmPassword"
                                value={this.state.confirmPassword}
                                onChange={this.handleInputChange}
                                placeholder='Confirm Password'
                                required
                            />
                            <FaUnlockAlt className='icon' />
                        </div>

                        <div className="input-box">
                            <input
                                type="text"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                                placeholder='First Name'
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                                placeholder='Last Name'
                                required
                            />
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
