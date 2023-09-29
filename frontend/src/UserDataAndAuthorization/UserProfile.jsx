import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../App'
import LoginRegister from './LoginRegister'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'

axios.defaults.withCredentials = true

const UserProfile = () => {
    const user = useContext(userContext)
    const navigate = useNavigate()
    const handleLogout = (e) => {
        axios.get('http://localhost:8095/logout')
            .then(res => {
                if (res.data.msg_type === "good") {
                    console.log('Logout')
                    navigate('/')
                    // alert("Logout")
                    window.location.href = '/'
                }

            })
            .catch(err => console.log(err))
    }

    const handleEdit = (route) => {
        navigate(`/${route}`)
    }

    const handleDelete = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account?");
        console.log(user.userId)
        if (confirmation) {
            // User confirmed, you can proceed with the delete action
            // Add your delete logic here
            // For example, you can send a request to the server to delete the user's account
            axios.delete(`http://localhost:8095/delete-account/${user.userId}`)
                .then(res => {
                    if (res.data.msg_type === "good") {
                        console.log('Account deleted');
                        navigate('/');
                    }
                })
                .catch(err => console.log(err));
        }
    }

    const [userdata, setUserData] = useState([])

    // console.log(user)
    useEffect(() => {
        axios.get('http://localhost:8095/user/info')
            .then(res => {
                setUserData(res.data)
            })
            .catch(err => console.log(err))
    })
    // console.log(userdata.name)
    // console.log(userdata.id)
    return (
        <div>
            {
                user.email ? <div className=' text-light d-flex align-items-start pt-4' style={{ backdropFilter: "blur(100px)", minHeight: "93vh" }}>
                    <div className='container bg-light text-dark p-4'>
                        <center className='alert alert-warning  shadow card'><h1>USER PROFILE</h1></center>
                        <div className='w-100 card mt-4 py-4 d-flex shadow align-items-center'>
                            <div className=''>
                                {
                                    userdata ? userdata.map((data) => (
                                        <>
                                            <div className='d-flex align-items-baseline '>
                                                <label className='fw-bold me-5'>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  </label>
                                                <div className=''>: &nbsp;&nbsp;&nbsp;&nbsp;{data.name} </div>
                                            </div>
                                            <div className='d-flex align-items-baseline '>
                                                <label className='fw-bold me-5'>Email &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
                                                <div className=''>: &nbsp;&nbsp;&nbsp;&nbsp;{data.email} </div>
                                            </div>
                                            <div className='d-flex align-items-baseline '>
                                                <label className='fw-bold '>Mobile Number &nbsp;&nbsp; </label>
                                                <div className=''>: &nbsp;&nbsp;&nbsp;&nbsp;{data.phone} </div>
                                            </div>
                                        </>
                                    )) : <center className='alert alert-warning text-warning fw-bold '>Loading . . . </center>
                                }
                            </div>
                        </div>
                        <hr />
                        <div>
                            <center className='fs-2 fw-bolder'>Profile Pic</center>
                            {
                                userdata ? userdata.map((data) => (
                                    <center> <img className='rounded' src={`http://localhost:8095/Files/${data.file}`} style={{ width: "300px" }} /> </center>
                                )) : <center className='alert alert-warning text-warning fw-bold '>Loading . . . </center>
                            }
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button className='btn btn-outline-danger w-75 mt-3' onClick={handleLogout}>Logout</button>
                        </div>
                        <div className='d-flex justify-content-around'>
                            <button className='btn btn-outline-success w-25 mt-3' onClick={e => handleEdit('auth=1/user/edit-profile')}>Edit</button>
                            <button className='btn btn-outline-danger w-25 mt-3' onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div> : <LoginRegister />
            }
        </div>
    )
}

export default UserProfile