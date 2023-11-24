import axios from 'axios';
import React, {  useState } from 'react'
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import { Base_URL, login, signup } from '../../API/AllApiEndPoints';
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();

    // useStates 
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({})
    const [error, setError] = useState({})


    // Methods
    const validateData = (name, value) => {
        let flag = false;
        const nameRegex = window.nameRegex
        if (name === "name") {
            if (value === '') {
                setError({ ...error, [name]: `Name must not be empty` })
                flag = false;
            }
            else if (!nameRegex.test(value)) {
                setError({ ...error, [name]: `Name must be alphabets only` })
                flag = false;
            }
            else {
                setError({ ...error, [name]: `` })
                flag = true;
            }
        }

        if (name === "phone") {
            if (value === '') {
                setError({ ...error, [name]: `Phone Number must not be empty` })
                flag = false;
            }
            else if (!['6', '7', '8', '9'].includes(String(value)[0])) {
                setError({ ...error, [name]: `Enter valid Phone Number` })
                flag = false;
            }
            else if (value.length !== 10) {
                setError({ ...error, [name]: `Phone Number length must be 10` })
                flag = false;
            }
            else {
                setError({ ...error, [name]: `` })
                flag = true;
            }
        }

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
                setError({ ...error, [name]: `Password must not be empty` })
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

        if (name === "confirmPassword") {
            if (value === '') {
                setError({ ...error, [name]: `Confirm Password must not be empty` })
                flag = false;
            }
            else if (value !== formData.password) {
                setError({ ...error, [name]: `Confirm Password and Password doesn't match.` })
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
        if (error.confirmPassword === '' ||error.password === '' || error.name === '' || error.phone === '' || error.email === '') {
            await axios.post(Base_URL + signup,
                {
                    "name": formData.name,
                    "email": formData.email,
                    "phone": formData.phone,
                    "password": formData.password,
                }
            ).then((response) => {
                console.log(response)
                toast.success(response.data.client_message);

                // Login after successful registration 
                (async () => {
                    await axios.post(Base_URL + login,
                        {
                            "email": formData.email,
                            "password": formData.password
                        }
                    ).then((logineRes) => {
                        console.log(logineRes)
                        localStorage.setItem('login-token', logineRes.data.token);
                        navigate('/')
                    })
                })();
            }
            ).catch((error) => {
                toast.error(error.response.data.client_message);
            }).then(() => {

            })
        }
    }


    return (
        <div id='register'>
            <Container className='register-container'>
                <div className="register-box">
                    <h1 className='text-center mb-4'>
                        Register
                    </h1>
                    <InputGroup className="mt-1">
                        <Form.Control
                            placeholder="Name"
                            aria-label="Name"
                            name='name'
                            onBlur={(e) => { updateData(e) }}
                            onChange={(e) => { updateData(e) }}
                        />
                    </InputGroup>
                    <div className='error'>&nbsp; {error.name && error.name}</div>

                    <InputGroup className="mt-1">
                        <Form.Control
                            type='number'
                            placeholder="Phone"
                            aria-label="phone"
                            name='phone'
                            onBlur={(e) => { updateData(e) }}
                            onChange={(e) => { updateData(e) }}
                        />
                    </InputGroup>
                    <div className='error'>&nbsp; {error.phone && error.phone}</div>


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

                    <InputGroup className="mt-1 position-relative d-flex align-item-center">
                        <Form.Control
                            className='border-end-0'
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            name='confirmPassword'
                            onBlur={(e) => { updateData(e) }}
                            onChange={(e) => { updateData(e) }}
                        />
                        <InputGroup.Text className='bg-white' id="">
                            <span className='showHidePassword '
                                onClick={() => { setShowConfirmPassword(!showConfirmPassword) }}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </span>
                        </InputGroup.Text>
                    </InputGroup>
                    <div className='error'>&nbsp; {error.confirmPassword && error.confirmPassword}</div>


                    <div className="mt-3 register-footer">
                        <div className="btn-group w-100">
                            <Button className='register-btn ' as="input" type="submit" value="Register"
                                disabled={error.password !== '' || error.confirmPassword !== '' || error.email !== '' || error.name !== '' || error.phone !== ''}
                                onClick={() => { handleSubmit() }}
                            />
                        </div>
                        <div className="login-link">
                            <Link to="/login" className='toLogin'>Login</Link>
                        </div>
                    </div>


                </div>

            </Container>
        </div>
    )
}

export default Register












