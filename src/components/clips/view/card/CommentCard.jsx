import React, {useState, useEffect} from "react"

import "./CommentCard.css"


import { useSelector } from "react-redux"

import { likeComment, addCommentToComment } from "../../../../services/commentsClip"

export default function CommentCard({comment}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [isLiked, setIsLiked] = useState(null);

    const [likes, setLikes] = useState(null);
    const [respuesta, setRespuesta] = useState(false)

    const [commentAnswer, setCommentAnswer] = useState(false);
    const [respuestaComments, setRespuestaComments] = useState(false)

    useEffect(() => {
        setIsLiked(comment.likedByMe)
    }, [])

    async function handleLike() {
        if(isLiked) {
            comment.totalLikes = comment.totalLikes - 1;
            setIsLiked(false);
        } else {
            comment.totalLikes = comment.totalLikes + 1;
            setIsLiked(true);
        }
        await likeComment(token, comment._id);
    }

    async function createReply() {
        const data = await addCommentToComment(token, commentAnswer, comment._id);
        const date = new Date();
        setCommentAnswer(null)
        setRespuesta(false)
        comment.comments.push({name: user.name, avatar: user.avatar, comment: commentAnswer, date: date})
    }

    function timeSince(date) {

        const date2 = new Date(date).getTime();

        var seconds = Math.floor((new Date().getTime() - date2) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " años";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " meses";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }

    return (
        <div style={{minHeight: "25px"}} className="tweetcard-body">
            <div className="tweetcard-avatar">
                <img style={{width: "30px", borderRadius: "100px", position: "relative", left: "-10px"}} src={comment.avatar}/>
            </div>

            <div style={{marginLeft: "5px"}} className="tweetcard-primary">

                <div style={{display: "flex", alignItems: "center"}}>
                    <h4>{comment.name}</h4>
                    <p style={{color: "lightgray", marginLeft: "5px", fontSize: "15px"}}> {comment.text}</p>     
                </div>


                <div style={{justifyContent: "left"}} className="tweetcard-icons">
                    <div style={{color: "lightgray"}}>
                        <p style={{fontSize: "13px"}}>{timeSince(comment.createdAt)}</p>
                    </div>
                    <div className="tweetcard-icon-like">
                        <p style={{marginLeft: "10px", fontSize: "13px"}}>{comment.totalLikes} {comment.totalLikes === 1 ? "Me gusta" : "Me gustas"}</p>
                    </div>
                    <div style={{color: "lightgray", marginLeft: "10px"}}>
                        <p onClick={() => setRespuesta(!respuesta)} style={{fontSize: "13px"}}>Responder</p>
                    </div>
                </div>


                {respuesta === true && <div className="comment-answer-input">
                    <img style={{width: "30px", position: "relative", top: "3px", marginRight: "5px"}} src={user.avatar}/>
                    <input placeholder="Escribi tu respuesta.." type="text" onChange={(e) => setCommentAnswer(e.target.value)} />
                    <button onClick={() => createReply()} style={{width: "75px", fontSize: "11px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "5px"}} className="viewtweet-button-reply">Responder</button>
                </div>}

                {comment.comments.length >= 1 && respuestaComments === true && <div onClick={() => setRespuestaComments(false)} style={{marginTop: "5px"}}>
                    <div style={{color: "white"}}>
                        <p style={{fontSize: "13px"}}>Ocultar respuestas</p>
                    </div>
                </div>}


                {comment.comments.length >= 1 && respuestaComments === false && <div onClick={() => setRespuestaComments(true)} style={{marginTop: "5px"}}>
                    <div style={{color: "white"}}>
                        <p style={{fontSize: "13px"}}>Ver respuestas ({comment.comments.length})</p>
                    </div>
                </div>}

                {respuestaComments === true && comment.comments.map((commentReply) => <div className="comment-answer-input">
                    <img style={{width: "30px", position: "relative", top: "3px", marginRight: "5px"}} src={commentReply.avatar}/>
                    <h4>{commentReply.name}</h4>
                    <p style={{color: "lightgray", marginLeft: "5px", fontSize: "15px"}}> {commentReply.comment}</p>     
                </div>)}



            </div>


            <div style={{color: isLiked && "red"}} className="tweetcard-icon-like">
                {isLiked ? <i onClick={() => handleLike()} style={{fontSize: "14px"}} class="fas fa-heart"/> : <i onClick={() => handleLike()} style={{fontSize: "14px"}} class="far fa-heart"/>}
            </div>

        </div>
    )
}