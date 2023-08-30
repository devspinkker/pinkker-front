import React, {useState, useEffect} from 'react';

import "./Comments.css"

import { getAllCommentsInVideo, addComment } from "../../../services/comments";
import { useSelector } from 'react-redux'

import Comment from './Comment';

import { useNotification } from '../../Notifications/NotificationProvider';

export default function Comments({video}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [comments, setComments] = useState(null);

    const [onFocus, setOnFocus] = useState(false);

    const [comment, setComment] = useState('');

    const alert = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllCommentsInVideo(video);
            if(data != null && data != undefined) {
                setComments(data);
            }
        }
        fetchData();
    }, [])

    
    function createComment() {
        if(comment.trim() != '') {
            addComment(token, user.name, comment, video, 1)
            .then(res => {
                if(res.data != null && res.data != undefined) {
                    alert({type: "SUCCESS", message: res.data.msg})
                    setComment('');
                    handleUpdate();
                }
                   
            })
        }
    }

    function handleUpdate() {
        const fetchData = async () => {
            const data = await getAllCommentsInVideo(video);
            if(data != null && data != undefined) {
                setComments(data);
            }
        }
        fetchData();
    }

    return (
        <div className='comments-body'>
            <div className='comments-title'>
                <p>{comments && comments.length} comentarios</p>
                <button className='comments-button-sort'><i class="fas fa-sort-amount-down"/> ORDENAR POR</button>
            </div>

            <div className='comments-user-comment'>
                <img style={{width: "35px", height: "35px", borderRadius: "50px"}} src={user.avatar} alt="" />
                <div style={{marginLeft: "10px", width: "95%"}}>
                    <input onChange={(e) => setComment(e.target.value)} placeholder='Agrega un comentario público...' className='comments-input' type="text" onFocus={() => setOnFocus(true)} />
                   {onFocus === true && <div style={{width: "100%", display: "flex", justifyContent: "right", marginTop: "10px"}}>
                        <button onClick={() => setOnFocus(false)} className='comments-button-cancel'>CANCELAR</button>
                        <button onClick={() => createComment()} className='comments-button-comment pink-button'>COMENTAR</button>
                    </div>}
                </div>
               

            </div>


            <div>
                {comments && comments.map((comment) => <Comment comment={comment} refresh={handleUpdate}/> )}
            </div>


        </div>
    )
}