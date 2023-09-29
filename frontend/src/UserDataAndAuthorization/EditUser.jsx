import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../App'
import './EditUser.css'
import LoginRegister from './LoginRegister'
axios.defaults.withCredentials = true

const EditUser = () => {
    const user = useContext(userContext)
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
    // console.log(userdata)

    const [name, setName] = useState(user.username)
    const [phone, setPhone] = useState(user.phone)
    const [file, setFile] = useState(user.file)
    const handleSubmit = (e) => {
        // Your form submission logic here, using name, phone, and file as needed
        // console.log(name, " -> ", user.username)
        // alert(name)
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        axios.put(`http://localhost:8095/edit-user/${name}/${phone}/${file}`, formData)
            .then(res => {
                setmsg(res.data.msg)
                setMsg_type(res.data.msg_type)
                setTimeout(() => {
                    setmsg(null)
                    window.location.reload(true)
                    setName(userdata[0].name)
                    setName(userdata[0].phone)
                    setName(userdata[0].file)
                }, 2000)
            })
            .catch(err => console.log(err))
    }

    const [msg, setmsg] = useState(null)
    const [msg_type, setMsg_type] = useState(null)

    // console.log(userdata.name)

    return (
        <div className='min-vh-100' style={{ backdropFilter: "50px" }}>
            {
                user.email ? <div className='w-100 ' style={{ backdropFilter: "50px" }}>
                    {
                        msg && <center className={`alert fw-bold ${msg_type === "good" ? "alert-success" : "alert-danger"}`}>{msg} {msg_type === "good" && <div>Data Will reflect back when you login for the next time . </div>}</center>
                    }
                    <div className='user-edit py-2 mt-0 min-vh-100'>
                        {
                            userdata ? userdata.map((data) => (
                                <form className='card mx-2 ' >
                                    <div className='card-header alert alert-danger fs-3 fw-bold'>Old Data</div>
                                    <div className='input-group bg-light px-3'>
                                        <label className='text-dark mb-2'>Name</label>
                                        <input className='form-control w-100 mb-4' value={data.name} readOnly />
                                    </div>
                                    <div className='input-group bg-light px-3'>
                                        <label className='text-dark mb-2'>Mobile Number</label>
                                        <input className='form-control w-100 mb-4' value={data.phone} readOnly />
                                    </div>
                                    <div className='input-group bg-light px-3'>
                                        <label className='text-dark mb-2'>Profile Pic</label>
                                        <input className='form-control w-100 mb-4' value={data.file} readOnly />
                                    </div>
                                    <div className='d-flex justify-content-center mb-4'>
                                        <img src={`http://localhost:8095/Files/${data.file}`} className='w-50 shadow' style={{ maxWidth: "750px" }} />
                                    </div>
                                </form>
                            )) : <center className='alert alert-warning text-warning fw-bold '>Loading . . . </center>
                        }
                        <form className='card mx-2' onSubmit={handleSubmit}>
                            <div className='card-header alert-success alert fs-3 fw-bold'>New Data</div>
                            <div className='input-group bg-light px-3'>
                                <label className='text-dark mb-2'>Name</label>
                                <input className='form-control w-100 mb-4' type='text' value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className='input-group bg-light px-3'>
                                <label className='text-dark mb-2'>Mobile Number</label>
                                <input className='form-control w-100 mb-4' type='number' value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className='input-group bg-light px-3'>
                                <label className='text-dark mb-2'>Profile Pic</label>
                                <input className='form-control w-100 mb-4' type='file' onChange={e => setFile(e.target.files[0])} />
                            </div>
                            <div className='card-header fw-bold'>New Image Will be shown after Uploading Your Data</div>
                            <button className='btn btn-outline-success my-2'>Submit</button>
                        </form>
                    </div>


                </div> : <LoginRegister />
            }
        </div>
    )
}

export default EditUser
