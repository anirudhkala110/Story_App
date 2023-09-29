import React, { useContext, useState } from 'react'
import './LoginRegister.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { userContext } from '../App'
axios.defaults.withCredentials = true

const LoginRegister = () => {

    const user = useContext(userContext)
    const [values, setValues] = useState({
        email: '',
        password: '',
        cpassword: '',
        phone: '',
        file: '',
        username: ''
    })
    const [hide1, setHide1] = useState(true)
    const [hide2, setHide2] = useState(true)
    const handleShowHide1 = () => {
        if (hide1) {
            setHide1(false)
        }
        else {
            setHide1(true)
        }
    }
    const handleShowHide2 = () => {
        if (hide2) {
            setHide2(false)
        }
        else {
            setHide2(true)
        }
    }
    // console.log(values.file)
    const [register, setRegister] = useState(false)
    const navigate = useNavigate()
    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    const handleLogin = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8095/login', { email: values.email, password: values.password })
            .then(res => {
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
                if (res.data.msg_type === "good") {
                    navigate('/')
                    window.location.href = '/'
                }
            })
            .catch(err => {
                console.log("Error from backend", err)
            })
    }
    axios.defaults.withCredentials = true
    const handleRegister = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', values.file);
        axios.post(`http://localhost:8095/register/${values.username}/${values.email}/${values.phone}/${values.password}/${values.cpassword}`, formData)
            .then(res => {
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
            })
            .catch(err => {
                console.log("Error from backend", err)
            })
    }

    const handleLoginSwipe = () => {
        setRegister(false)
        setHide1(true)
        setHide2(true)
        setValues({
            ...values, password: null, cpassword: null
        })
        setMsg(null)
    }
    const handleRegisterSwipe = () => {
        setMsg(null)
        setRegister(true)
        setHide1(true)
        setHide2(true)
        setValues({
            ...values, password: '', cpassword: ''
        })
    }
    return (
        <div className='w-100 d-flex justify-content-center align-items-baseline login-register' style={{ minHeight: "90vh" }} >
            <div className='container w-50 py-3 bg-light shadow-lg mt-3' style={{ maxWidth: '550px', minWidth: "300px", }}>
                {/* <!-- Pills navs --> */}
                <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist" style={{ cursor: "pointer" }}>
                    <li class="nav-item me-1" role="presentation" onClick={handleLoginSwipe}>
                        {/* <a class={`nav-link ${register ? '' : 'active'}`} id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab" */}
                        <a class={`nav-link ${register ? 'bg-secondary' : 'active'}`} id="tab-login" data-mdb-toggle="pill" role="tab"
                            aria-controls="pills-login" aria-selected="true">Login</a>
                    </li>
                    <li class="nav-item " role="presentation" onClick={handleRegisterSwipe}>
                        {/* <a class={`nav-link ${register ? 'active' : ''} `} id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab" */}
                        <a class={`nav-link ${register ? 'active' : 'bg-secondary'} `} id="tab-register" data-mdb-toggle="pill" role="tab"
                            aria-controls="pills-register" aria-selected="false">Register</a>
                    </li>
                </ul>
                {/* <!-- Pills navs --> */}

                {/* <!-- Pills content --> */}
                <div class="tab-content">
                    <div class={`tab-pane fade ${register ? '' : ' show active'}`} id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        <form className='shadow p-3 rounded bg-white' onSubmit={handleLogin}>
                            {
                                msg && <div className={` alert ${msg_type === 'good' ? "alert-success text-success" : "alert-danger text-danger"} d-flex justify-content-between align-items-center`}>{msg} <i className='bi bi-x fs-5 text-danger' onClick={e => setMsg(null)}></i> </div>
                            }
                            {/* <!-- Email input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="loginName">Email</label>
                                <input type="email" id="loginName" class="form-control" onChange={e => setValues({ ...values, email: e.target.value })} required />
                            </div>

                            {/* <!-- Password input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="loginPassword">Password</label>
                                <div className='d-flex align-items-center w-100 border justify-content-between px-1 form-control'>
                                    <input type={`${hide1 ? "password" : "text"}`} id="registerRepeatPassword" class=" border-0" onChange={e => setValues({ ...values, password: e.target.value })} required />
                                    {
                                        hide1 ? <AiFillEye onClick={handleShowHide1} /> : <AiFillEyeInvisible onClick={handleShowHide1} />
                                    }
                                </div>
                            </div>
                            <center>
                                <a href="#" className='text-decoration-none'>
                                    Forgot Password?
                                </a>
                            </center>
                            {/* <!-- Submit button --> */}
                            <button type="submit" class="btn btn-primary btn-block mt-1 mb-4 w-100">Log in</button>
                        </form>
                    </div>
                    <div class={`tab-pane fade ${register ? 'show active' : ' '} `} id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                        <form className='shadow bg-white p-3 rounded' onSubmit={handleRegister}>
                            {
                                msg && <div className={` alert ${msg_type === 'good' ? "alert-success text-success" : "alert-danger text-danger"} d-flex justify-content-between align-items-center`}>{msg} <i className='bi bi-x fs-5 text-danger' onClick={e => setMsg(null)}></i> </div>
                            }
                            {/* <!-- Name input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerName">Name</label>
                                <input type="text" id="registerName" class="form-control" onChange={e => setValues({ ...values, username: e.target.value })} required />
                            </div>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerName">Profile Pic</label>
                                <input type="file" id="registerName" class="form-control" placeholder='' accept="image/*" onChange={e => setValues({ ...values, file: e.target.files[0] })} />
                                <small className='text-info ms-1'>WARNING : Consider Passport size Pic </small>
                            </div>
                            {/* <!-- Email input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerEmail">Email</label>
                                <input type="email" id="registerEmail" class="form-control" onChange={e => setValues({ ...values, email: e.target.value })} required />
                            </div>
                            {/* <!-- Password input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerPassword">Password</label>
                                <div className='d-flex align-items-center w-100 border justify-content-between px-1 form-control'>
                                    <input type={`${hide1 ? "password" : "text"}`} id="registerRepeatPassword" class=" border-0" onChange={e => setValues({ ...values, password: e.target.value })} required />
                                    {
                                        hide1 ? <AiFillEye onClick={handleShowHide1} /> : <AiFillEyeInvisible onClick={handleShowHide1} />
                                    }
                                </div>
                            </div>
                            {/* <!-- Repeat Password input --> */}
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerRepeatPassword">Confirm Password</label>
                                <div className='d-flex align-items-center w-100 border justify-content-between px-1 form-control'>
                                    <input type={`${hide2 ? "password" : "text"}`} id="registerRepeatPassword" class=" border-0" onChange={e => setValues({ ...values, cpassword: e.target.value })} required />
                                    {
                                        hide2 ? <AiFillEye onClick={handleShowHide2} /> : <AiFillEyeInvisible onClick={handleShowHide2} />
                                    }
                                </div>
                            </div>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="registerRepeatPassword">Phone Number</label>
                                <input type="number" id="registerRepeatPassword" class="form-control" onChange={e => setValues({ ...values, phone: e.target.value })} required />
                            </div>
                            {/* <!-- Submit button --> */}
                            <button type="submit" class="btn btn-success btn-block mb-3 w-100">Register</button>
                        </form>
                    </div>
                </div>
                {/* <!-- Pills content --> */}
            </div>
        </div>
    )
}

export default LoginRegister