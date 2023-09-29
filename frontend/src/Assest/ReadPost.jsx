import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BsFillHandThumbsUpFill, BsHandThumbsUp } from 'react-icons/bs'
import './ReadPost.css'
import { userContext } from '../App'

axios.defaults.withCredentials = true

const ReadPost = () => {
    const [post, setPost] = useState([])
    const { id } = useParams()
    const user = useContext(userContext)
    const [hide, setHide] = useState(false)
    useEffect(() => {
        axios.get(`http://localhost:8095/read-post/${id}`)
            .then(res => {
                setPost(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8095/a-res/${id}`, { id: id })
            .then(res => {
                console.log(res.data)
                setLiked(res.data)
                setHide(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    // alert(id)

    const [liked, setLiked] = useState(null)
    // const [disliked, setDisliked] = useState(null)

    const handleLiked = (id) => {
        console.log(id)
        setLiked(true)
        // setDisliked(false)
    }
    // const handleDislike = (id) => {
    //     console.log(id)
    //     setDisliked(true)
    //     setLiked(false)
    // }

    const handleSubmit = () => {
        console.log("Clicked")
        console.log(liked, "  ")
        if (liked) {
            axios.post('http://localhost:8095/reaction', { liked: liked, id: id })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    setLiked(true)
                })
        }
        else {
            alert("Please tap upvote first . . . ")
        }
    }
    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.slice(0, maxLength);
        }
        return text;
    };
    // console.log(user)
    return (
        <div className='text-light' style={{ minHeight: "90vh", backdropFilter: "blur(50px)" }}>

            {
                <div className=' card bg-dark mx-5 my-2 p-2' >
                    <div className='alert alert-success shadow mb-4 heading-post-read align-items-center justify-content-between'>
                        <div className='fs-4 fw-bold'> <b className='text-decoration-upper'>TITLE OF THE STORY</b> : {post.title}</div>
                        <div className='card-title fs-3 fw-bold d-flex align-items-center px-3 author-data' style={{}}>

                            <img src={`http://localhost:8095/Files/${post.file}`} className='img-thumbnail rounded-5' style={{ width: "70px" }} />
                            <div>
                                <div className='px-2 d-flex justify-content-start  fw-bold'>{truncateText(post.createdAt, 10)}</div>
                                <div dangerouslySetInnerHTML={{ __html: post.username }} className='px-2 d-flex justify-content-start fw-bold'></div>
                            </div>
                        </div>
                    </div>
                    <div className='rounded border bg-light overflow-auto shadow read-post' style={{ height: "68vh" }}>
                        <div dangerouslySetInnerHTML={{ __html: post.story }} className='px-5 card-body'></div>
                    </div>
                    {
                        user.msg_type !== "error" ? <div className='d-flex'>
                            {
                                liked ? <button className='d-flex align-items-center text-light p-0 py-2 fs-3 border-0 px-5' style={{ background: "transparent", }} disabled><BsFillHandThumbsUpFill /> &nbsp;Liked . . .  </button> : <button className='d-flex align-items-center text-light p-0 py-2 fs-3 border-0 px-5' style={{ background: "transparent", }} onClick={e => handleLiked(id)}><BsHandThumbsUp /> &nbsp; ?</button>
                            }
                            {/* <button className='btn btn-outline-light m-3' onClick={e => handleDislike(id)}>Downvote &nbsp; < BiCaretDown /></button> */}
                            {
                                hide ? <></> : <button onClick={handleSubmit} className='btn btn-primary m-3'> Submit Your Reaction</button>
                            }
                        </div> : <div className='w-100'> <Link to='/auth=0/userProfile' className='w-100'><center className='text-light btn btn-outline-primary py-2 mt-2 fw-bold'>You Liked this Story . . Please Login to Thumbs up on this story</center></Link></div>
                    }
                </div>
            }

        </div >
    )
}

export default ReadPost