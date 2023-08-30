import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Friends.css';


import {useSelector} from 'react-redux'

import { Link } from 'react-router-dom';

import { getNotificationsFriends } from '../../../services/notifications';
import { ScaleLoader } from "react-spinners"
import { follow, unfollow } from "../../../services/follow"

import { useNotification } from '../../Notifications/NotificationProvider';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useHistory } from 'react-router';

function useOnClickOutside(ref, handler) {
      useEffect(() => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
    
          handler(event);
        };
    
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
    
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      }, [ref, handler]);
    }

function DropdownFriends( { closeNavbar, isMobile } ) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

  const [notifications, setNotifications] = useState(null);

  const [followParamUsers, setFollowParamUsers] = useState([]);

  const alert = useNotification()
  const routerHistory = useHistory();

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsFriends(token, page, 7);
      if(data != null && data != undefined) {
        let userFollow = [];
        await data.data.forEach(notification => {
          userFollow.push({target: notification.target, follow: getIfUserFollow(notification.target), name: notification.name});
        })
        setFollowParamUsers(userFollow);
        setHasMore(data.hasMore)
        setNotifications(data.data);
        
      }
    }
    fetchData();
    
  }, [token])

  /*useEffect(() => {
    if(token != null && token != undefined && token != "") {
        const fetchData = async () => {
          const data = await getNotificationsFriends(token, page, 7);
          if(data != null && data != undefined) {
              setNotifications((prev) => {
                   
                    
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
  }, [page])*/
  

  async function followUser(streamer) {
      const data =  await follow(token, streamer);
      if(data != null) {
          const followParamUsersCopy = [...followParamUsers];
          const index = followParamUsersCopy.findIndex(followParamUser => followParamUser.name === streamer);
          followParamUsersCopy[index].follow = true;
          setFollowParamUsers(followParamUsersCopy);
      } else {
          alert({type: "ERROR", message: "Ocurrió un error al seguir al usuario"})
      }
  }

  

  async function unfollowUser(streamer) {
    const data =  await unfollow(token, streamer);
    if(data != null) {
        const followParamUsersCopy = [...followParamUsers];
        const index = followParamUsersCopy.findIndex(followParamUser => followParamUser.name === streamer);
        followParamUsersCopy[index].follow = false;
        setFollowParamUsers(followParamUsersCopy);
    } else {
        alert({type: "ERROR", message: "Ocurrió un error al dejar de seguir al usuario"})
    }
  }


  function dateStringSince(dateString) {

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % day) / (1000 * 60));
    const seconds = Math.floor((diff % day) / 1000);
    if(days > 0) {
      return days + " d";
    } else if(hours > 0) {
      return hours + " h";
    } else if(minutes > 0) {
      return minutes + " min";
    } else if(seconds > 0) {
      return seconds + " sec";
    } else {
      return "just now";
    }
  }


  function getIfUserFollow(streamer) {
    if(user.following.includes(streamer)) {
      return true;
    } else {
      return false;
    }
  }

  function getButtonFollow(notification) {

    const followParam = followParamUsers.find(followParamUser => followParamUser.target === notification.target);


    if(followParam.follow === false) {
        return (
          <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Empezar a seguir</h1>}>
              <button onClick={() => followUser(notification.name)} style={{marginLeft: "5px", marginTop: "0px"}} className="channel-bottom-v2-button-follow">Seguir</button>    
          </Tippy>
        )
    } else {
        return (
          <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Dejar de seguir</h1>}>
              <button style={{width: "100px", marginLeft: "5px", marginRight: "5px", backgroundColor: nameD === "Siguiendo" && "#762543"}} onMouseEnter={() => setNameD("Dejar de seguir")} onMouseLeave={() => setNameD("Siguiendo")} onClick={() => unfollowUser(notification.name)} className="followerscard-button-unfollow">{nameD}</button>
          </Tippy>
        )
    }
  }

  const [nameD, setNameD] = useState("Siguiendo");
  const [nameHover, setNameHover] = useState(false);

  function onClickChangeRoute(text) {
    routerHistory.push(text);

  }


  const getCardFromType = (notification) => {

    if(notification.type === 0) {
        return (
            <li style={{padding: "0px", paddingLeft: "5px"}}>
              <div className='dropdownfriends-news-card'>
                <div style={{width: "45px", position: "relative"}} className='navbar-image-avatar-container'>
                  <div style={{backgroundColor: "transparent", width: "25px"}} className='navbar-image-avatar'>
                    <a style={{cursor: "pointer"}} onClick={() => onClickChangeRoute('/' + notification.name)}><img style={{backgroundColor: "#080809", width: "30px", height: "30px"}} src={notification.avatar} alt="" /></a>
                  </div>
                </div>

                <div style={{display: "flex", alignItems: "center", width: "65%"}}>
                    <h3><a onClick={() => onClickChangeRoute('/' + notification.name)} onMouseEnter={() => setNameHover(true)} onMouseLeave={() => setNameHover(false)} style={{color: "white", fontSize: isMobile ? "16px" : "12px", fontWeight: "800", textDecoration: "none", cursor: "pointer", filter: nameHover && "brightness(69%)"}}>{notification.name}</a> <a style={{color: "white", fontWeight: "400", fontSize: isMobile ? "15px" : "12px"}}>ha comenzado a seguirte.</a> <a style={{color: "darkgray", fontSize: "12px"}}> {dateStringSince(notification.createdAt)}</a></h3>
                </div>

                <div>
                  {getButtonFollow(notification)}
                </div>

              </div>
            </li>           
        )
    }

    if(notification.type === 1) {
        return (
            <li style={{padding: "5px"}}>
              <div className='dropdownfriends-news-card'>
                <div style={{width: "45px", position: "relative"}} className='navbar-image-avatar-container'>
                  <div style={{backgroundColor: "transparent", width: "35px"}} className='navbar-image-avatar'>
                    <a href={'/' + notification.target}><img style={{backgroundColor: "#080809", width: "35px"}} src={notification.avatar} alt="" /></a>
                  </div>
                </div>



                <div style={{marginLeft: "5px", display: "flex", alignItems: "center", width: "65%"}}>
                    <h3><a href={'/' + notification.name} target='_blank' style={{color: "#ededed", fontSize: isMobile ? "16px" : "12px", textDecoration: "none"}}>{notification.name}</a> <a style={{color: "lightgray", fontSize: isMobile ? "15px" : "12px"}}>ha comenzado a seguirte.</a> <a style={{color: "darkgray", fontSize: "12px"}}>{dateStringSince(notification.createdAt)}</a></h3>
                </div>

                {/*<div >
                  <button onClick={() => followUser(notification.target)} className="dropdownfriends-button-follow">Seguir</button>
        </div>*/}
              </div>
            </li>           
        )
    }
    
  }


  return (
    <>
      <ul onScrollCapture={(e) => console.log(e)} ref={divRef} className={click ? 'dropdownfriends-menu clicked' : 'dropdownfriends-menu'}>

        <div style={{width: "99%"}} className="dropdowncomunidad-container">

            <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center", height: "15px"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Seguidores</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", fontSize: "15px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div> 



              {notifications != null && notifications.length > 0 &&  notifications.map((message) => getCardFromType(message))}
              {notifications === null && <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <ScaleLoader width={4} height={20} color="#f36197d7" />
                  </div>}

              {notifications != null && notifications.length === 0 && <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <img style={{width: "125px"}} src="/images/no-seguidores.png" />
                  </div>}
            

          </div>
      </ul>
    </>
  );
}

export default DropdownFriends;