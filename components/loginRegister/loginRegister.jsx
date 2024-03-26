import React from 'react';
import axios from 'axios';
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
import './loginRegister.css';


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
                this.props.setUserLoggedIn(true);
                this.props.setTopName(`Hello ${response.data.first_name}`);
            })
            .catch(error => {
                this.setState({ message: 'Login failed. Please try again.' });
                console.error('Login error:', error);
            });
    };

    // handleLogout = () => {
    //     axios.post('/admin/logout')
    //         .then(response => {
    //             this.setState({ message: response.data });
    //         })
    //         .catch(error => {
    //             this.setState({ message: 'Logout failed' });
    //             console.error('Logout error:', error);
    //         });
    // };

    render() {
        return(
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
       
                   <div className='remember-forgot'>
                        <a href='#'>Forgot password?</a>
                        {this.state.message && <p className='message'>{this.state.message}</p>}
                   </div>
       
                   <button 
                        type='submit'
                        onClick={this.handleLogin}
                   >
                    Login
                   </button>
       
                   <div className='register-link'>
                    <p>Don&apos;t have an account? <a href="#">Register</a></p>
       
       
                   </div>
       
                 </form>
       
            </div> 
         );
    }
}

export default LoginRegister;
