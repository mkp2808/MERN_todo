import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import { Base_URL, login } from '../../API/AllApiEndPoints';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('login-token')) {
            navigate('/',{replace:true});
        }
    }, [navigate]);

    // useStates 
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({})
    const [error, setError] = useState({})

    // Methods
    const validateData = (name, value) => {
        let flag = false;
        const emailRegex = window.emailRegex
        if (name === "email") {
            if (value === '') {
                setError({ ...error, [name]: `Email must not be empty` })
                flag = false;
            }
            else if (!emailRegex.test(value)) {
                setError({ ...error, [name]: `Enter valid Email` })
                flag = false;
            }
            else {
                setError({ ...error, [name]: `` })
                flag = true;
            }
        }

        if (name === "password") {
            if (value === '') {
                setError({ ...error, [name]: `Email must not be empty` })
                flag = false;
            }
            else if (value.length < 6) {
                setError({ ...error, [name]: `Password must be at least 6 characters long` })
                flag = false;
            }
            else {
                flag = true;
                setError({ ...error, [name]: `` })
            }
        }

        return flag;
    }

    const updateData = (e) => {
        const { name, value } = e.target;
        if (validateData(name, value)) {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async () => {
        if (error.password === '' || error.email === '') {
            console.log("caalling")
            await axios.post(Base_URL + login,
                {
                    "email": formData.email,
                    "password": formData.password
                }
            ).then((response) => {
                console.log(response)
                toast.success(response.data.client_message);
                localStorage.setItem('login-token', response.data.token);
                localStorage.setItem('user_id', response.data.user_id);
                navigate('/')
            }
            ).catch((error) => {
                toast.error(error.response.data.client_message);
            }).then(() => {

            })
        }
    }


    return (
        <div id='login'>
          {!localStorage.getItem('login-token')&&  <Container className='login-container'>
                <div className="login-box">
                    <h1 className='text-center mb-4'>
                        Login
                    </h1>
                    <InputGroup className="mt-1">
                        <Form.Control
                            placeholder="Email"
                            aria-label="Email"
                            name='email'
                            onBlur={(e) => { updateData(e) }}
                            onChange={(e) => { updateData(e) }}
                        />
                    </InputGroup>
                    <div className='error'>&nbsp; {error.email && error.email}</div>

                    <InputGroup className="mt-1 position-relative d-flex align-item-center">
                        <Form.Control
                            className='border-end-0'
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name='password'
                            onBlur={(e) => { updateData(e) }}
                            onChange={(e) => { updateData(e) }}
                        />
                        <InputGroup.Text className='bg-white' id="">
                            <span className='showHidePassword '
                                onClick={() => { setShowPassword(!showPassword) }}>
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </InputGroup.Text>
                    </InputGroup>
                    <div className='error'>&nbsp; {error.password && error.password}</div>
                    <div className="mt-3 login-footer">
                        <div className="btn-group w-100">
                            <Button className='login-btn ' as="input" type="submit" value="Login"
                                disabled={error.password !== '' || error.email !== ''}
                                onClick={() => { handleSubmit() }}
                            />
                        </div>
                        <div className="register-link">
                            <Link to="/register" className='toRegister'>Register here!</Link>
                        </div>
                    </div>


                </div>

            </Container>}
        </div>
    )
}

export default Login