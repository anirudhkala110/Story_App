import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { userContext } from '../App'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BsFillCapslockFill } from 'react-icons/bs'
axios.defaults.withCredentials = true
const Home = () => {
    const user = useContext(userContext)
    const [size, setSize] = useState()
    const [post, setPost] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8095/all-posts')
            .then((posts) => {
                setPost(posts.data);
            })
            .catch((err) => console.log(err));
    }, []);
    // console.log(post)
    const truncateText = (text, maxLength, ending) => {
        const words = text.split(' ');
        if (words.length > maxLength) {
            return words.slice(0, maxLength).join(' ') + ending;
        }
        return text;
    };
    return (
        <div className='w-100 text-light home d-flex justify-content-center' style={{ minHeight: "90vh" }}>
            <div className='d-flex justify-content-center '>
                <div className='py-3 row d-flex justify-content-center home-base ' style={{ height: "fit-content", width: "90vw" }}>
                    {
                        post ? post.map((post, i) => (

                            <div key={i} className='border bg-body-secondary card border-primary mx-4 mb-4 col-12 col-sm-5  col-md-5 col-lg-2 hoverme text-dark d-flex justify-content-start align-items-baseline width-matter'>
                                <Link to={`/read-story/${post.id}`} className='text-decoration-none py-3 w-100'>
                                    <b className='fs-4 text-success'>Story #{i + 1} </b>
                                    <div className=' card bg-light shadow'>
                                        <div className='card-header fs-5 fw-bold alert alert-warning description' style={{ maxHeight: "50px" }}>
                                            Title : {truncateText(post.title, 2, "")}
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: truncateText(post.story, 10, " . . . read more") }} className='card-body overflow-auto description' style={{ maxHeight: "120px" }}></div>
                                        <div className='d-flex justify-content-between align-items-center px-2'>
                                            <div className='d-flex justify-content-between fs-5 align-items-center'>{post.likesCount} <BsFillCapslockFill className='ms-1' /></div>
                                            <div className='d-flex align-items-center justify-content-end'>
                                                <img src={`http://localhost:8095/Files/${post.file}`} className='p-1 rounded-3' style={{ width: "30px" }} />
                                                <div dangerouslySetInnerHTML={{ __html: post.username }} className='pe-2 py-2'></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                        )) : <center className='fs-1 fw-bolder shadow bg-light text-dark'>Nothing has uploaded yet to Show</center>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home