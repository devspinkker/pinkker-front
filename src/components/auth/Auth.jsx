import React, {useState, useEffect} from "react"

import axios from "axios"
import {useSelector, useDispatch} from 'react-redux'
import {dispatchLogin} from '../../redux/actions/authAction'
import { Link, useHistory, useLocation } from 'react-router-dom'

import "./Auth.css"

import { isEmpty, isEmail, isLength, isMatch, isUsernameLength, isAlphaNumeric, isSpecial } from "../../utils/validation/Validation"
import ReCAPTCHA from "react-google-recaptcha";

import { useNotification } from "../Notifications/NotificationProvider"

import ChangeLooks from "../../metaverse/changelooks/ChangeLooks"

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function Auth({ isMobile, closePopup, typeDefault }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation();

    const [type, setType] = useState(typeDefault)
    const [catcha, setCatcha] = useState(false);
    const [userIp, setUserIp] = useState(null);

    const[rUsername, setrUsername] = useState(null);
    const[rPassword, setrPassword] = useState(null);
    const[rConfirmPassword, setrConfirmPassword] = useState(null);
    const[rEmail, setrEmail] = useState(null);
    const[rDay, setrDay] = useState(null);
    const[rMonth, setrMonth] = useState(null);
    const[rYear, setrYear] = useState(null);

    const[lUsername, setlUsername] = useState(null);
    const[lPassword, setlPassword] = useState(null);

    const [step, setStep] = useState(0);

    const [gender, setGender] = useState(null);

    const [countryInfo, setCountryInfo] = useState(null);

    const [recuperyMail, setRecuperyMail] = useState(null);

    const alert = useNotification();

    function onChange(value) {
        if (value === null) setCatcha(false);
        if (value != null) setCatcha(true);
    }

    useEffect(() => {
        const fetchData = async () => { 

            //Get user IP
            const res = await axios.get("https://api.ipify.org/?format=json")
            if(res.data != null && res.data != undefined) {
                setUserIp(res.data.ip)

                const res2 = await axios.get(`https://ipapi.co/${res.data.ip}/json/`)
                if(res2.data != null && res2.data != undefined) {
                    setCountryInfo(res2.data)
                }  
            }
        }
        fetchData();

    },[])

    async function handleSubmit() {
        if(type === 0) {
            /*if(catcha === false) {
                alert({type: "ERROR", message: "Completa el CAPTCHA"})
                return;
            }*/
            try {
                const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/user/login`, {username: lUsername, password: lPassword})
                if(res.data != null && res.data.msg != null) {
                    localStorage.setItem('firstLogin', true)
                    localStorage.setItem('token', res.data.token)

    
                    dispatch(dispatchLogin())
                    history.push("/")
                    closePopup();
                }
    
              
    
            } catch (err) {
                if(err.response != null && err.response != undefined) {
                    alert({type: "ERROR", message: err.response.data.msg})
                }
            }
        }

        if(type === 1) {
            
            if(isEmpty(rUsername) || isEmpty(rPassword)) return alert({type: "ERROR", message: "Please fill in all fields."})
            if(!isEmail(rEmail))return alert({type: "ERROR", message: "Invalid emails."})

            if(isLength(rPassword)) return alert({type: "ERROR", message: "Password must be at least 6 characters."})
            if(!isMatch(rPassword, rConfirmPassword)) return alert({type: "ERROR", message: "Password did not match."})
            /*if(catcha === false) {
                alert({type: "ERROR", message: "Completa el CAPTCHA"})
                return;
            }*/

            if(rMonth === "null" && rMonth === null) return alert({type: "ERROR", message: "Completa el mes"})
            if(rDay === "null" && rDay === null) return alert({type: "ERROR", message: "Completa el dia"})
            if(rYear === "null" && rYear === null) return alert({type: "ERROR", message: "Completa el año"})

            

            try {
                const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/user/register`, {name: rUsername, email: rEmail, password: rPassword, userIp, countryInfo, day: rDay, month: rMonth, year: rYear, gender: gender})
                if(res.data != null && res.data.msg != null) {
                    alert({type: "SUCCESS", message: res.data.msg})
                    localStorage.setItem('firstLogin', true)
                    setStep(1)
                }
                
            } catch (err) {
                alert({type: "ERROR", message: err.response.data.msg})
            }

        }

        if(type === 2) {

            if(isEmpty(recuperyMail)) return alert({type: "ERROR", message: "Please fill in all fields."})
            if(!isEmail(recuperyMail))return alert({type: "ERROR", message: "Invalid emails."})


            try {
                const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/user/forgot`, {email: recuperyMail})
                if(res.data != null && res.data.msg != null) {
                    alert({type: "SUCCESS", message: res.data.msg})
                    setStep(2)
                }
                
            } catch (err) {
                alert({type: "ERROR", message: err.response.data.msg})
            }
        }
        

    }


    const onKeyPressInput = (e) => {
        if(e.key === "Enter") {
          e.preventDefault();
    
          handleSubmit();
        }
    
    }


    const [errorUserName, setErrorUsername] = useState(null)
    const [errorPassword, setErrorPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)

    function onChangeUserName(e) {
        if(isEmpty(e)) {
            setErrorUsername("*Selecciona un nombre de usuario")  
            return;}
        if(isUsernameLength(e)) {setErrorUsername("*Los nombres de usuario deben tener entre 3 y 15 caracteres.")  
        return;}

        if(!isSpecial(e)) {setErrorUsername("*Los nombres de usuario solo pueden contener caracteres alfanuméricos.") 
        return;}
        setErrorUsername("")
        setrUsername(e)
    }

    function onChangePassword(e) {
        if(isEmpty(e)) {setErrorPassword("*Selecciona una contraseña")  
            return;}
        if(isLength(e)) {setErrorPassword("*La contraseña debe tener al menos 8 caracteres.")  
            return;}

        setErrorPassword("")
        setrPassword(e)
    }

    function onChangeConfirmPassword(e) {
        if(isEmpty(e)) {setErrorConfirmPassword("*Selecciona una contraseña")  
            return;}
        if(isLength(e)) {setErrorConfirmPassword("*La contraseña debe tener al menos 8 caracteres.")  
            return;}
        if(!isMatch(rPassword,e)) {setErrorConfirmPassword("*Las contraseñas no coinciden. Inténtalo de nuevo")  
            return;}    

        setErrorConfirmPassword("")
        setrConfirmPassword(e)
    }

    function onChangeEmail(e) {
        if(isEmpty(e)) {setErrorEmail("*Selecciona una contraseña")  
            return;}
        if(!isEmail(e)) {setErrorEmail("*El email no es válido.") 
            return;}

        setErrorEmail("")
        setrEmail(e)
    }
    
    


    function getType() {
        if(type === 0) {
            return (
                <div className="auth-content">
                    <div className="auth-content-input">
                        <p>Nombre de usuario</p>
                        <input id="identifierId" onChange={(e) => setlUsername(e.target.value)} type="text" />
                    </div>
                    <div className="auth-content-input">
                        <p>Contraseña</p>
                        <input onChange={(e) => setlPassword(e.target.value)} type="password" />
                    </div>

                    <a onClick={() => setType(2)}><p className="" style={{fontSize: "12px", margin: "10px auto", color: "#ff64b0", cursor: "pointer"}}> <span>¿Tienes problemas para iniciar sesión?</span></p></a>
                    
                    {/*<div style={{marginTop: "5px", marginBottom: "10px"}}>
                        <ReCAPTCHA
                            size="normal"
                            sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY}
                            onChange={onChange}
                        />
            </div>*/}
                    
                    <button onClick={() => handleSubmit()} className="auth-button-login">Iniciar Sesión</button>

                </div>
            )
        }
        if(type === 1 && step === 0) {
            return (
                <div className="auth-content">

                    <div className="auth-content-input">
                        <p>Nombre de usuario {errorUserName != null && errorUserName != "" && <i style={{color: "#EB0400", marginLeft: "109px"}} class="fas fa-exclamation-circle"/>} {errorUserName === "" && <i style={{color: "lightgreen", marginLeft: "109px"}} class="fas fa-check-circle"/>}</p>
                        <input className={errorUserName != null && errorUserName != "" && "input-error"} onChange={(e) => onChangeUserName(e.target.value)} type="text" />
                        <p style={{fontSize: "10px", color: "rgb(228, 122, 122)", marginTop: "5px"}}>{errorUserName}</p>
                    </div>
                    <div className="auth-content-input">
                        <p>Contraseña {errorPassword != null && errorPassword != "" && <i style={{color: "#EB0400", marginLeft: "159px"}} class="fas fa-exclamation-circle"/>} {errorPassword === "" && <i style={{color: "lightgreen", marginLeft: "159px"}} class="fas fa-check-circle"/>}</p>
                        <input className={errorPassword != null && errorPassword != "" && "input-error"} onChange={(e) => onChangePassword(e.target.value)} type="password" />
                        <p style={{fontSize: "10px", color: "rgb(228, 122, 122)", marginTop: "5px"}}>{errorPassword}</p>

                    </div>
                    <div className="auth-content-input">
                        <p>Confirmar contraseña {errorConfirmPassword != null && errorConfirmPassword != "" && <i style={{color: "#EB0400", marginLeft: "83px"}} class="fas fa-exclamation-circle"/>} {errorConfirmPassword === "" && <i style={{color: "lightgreen", marginLeft: "83px"}} class="fas fa-check-circle"/>}</p>
                        <input className={errorConfirmPassword != null && errorConfirmPassword != "" && "input-error"} onChange={(e) => onChangeConfirmPassword(e.target.value)} type="password" />
                        <p style={{fontSize: "10px", color: "rgb(228, 122, 122)", marginTop: "5px"}}>{errorConfirmPassword}</p>

                    </div>
                    <div className="auth-content-input">
                        <p>Correo electrónico {errorEmail != null && errorEmail != "" && <i style={{color: "#EB0400", marginLeft: "109px"}} class="fas fa-exclamation-circle"/>} {errorEmail === "" && <i style={{color: "lightgreen", marginLeft: "109px"}} class="fas fa-check-circle"/>}</p>
                        <input className={errorEmail != null && errorEmail != "" && "input-error"} onChange={(e) => onChangeEmail(e.target.value)} type="text" />
                        <p style={{fontSize: "10px", color: "rgb(228, 122, 122)", marginTop: "5px"}}>{errorEmail}</p>

                    </div>
                    <div className="auth-content-input">
                        <p>Fecha de nacimiento</p>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <input onChange={(e) => setrDay(e.target.value)} style={{marginRight: "2px"}} placeholder="Día" type="number" />
                            <select onChange={(e) => setrMonth(e.target.value)} defaultValue="0">
                                <option value="null">Mes</option>
                                <option value="0">Enero</option>
                                <option value="1">Febrero</option>
                                <option value="2">Marzo</option>
                                <option value="3">Abril</option>
                                <option value="4">Mayo</option>
                                <option value="5">Junio</option>
                                <option value="6">Julio</option>
                                <option value="7">Agosto</option>
                                <option value="8">Septiembre</option>
                                <option value="9">Octubre</option>
                                <option value="10">Noviembre</option>
                                <option value="11">Diciembre</option>
                            </select>
                            <input onChange={(e) => setrYear(e.target.value)}  style={{marginLeft: "2px"}}placeholder="Año" type="number" />
                        </div>
                    </div>
                    <div className="auth-text">
                        <p className="" style={{fontSize: "11px", margin: "10px auto"}}>Al hacer clic en Registrarse, indicas que has leído y aceptas los <br /> <a style={{color: "#ff64b0", cursor: "pointer"}}>Términos del servicio</a> y el <a style={{color: "#ff64b0", cursor: "pointer"}}>Aviso de privacidad.</a></p>
                    </div>
                    {/*<div style={{marginTop: "5px", marginBottom: "10px"}}>
                        <ReCAPTCHA
                            size="normal"
                            sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY}
                            onChange={onChange}
                        />
            </div>*/}
                    <button onClick={() => handleSubmit()} className="auth-button-login">Registrarse</button>
                    {/*<button onClick={() => setStep(1)} className="auth-button-login">Siguiente paso</button>*/}
                </div>
            )
        }


        if(type === 1 && step === 1) {
            return (
                <div className="auth-content">


                    <div style={{textAlign: "left", marginTop: "30px"}} className="auth-text">
                        <h3>¡Felicitaciones!</h3>
                        <p>Estas a un paso de tener tu cuenta.</p>
                    </div>
                    

                    <div className="auth-changelook-container">
                        <img style={{width: "150px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"/>
                    </div>
                    
                    <div style={{textAlign: "center", marginTop: "30px"}} className="auth-text">
                        <h3>¡Verifica tu mail!</h3>
                        <p>Te enviamos un mail a tu correo electronico para verificar tu cuenta</p>

                    </div>
                    <button onClick={() => closePopup()} style={{marginTop: "50px"}} className="auth-button-login">Cerrar</button>

                   
                </div>
            )
        }

        if(type === 2 && step === 0) {
            return (
                <div className="auth-content">
                    <div className="auth-content-input">
                        <p>Email</p>
                        <input id="identifierId" onChange={(e) => setRecuperyMail(e.target.value)} type="text" />
                    </div>

                    <button onClick={() => handleSubmit()} className="auth-button-login">Enviar Correo</button>

                </div>
            )
        }

        if(type === 2 && step === 2) {
            return (
                <div className="auth-content">


                    <div style={{textAlign: "left", marginTop: "30px"}} className="auth-text">
                        <h3>¡Felicitaciones!</h3>
                        <p>Estas a un paso de tener tu cuenta.</p>
                    </div>
                    

                    <div className="auth-changelook-container">
                        <img style={{width: "150px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"/>
                    </div>
                    
                    <div style={{textAlign: "center", marginTop: "30px"}} className="auth-text">
                        <h3>¡Verifica tu mail!</h3>
                        <p>Te enviamos un mail a tu correo electronico para verificar tu cuenta</p>

                    </div>
                    <button onClick={() => closePopup()} style={{marginTop: "50px"}} className="auth-button-login">Cerrar</button>

                   
                </div>
            )
        }

    }


    


    return (
        <div className='auth-body'>
            
            <div onKeyPress={(event) => onKeyPressInput(event)} className={type === 0 ? 'auth-container' : 'auth-container-type1'}>
                <div className="auth-close">
                    <button  className="pinkker-button-more" onClick={closePopup}><i style={{fontSize: isMobile && "20px"}} class="fas fa-times"/></button>
                </div>
                <div style={{width: "100%"}}>
                    { type === 0 ? <h3 style={{color: "#ededed", marginBottom: "30px", display: "flex", alignItems: "center"}}> <img style={{width: "50px"}} src="/images/pinkker.png" alt="" /> Iniciar sesión en Pinkker</h3> : <h3 style={{color: "#ededed", marginBottom: "30px", display: "flex", alignItems: "center"}}><img style={{width: "50px"}} src="/images/pinkker.png" alt="" /> Registrarse en Pinkker</h3> }

                    <div className="auth-title">
                        <div onClick={() => setType(0)} className={ type === 0 ? "auth-title-card active" : "auth-title-card"}>
                            <h6 style={{color: "#ededed"}}>Login</h6>
                        </div>
                        <div onClick={() => setType(1)}  className={ type === 1 ? "auth-title-card active" : "auth-title-card"}>
                            <h6  style={{color: "#ededed"}}>Register</h6>
                        </div>
                        
                    </div>

                    {getType()}
                </div>
            </div>

            <div className={type === 0 ? 'auth-info' : 'auth-info-type1'}>
                <div style={{width: "100%", height: "50%"}}>
                   <div style={{color: "#ededed", display: "flex", alignItems: "center", justifyContent: "center", height: type === 0 ? "300px" : "500px"}}>
                        <div>
                            <h5>Tu billete a Memelandia</h5>
                            <p style={{fontSize: "12px", color: "darkgray", marginTop: "20px"}}>Ya sabes lo que dicen... <br /> Los amigos que hacen memes juntos, transmiten juntos.</p>
                            <p style={{fontSize: "12px", color: "darkgray", marginTop: "20px"}}>👈👈👈 <br /> ¡Cree una cuenta para unirte a la conversación!</p>
     
                        </div>
                       
                   </div>
                </div>
            </div>
      </div>
    )
}