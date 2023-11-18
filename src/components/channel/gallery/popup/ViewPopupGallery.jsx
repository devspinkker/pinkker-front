import React, {useState, useEffect} from "react"

import "./ViewPopupGallery.css"

import {useSelector, useDispatch} from 'react-redux'

import { useNotification } from "../../../Notifications/NotificationProvider";

import { getAllCommentsInVideo, addComment } from "../../../../services/commentsGallery";

import { like, userLikeGallery } from "../../../../services/gallery";

import { ScaleLoader } from "react-spinners"

import EmojiPicker, { Theme } from "emoji-picker-react";


export default function ViewPopupGallery({ image, gallery, closePopup }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const dispatch = useDispatch()
    const alert = useNotification();

    const [comments, setComments] = useState(null)
    const [comment, setComment] = useState("")

    const [isLiked, setIsLiked] = useState(null);
    const [likes, setLikes] = useState(null);

    const [dropdownEmotes, setDropdownEmotes] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            setLikes(gallery.likes.length)

            const dataLiked = await userLikeGallery(token, gallery._id);
            if(dataLiked != null && dataLiked != undefined) {
                setIsLiked(dataLiked.data);
            }

            const data = await getAllCommentsInVideo(gallery._id)
            if(data != null && data != undefined) {
                setComments(data)
            }
        }   
        fetchData()
    }, [])

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

    const onMouseEnterEmotes = () => {
        if(dropdownEmotes === true) {
          setDropdownEmotes(false);
        } else{
          setDropdownEmotes(true);
        }
    };

    const handleLike = async () => {

        if(isLiked) {
            setIsLiked(false);
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }

        await like(token, gallery._id);
    }

    function createComment() {
        if(comment.trim() != '') {
            setDropdownEmotes(false);
            addComment(token, user.name, comment, gallery._id, 1)
            .then(res => {
                if(res.data != null && res.data != undefined) {
                    setComment('');
                    handleUpdate();
                }
                   
            })
        }
    }

    function handleUpdate() {
        const fetchData = async () => {
            const data = await getAllCommentsInVideo(gallery._id)
            if(data != null && data != undefined) {
                setComments(data)
            }
        }   
        fetchData()
    }

    function clickEmoji(e) {
        setComment(comment + e.emoji)
    }


    function getPostInfo() {
        return (
            <div className="popupgallery-view-secondary">
                <div className="popupgallery-view-secondary-title">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img style={{width: "30px", borderRadius: "100px", marginRight: "15px"}} src={user.avatar} />
                        <h3>{user.name}</h3>
                    </div>
                    <i class="fas fa-ellipsis-h"/>
                </div>
                <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>

                <div>
                    <div style={{display: "flex", alignItems: "flex-start"}}>
                        <img style={{width: "30px", borderRadius: "100px", marginRight: "15px"}} src={user.avatar} />
                        <div style={{textAlign: "left"}}>
                            <h4>{user.name}</h4>
                            <p style={{marginTop: "5px"}}>Esto es una descripción de una publicación</p>
                            <p style={{marginTop: "10px", color: "lightgray", fontSize: "12px"}}>1 día</p>
                        </div>                            
                    </div>
                </div>



                <div className="popupgallery-view-secondary-comments-container">

                    {comments != null ? comments.map((comment) => <div className="popupgallery-view-secondary-comments-card">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img style={{width: "30px", borderRadius: "100px"}} src={comment.avatar} alt="" />
                            <div style={{display: "flex", alignItems: "center", marginLeft: "15px"}}>
                                <h4>{comment.name}</h4>
                                <p style={{marginLeft: "9px", fontSize: "14px", marginTop: "3px"}}>{comment.comment}</p>
                            </div>
                        </div>
                        <div style={{display: "flex", marginLeft: "45px"}}>
                            <p style={{fontSize: "13px", color: "lightgray"}}>{timeSince(comment.createdAt)}</p>
                            <p style={{fontSize: "13px", color: "lightgray", marginLeft: "10px", cursor: "pointer"}}>Responder</p>
                        </div>
                    </div>) : <ScaleLoader width={4} height={20} color="#f36197d7" />}

                </div>

                <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>

                <div className="popupgallery-view-secondary-icons">
                    {isLiked ? <i onClick={() => handleLike()} style={{fontSize: "22px", cursor: "pointer"}} class="fas fa-heart"/> : <i onClick={() => handleLike()} style={{fontSize: "22px", cursor: "pointer"}} class="far fa-heart"/>}
                    <i style={{fontSize: "22px", marginLeft: "10px", cursor: "pointer"}} class="far fa-comment"/>
                </div>

                <div style={{textAlign: "left", marginTop: "10px"}}>
                    <h4>{likes} Me gusta</h4>
                </div>

                <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>


                <div className="popupgallery-view-input-container">
                    <i onClick={() => onMouseEnterEmotes()} style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} class="fas fa-grin"/>
                    <input value={comment} onChange={(e) => setComment(e.target.value)} className="popupgallery-view-input" placeholder="Añade un comentario..." type="text" />
                    <i onClick={() => createComment()} style={{fontSize: "18px", cursor: "pointer"}} class="fas fa-chevron-right popupgallery-view-icon-publish"/>

                    {dropdownEmotes && <div style={{position: "absolute", zIndex: "1001", marginTop: "-350px"}}> 
                                    <EmojiPicker
                                        onEmojiClick={(e) => clickEmoji(e)}
                                        autoFocusSearch={false}
                                        theme={Theme.DARK}
                                        searchDisabled
                                        height={"300px"}
                                        width="300px"
                                        lazyLoadEmojis={true}
                                        previewConfig={{
                                            showPreview: false
                                        }}
                                    />
                                </div>}
                </div>

            </div>
        )
    }

    return (
        <div className='popupgallery-view-popup-body'>
            <div style={{width: "99%", position: "relative", top: "20px"}} className="usersettings-popup-close">
                <button onClick={closePopup}><i style={{fontSize: "28px"}} className="fas fa-times" /></button>
            </div>
            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                <div className={'popupgallery-view-popup-container'}>
                    
                    <div className="popupgallery-view-primary">
                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={image} />
                    </div>

                    {getPostInfo()}
                    
                </div>
            </div>
            

      </div>
    )

}