import React, { useContext, useEffect, useState } from 'react'
import AppName from '../Assest/AppName'
import './Navbar.css'
import 'bootstrap/js/dist/offcanvas.js'
import 'bootstrap/js/dist/carousel.js'
import 'bootstrap/js/dist/alert.js'
import 'bootstrap/js/dist/button.js'
import 'bootstrap/js/dist/modal.js'
import 'bootstrap/js/dist/collapse.js'
import 'bootstrap/js/dist/dropdown.js'
import axios from 'axios'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom'
import Home from '../Component/Home'

axios.defaults.withCredentials = true

const Navbar = () => {

    const user = useContext(userContext)
    const navigate = useNavigate()
    const handleRoute = (route) => {
        navigate(`/${route}`)
    }

    const [userdata, setUserData] = useState([])

    // console.log(user)
    useEffect(() => {
        axios.get('http://localhost:8095/user/info')
            .then(res => {
                // console.log(res.data[0])
                setUserData(res.data)
            })
            .catch(err => console.log(err))
    })
    return (
        <div>
            <nav className='navbar navbar-dark text-light bg-dark fs-3 py-0' id='top'>
                <div className='px-2 fs-4'>
                    <AppName />
                </div>
                <div className='max-width-1000px'>
                    <button class="btn text-light max-width-1000px" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarSupportedContent" aria-controls="offcanvasExample">
                        <span className='navbar-toggler-icon' style={{ color: "white !important" }}></span>
                    </button>
                    <div className='offcanvas offcanvas-end' id='navbarSupportedContent' tabindex="-1" aria-labelledby="offcanvasExampleLabel">
                        <div class="offcanvas-header">
                            <div class="offcanvas-title" id="offcanvasExampleLabel">
                                <AppName />
                            </div>
                            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="p-2">
                            <button className='btn  text-dark pb-2 btn-hover mb-3 w-100 shadow rounded-0 fw-bold fs-4' onClick={e => handleRoute('')}>Home</button>
                            <button className='btn  text-dark pb-2 btn-hover mb-3 w-100 shadow fw-bold rounded-0 fs-4' onClick={e => handleRoute('auth=1/create')}>Create</button>
                            {
                                Array.isArray(userdata) && userdata.length > 0 ? userdata.map((data) => (
                                    data.file || data.name ? <button className='btn text-dark pb-2 btn-hover w-100 mb-2 fw-bold fs-4' onClick={e => handleRoute('auth=1/userProfile')}><img src={`http://localhost:8095/Files/${data.file}`} style={{ width: "35px" }} className='rounded-5 me-3 shadow' />{data.name}</button> : <button className='btn btn-outline-primary w-100 mb-2 fw-bold fs-4 shadow' style={{ fontSize: "12px" }} onClick={e => handleRoute('auth=1/userProfile')}>User Profile</button>

                                )) : <button className='btn btn-hover rounded-0 shadow w-100 mb-2 fw-bold fs-4 ' style={{ fontSize: "12px" }} onClick={e => handleRoute('auth=0/userProfile')}>User Profile</button>
                            }
                        </div>
                    </div>
                </div>
                <div className='min-width-1000px align-items-center'>
                    <button className='btn text-light pb-1 btn-hover fw-bold rounded-0 me-2 p-1 ' onClick={e => handleRoute('')}>Home</button>
                    <button className='btn text-light pb-1 btn-hover fw-bold rounded-0 me-2 p-1 ' onClick={e => handleRoute('auth=1/create')}>Create</button>
                    {
                        Array.isArray(userdata) && userdata.length > 0 ? userdata.map((data) => (
                            data.file || data.name ? <button className='btn  w-100 fw-bold ' onClick={e => handleRoute('auth=1/userProfile')}><img src={`http://localhost:8095/Files/${data.file}`} style={{ width: "35px" }} className='rounded-5 me-3' /></button> : <button className='btn btn-outline-primary w-100 mb-2 fw-bold fs-4 ' style={{ fontSize: "12px" }} onClick={e => handleRoute('auth=1/userProfile')}>User Profile</button>

                        )) : <button className='btn pb-1 btn-hover text-light w-100 fw-bold rounded-0 ' onClick={e => handleRoute('auth=0/userProfile')}>User Profile</button>
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar