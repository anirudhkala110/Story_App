import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css'
const TextEditor = ({ aiStory, setStory }) => {
    const [value, setValue] = useState('');
    setStory(value)
    return <>
        <ReactQuill theme="snow" value={value} onChange={setValue} style={{ maxHeight: "250px", overflowY: "auto" }} />
        {
            aiStory ?
                <div className='mt-3 text-center'>
                    <label className='fs-4 fw-bolder'>AI Generated</label><br />
                    <textarea className='' cols={50} rows={10} style={{ resize: "none" }} value={aiStory} />
                    <br />
                    <small className='btn btn-info'>Add the above part to Your Story and Modify it. </small>
                </div> : <></>
        }
    </>;
}

export default TextEditor