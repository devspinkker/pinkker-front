import React, {useState} from 'react';

import "./Comment.css"

import { addCommentToComment } from '../../../services/comments';

import { useSelector } from 'react-redux'

import { useNotification } from '../../Notifications/NotificationProvider';

export default function Comment({comment, refresh}) {

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const [reply, setReply] = useState(false);
  const [viewReply, setViewReply] = useState(false);

  const alert = useNotification();

  const [commentReply, setCommentReply] = useState('');


  function createReply() {
    if(commentReply.trim() != '') {
        addCommentToComment(token, user.name, commentReply, comment._id)
        .then(res => {
            if(res.status === 200) {

                alert({type: "SUCCESS", message: res.data.msg})
                setCommentReply('');
                refresh();
            }
        })
    }
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
          return Math.floor(interval) + " días";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " horas";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutos";
        }
        return Math.floor(seconds) + " segundos";
      }


      function getReply(reply) {
        
       return (
        <div style={{marginBottom: "20px"}} className='comment-body'>
            <div className='comment-user'>
                <img style={{width: "35px", height: "35px", borderRadius: "50px"}} src={reply.avatar} alt="" />
                <div style={{marginLeft: "10px", width: "95%"}}>

                    <div style={{color: "white", fontSize: "14px", display: "flex"}}>
                        <p>{reply.name}</p>
                        <p style={{color: "darkgray", fontSize: "11px", marginLeft: "5px"}}>Hace {timeSince(reply.date)}</p>
                    </div>
                     <p style={{color: "white", fontSize: "14px", margin: "5px auto"}}>{reply.comment}</p>

                     <div style={{fontSize: "12px", display: "flex", alignItems: "center"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <i style={{cursor: "pointer"}} class="fas fa-thumbs-up"/>
                            <p style={{margin: "5px"}}>3</p>
                        </div>

                        <div style={{marginLeft: "10px"}}>
                            <i style={{cursor: "pointer"}} class="fas fa-thumbs-down"/>    
                        </div>

                        <button onClick={() => setReply(true)} className='comment-button-reply'>RESPONDER</button>
                     </div>

                      {reply === true && <div className='comments-user-comment'>
                          <img style={{width: "35px", height: "35px", borderRadius: "50px"}} src={user.avatar} alt="" />
                          <div style={{marginLeft: "10px", width: "95%"}}>
                            <input onChange={(e) => setCommentReply(e.target.value)} placeholder='Agrega un comentario público...' className='comments-input' type="text" />
                            <div style={{width: "100%", display: "flex", justifyContent: "right", marginTop: "10px"}}>
                                <button onClick={() => setReply(false)} className='comments-button-cancel'>CANCELAR</button>
                                <button onClick={() => createReply()} className='comments-button-comment pink-button'>COMENTAR</button>
                            </div>
                          </div>
                      </div>}
                     
                </div>
            </div>
        </div>
       )
      }

      function getButtonReplys() {
        if(comment.comments.length === 1) {
          if(viewReply === true) {
            return (
              <div>
                <button onClick={() => setViewReply(false)} className='comment-button-view-reply'><i class="fas fa-angle-down"/> Ocultar respuesta</button>
              </div>
            )
          } else {
            return (
              <div>
                <button onClick={() => setViewReply(true)} className='comment-button-view-reply'><i class="fas fa-angle-down"/> Ver respuesta</button>
              </div>
            )
          }
            
        }

        if(comment.comments.length > 1) {
          if(viewReply === true) {
            return (
              <div>
                <button onClick={() => setViewReply(false)} className='comment-button-view-reply'><i class="fas fa-angle-down"/> Ocultar respuestas</button>
              </div>
            )
          } else {
            return (
              <div>
                <button onClick={() => setViewReply(true)} className='comment-button-view-reply'><i class="fas fa-angle-down"/> Ver respuestas</button>
              </div>
            )
          }
      }
      }
    
      
    return (
        <div className='comment-body'>
            <div className='comment-user'>
                <img style={{width: "35px", height: "35px", borderRadius: "50px"}} src={comment.avatar} alt="" />
                <div style={{marginLeft: "10px", width: "95%"}}>

                    <div style={{color: "white", fontSize: "14px", display: "flex"}}>
                        <p>{comment.name}</p>
                        <p style={{color: "darkgray", fontSize: "11px", marginLeft: "5px"}}>Hace {timeSince(comment.createdAt)}</p>
                    </div>
                     <p style={{color: "white", fontSize: "14px", margin: "5px auto"}}>{comment.comment}</p>

                     <div style={{fontSize: "12px", display: "flex", alignItems: "center"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <i style={{cursor: "pointer"}} class="fas fa-thumbs-up"/>
                            <p style={{margin: "5px"}}>3</p>
                        </div>

                        <div style={{marginLeft: "10px"}}>
                            <i style={{cursor: "pointer"}} class="fas fa-thumbs-down"/>    
                        </div>

                        <button onClick={() => setReply(true)} className='comment-button-reply'>RESPONDER</button>
                     </div>

                      {reply === true && <div style={{height: "50px"}} className='comments-user-comment'>
                          <img style={{width: "35px", height: "35px", borderRadius: "50px"}} src={user.avatar} alt="" />
                          <div style={{marginLeft: "10px", width: "95%"}}>
                            <input onChange={(e) => setCommentReply(e.target.value)} placeholder='Agrega un comentario público...' className='comments-input' type="text" />
                            <div style={{width: "100%", display: "flex", justifyContent: "right", marginTop: "10px"}}>
                                <button onClick={() => setReply(false)} className='comments-button-cancel'>CANCELAR</button>
                                <button onClick={() => createReply()} className='comments-button-comment pink-button'>RESPONDER</button>
                            </div>
                          </div>
                      </div>}

                      {getButtonReplys()}

                      <div style={{marginTop: "10px"}}>
                        {viewReply === true && comment.comments.map(reply => getReply(reply))}
                        
                      </div>
                     
                </div>
               



            </div>


        </div>
    )
}