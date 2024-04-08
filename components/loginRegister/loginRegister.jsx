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
                login_name: undefined,
                password: undefined,
                register_login_name: undefined,
                register_password: undefined,
                password_repeat: undefined,
            },
            loginName: '',
            message: null
        };

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

    handleLoginNameChange = (event) => {
        this.setState({ loginName: event.target.value });
    };

    handleLogin = (event) => {
        event.preventDefault();

        axios.post('/admin/login', { login_name: this.state.loginName })
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

        const currentState = {
            first_name: this.state.user.first_name,
            last_name: this.state.user.last_name,
            location: this.state.user.location,
            description: this.state.user.description,
            occupation: this.state.user.occupation,
            register_login_name: this.state.user.register_login_name,
            register_password: this.state.user.register_password,
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
            .then((response) => {
                if (response && response.data) { // Ensure response and response.data are not undefined
                    const user = response.data;
                    this.setState({
                        showRegistrationSuccess: true,
                        showRegistrationError: false,
                        showRequiredFieldsWarning: false,
                    });
                    
                    // this.props.changeUser(user);
                    window.location.href = `#/users/${user._id}`;
                } else {
                    // Handle unexpected response format
                    console.error('Unexpected response format:', response);
                }
            })
            .catch(error => {
                this.setState({
                    showRegistrationError: true,
                    showRegistrationSuccess: false,
                    showRequiredFieldsWarning: false,
                });
                if (error.response && error.response.data) {
                    // You can access error.response.data here if it exists
                    console.log(error.response.data);
                } else {
                    // Handle cases where error.response.data does not exist
                    console.error('Error during registration:', error);
                }
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
                <div className='wrapper'>
       
                    <form action=''>
        
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
                        <input type='password' placeholder='Password' required/>
                        <FaUnlockAlt className='icon'/>
        
                    </div>
        
                    <div className='message-div'>
                            {this.state.message && <p className='message'>{this.state.message}</p>}
                    </div>
        
                    <button 
                            type='submit'
                            onClick={this.handleLogin}
                    >
                        Login
                    </button>
        
                    </form>
       
                </div> 
                {/* <div className="login-box">
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
                </div> */}
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












// class LoginRegister extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loginName: '',
//             message: null
//         };
//     }

//     handleLoginNameChange = (event) => {
//         this.setState({ loginName: event.target.value });
//     };

//     handleLogin = (event) => {
//         event.preventDefault();

//         axios.post('/admin/login', { login_name: this.state.loginName })
//             .then(response => {
//                 this.props.setUserLoggedIn(true);
//                 this.props.setTopName(`Hi ${response.data.first_name}`);
//             })
//             .catch(error => {
//                 this.setState({ message: 'Login failed. Please try again.' });
//                 console.error('Login error:', error);
//             });
//     };

//     render() {
//         return(
//             <div className='wrapper'>
       
//                  <form action=''>
       
//                    <h1>Login</h1>
       
//                    <div className='input-box'>
//                      <input type='text'
//                         value={this.state.loginName}
//                         onChange={this.handleLoginNameChange}
//                         placeholder='Username' 
//                         required
//                     />
//                      <FaRegUser className='icon'/>
//                    </div>
       
//                    <div className='input-box'>
//                      <input type='password' placeholder='Password' required/>
//                      <FaUnlockAlt className='icon'/>
       
//                    </div>
       
//                    <div className='message-div'>
//                         {this.state.message && <p className='message'>{this.state.message}</p>}
//                    </div>
       
//                    <button 
//                         type='submit'
//                         onClick={this.handleLogin}
//                    >
//                     Login
//                    </button>
       
//                    {/* <div className='register-link'>
//                     <p>Don&apos;t have an account? <a href="#">Register</a></p>
       
       
//                    </div> */}
       
//                  </form>
       
//             </div> 
//          );
//     }
// }

// export default LoginRegister;
