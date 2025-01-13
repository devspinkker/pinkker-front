import React, { useEffect, useState } from "react";

import "./App.css"

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { dispatchLogin, fetchUser, dispatchGetUser } from '../redux/actions/authAction'

import { fetchUsersOnline, dispatchGetAllStreamers } from "../redux/actions/streamersAction";

import { fetchServerInfo, dispatchGetServerInfo } from "../redux/actions/serverAction";

import AppRouter from "../router/Router";

import ExternalRouter from "../router/ExternalRouter";

import { checkSubscriptions } from "../services/suscribers";
import { trackReferral } from "../helpers/RegisterPage";

const App = () => {

  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  const { isLogged } = auth;
  console.log('isLogged', isLogged)
  const [expanded, setExpanded] = useState(true);

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }


  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    trackReferral()
  }, [])


  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    const token = localStorage.getItem('token')

    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post(process.env.REACT_APP_DEV_API_URL + '/user/refresh_token?rf_token=' + token, null)
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_token })
      }
      getToken()
    }
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin())

        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  }, [token, dispatch])

  useEffect(() => {
    if (token) {
      const getUser = () => {
        return fetchUsersOnline(token).then(res => {
          dispatch(dispatchGetAllStreamers(res))
        })
      }
      getUser()
    }
  }, [token, dispatch])

  useEffect(() => {
    if (token) {
      const getUser = () => {
        return fetchServerInfo(token).then(res => {
          dispatch(dispatchGetServerInfo(res))
        })
      }
      getUser()
    }
  }, [token, dispatch])

  /* useEffect(() => {
     if(token){
       const checkSubs = async () => {
         const data =  await checkSubscriptions(token);
         if(data != null && data != undefined) {
           console.log(data)
         }
       }
       checkSubs()
     }
   }, [token])*/



  function toggleExpanded() {
    setExpanded(!expanded)
  }



  return (
    <div className="App" style={{ background: "#080808" }}>
      <ExternalRouter />
      <AppRouter />
    </div>


  );
}

export default App;
