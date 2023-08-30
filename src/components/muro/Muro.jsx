import React, {useState, useEffect} from "react"

import "./Muro.css"

import TweetCard from "./tweet/TweetCard"

import { createTweet, getTweetFollowing, getUserFollow } from "../../services/tweet"

import { useNotification } from "../Notifications/NotificationProvider"

import { useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"

import { FileUploader } from "react-drag-drop-files";

import axios from "axios"

import DropdownEmotes from "../channel/chat/dropdown/emotes/DropdownEmotes"

import Auth from "../auth/Auth"
import { render } from "react-dom"

import { follow, unfollow } from "../../services/follow"
import FollowCard from "./FollowCard"

import EmojiPicker, { Theme } from "emoji-picker-react";

export default function Muro({isMobile}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const alert = useNotification();

    const [tweets, setTweets] = useState([])
    const [message, setMessage] = useState("")
    
    const fileTypes = ["JPG", "PNG", "GIF"];

    const [onDrag, setOnDrag] = useState(false);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(null);

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    const [newTweets, setNewTweets] = useState(true)

    const [dropdownEmotes, setDropdownEmotes] = useState(false);
    const [userFollows, setUserFollows] = useState(false);

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => {setIsLoading(false)}, 1500)


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    useEffect(() => {
        if(token != null && token != undefined && token != "") {
            const fetchData = async () => {
                const data = await getTweetFollowing(token, page, 4)
                if(data != null && data != undefined) {
            
                    setTweets(data.data);
                    setHasMore(data.hasMore)
                    setLoading(false);
                    setTimeout(() => {
                        setLoading(false)
                    }, 5000)

                }


                const dataUser = await getUserFollow(token);
                if(dataUser != null && dataUser != undefined) {
                    setUserFollows(dataUser.users)
                }

            }
            fetchData()
        }
    }, [token])


    


    useEffect(() => {
        if(token != null && token != undefined && token != "") {
            const fetchData = async () => {
                const data = await getTweetFollowing(token, page, 4)
                if(data != null && data != undefined) {
                    setTweets(async (prev) => {
                        

                        //Compare prev and data and delete duplicated tweets from data
                        for (var i = 0, len = prev.length; i < len; i++) {
                            for (var j = 0, len = data?.data?.length; j < len; j++) {
                                if(data?.data[j]?._id != null && data.data[j]?._id != undefined && data.data[j]?._id != "") {
                                    if (prev[i]?._id == data?.data[j]?._id) {
                                        data?.data?.splice(j, 1);
                                    }
                                }
                            }
                        }
                        


                        return [...prev, ...data.data];
                    });
                    setHasMore(data.hasMore)
                    setLoading(false);
                    setTimeout(() => {
                        setLoading(false)
                    }, 5000)
                }

            }
            fetchData()
        }
    }, [page])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [tweets]);

    const handleScroll = async () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setLoading(true);
            setPage((prev) => prev + 1);
        }
        
    };

    function reloadData() {
        setLoading(true);

        if(token != null && token != undefined && token != "") {
            const fetchData = async () => {
                const data = await getTweetFollowing(token, page, 4)
                if(data != null && data != undefined) {
                    setTweets((prev) => {
                       
                        
                        //Check if tweets is duplicated
                        for (var i = 0, len = data.data.length; i < len; i++) {
                            for (var j = 0, len = data.data.length; j < len; j++) {
                                if(data.data._id != null && data.data._id != undefined && data.data._id != "") {
                                    if (data.data[i]._id == data.data[j]._id) {
                                        data.data.splice(j, 1);
                                    }
                                }
                            }
                        }

                        //Get tweets and check if is duplicated
                        for (var i = 0, len = prev.length; i < len; i++) {
                            for (var j = 0, len = data.data.length; j < len; j++) {
                                if(data.data._id != null && data.data._id != undefined && data.data._id != "") {
                                    if (prev[i]._id == data.data[j]._id) {
                                        data.data.splice(j, 1);
                                    }
                                }
                            }
                        }
                        

                        return [...prev, ...data.data];
                    });                    setHasMore(data.hasMore)
                    setLoading(false)

                }
            }
            fetchData()
        }
    }

    const onMouseEnterEmotes = () => {
        if(dropdownEmotes === true) {
          setDropdownEmotes(false);
        } else{
          setDropdownEmotes(true);
        }
    };

    function handleNewTweets() {
        setNewTweets(false);
        //setTweets((prev) => { return [...prev, ...data.data]; })
        window.scrollTo(0, 0)
        reloadData();
    }

    async function handleSubmit() {
        if(message === "") return (alert({type: "ERROR", message: "Completa tu mensaje"}))

        if(image != null && file != null) {
            let formData =  new FormData()
            formData.append('file', file)

            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/api/upload_tweet_image`, formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            if(res.data != null) {
                setImageUploaded(res.data.image)
                const data = await createTweet(token, message, res.data.image, null)
                if(data != null && data != undefined) {
                    setMessage("")
                    removeImage()
                    alert({type: "SUCCESS", message: data.data.msg})
                    setDropdownEmotes(false)
                    reloadData()
                }
            } 


            
            return;
        }

        const data = await createTweet(token, message, null, null)
        if(data != null && data != undefined) {
            setMessage("")
            alert({type: "SUCCESS", message: data.data.msg})
            setDropdownEmotes(false)

            reloadData()
        }
    }

    const handleChange = (file) => {    
      setFile(file);  
      const reader = new FileReader();
      reader.addEventListener("loadend", () => {
        setImage(reader.result)
      });
      reader.readAsDataURL(file);
    };

    const handleChange2 = (e) => {  
        
        return alert({type: "ERROR", message: "Esta función esta desabilitada!"});

        var fileT = e.target.files[0];
        setFile(fileT)
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            setImage(reader.result)
        });
        reader.readAsDataURL(fileT);
    };

    function removeImage() {
        setFile(null)
        setOnDrag(false);
        setImage(null)
    }
    
    function clickEmoji(e) {
        setMessage(message + e.emoji)
    }


    function renderMuro() {
        if(isLogged) {
            return (
                <div className="muro-container">
                <div style={{width: isMobile ? "100%" : "70%"}}>
                    
                    <div onDragEnterCapture={() => setOnDrag(true)} /*onDragLeave={() => setOnDrag(false)}*/ className="muro-send-tweet">
                        
                        {/*<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <div onClick={() => handleNewTweets()} className="muro-new-messages">
                                <h3 style={{fontSize: "15px"}}>Nuevos posteos</h3>
                                <i style={{marginLeft: "5px", fontSize: "12px"}} class="fas fa-sync-alt"/>
                            </div>
            </div>*/}
                        
                        <div style={{display: "flex"}}>
                            <div className="tweetcard-avatar">
                                <img style={{width: "45px", borderRadius: "100px"}} src={user.avatar}/>
                            </div>
                            <div className="muro-send-tweet-input">
                                <textarea id="muro-textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Qué estás pensando?" type="text" />
                            </div>

                        </div>


                        {file != null && <div style={{textAlign: "center", display: "flex", justifyContent: "center"}}>
                            <i onClick={() => removeImage()} style={{color: "white", cursor: "pointer", height: "20px", width: "20px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px", position: "relative", left: "35px", top: "10px", padding: "5px", backgroundColor: "#303030"}} class="fas fa-times"/>
                            <img style={{maxWidth: "320px"}} src={image} />
                        </div>}

                        {onDrag && file === null && <FileUploader hoverTitle="Soltar aca" label="Subir archivo a tu publicación" multiple={false} classes="muro-drag-input" handleChange={handleChange} name="file" types={fileTypes} />}

                        <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px", width: "97%"}}>
                            <div style={{display: "flex", borderRadius: "50px"}}>
                                <div className="mure-send-tweet-icons-card" style={{width: "33px", height: "33px", borderRadius: "100px", display: "flex", marginTop: "20px", alignItems: "center", justifyContent: "center", marginRight: "5px"}}>
                                    <i style={{padding: "5px", color: "#ff4aa7d2", marginRight: "5px"}} class="fas fa-photo-video"/>
                                </div>
                                <input onChange={(e) => handleChange2(e)} style={{backgroundColor: "red", width: "30px", position: "absolute", marginTop: "25px", opacity: "0"}} type="file"/>
                                <div onClick={() => onMouseEnterEmotes()} className="mure-send-tweet-icons-card" style={{width: "33px", marginTop: "20px", height: "33px",borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "5px"}}>
                                    <i style={{padding: "5px", color: "#ff4aa7d2", marginRight: "5px"}} class="far fa-smile"/>
                                </div>
                                {dropdownEmotes && <div style={{position: "absolute", zIndex: "1001", marginTop: "60px"}}> 
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
                                {/*dropdownEmotes && <DropdownEmotes muro={true} clickEmoticon />*/}

                            </div>
                            <button onClick={() => handleSubmit()} className="muro-send-tweet-button">Publicar</button>
                        </div>
                        </div>
                        <div className="muro-tweet-container">
                            {/*<div style={{height: "60px", cursor: "pointer", width: "100%", borderTop: "1px solid #ffffff1a", borderBottom: "1px solid #ffffff1a", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <p style={{color: "#ff60b2"}}>10 nuevos posteos</p>
                            </div>*/}
                            {tweets != null && tweets?.map((tweet) => <TweetCard tweet={tweet}/>) }
                            {loading && <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <ScaleLoader width={4} height={20} color="#f36197d7" />
                            </div>}
                            {hasMore === false && loading === false && 
                                <div style={{textAlign: "center", marginTop: "20px"}}>
                                    <i style={{color: "white", fontSize: "44px"}} class="fas fa-check-circle"/>
                                    <h3 style={{color: "white", marginTop: "10px"}}>¡Parece que estas al día!</h3>
                                </div>
                            }
                        </div>
                </div>

                {!isMobile && <div className="muro-tweet-secondary">
                    <div className="muro-tweet-secondary-search">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <input  placeholder='Buscar en el muro..' type="search" />
                            <i style={{backgroundColor: "#131313", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "0px", borderLeft: "1px solid #202020", borderEndEndRadius: "5px", borderTopRightRadius: "5px"}} class="fas fa-search navbar-search-i"></i>
                        </div>
                    </div>

                    <div className="muro-tweet-secondary-tendency">
                        <h3>Tendencias</h3>
                        
                        <div className="muro-tweet-secondary-tendency-card">
                            <div>
                                <p style={{fontSize: "13px", color: "darkgray", marginBottom: "3px"}}>Tendencias</p>
                                <h3>Pinkker</h3>
                                <p style={{fontSize: "13px", color: "darkgray", marginTop: "3px"}}>8120 tweets</p>
                            </div>
                            <div>
                                <i style={{fontSize: "13px", color: "darkgray"}} class="fas fa-ellipsis-h"/>
                            </div>
                        </div>

                        <div className="muro-tweet-secondary-tendency-card">
                            <div>
                                <p style={{fontSize: "13px", color: "darkgray", marginBottom: "3px"}}>Tendencias</p>
                                <h3>DNG TEAM ?</h3>
                                <p style={{fontSize: "13px", color: "darkgray", marginTop: "3px"}}>1200 tweets</p>
                            </div>
                            <div>
                                <i style={{fontSize: "13px", color: "darkgray"}} class="fas fa-ellipsis-h"/>
                            </div>
                        </div>

                        <div className="muro-tweet-secondary-tendency-card">
                            <div>
                                <p style={{fontSize: "13px", color: "darkgray", marginBottom: "3px"}}>Tendencias</p>
                                <h3>El Dengue Volvió al Stream</h3>
                                <p style={{fontSize: "13px", color: "darkgray", marginTop: "3px"}}>12k tweets</p>
                            </div>
                            <div>
                                <i style={{fontSize: "13px", color: "darkgray"}} class="fas fa-ellipsis-h"/>
                            </div>
                        </div>

                        
                    </div>

                    <div className="muro-tweet-secondary-follow">
                        <h3>A quien seguir</h3>


                        {userFollows && userFollows.map((follow) => <FollowCard followData={follow}/>)}

                        
                    </div>
                </div>}
            </div>
            )
        } else {
            return (
                <Auth typeDefault={0}/>
            )
        }
    }


    return (
        <div className="muro-body">
            {isLoading === false && renderMuro()}
            {isLoading && <div style={{height: "800px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <ScaleLoader width={4} height={20} color="#f36197d7" />
            </div>}


            {/*<div style={{height: "800px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "200px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1679518300/pinkker-trabajando_ky0e2t.png"/>
                    <h1 style={{color: "white"}}>Estamos trabajando en esto... estará pronto!</h1>
                </div>
    </div>*/}
        </div>
    )
}