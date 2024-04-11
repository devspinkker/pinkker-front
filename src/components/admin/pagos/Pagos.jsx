import React, {useState, useEffect} from "react"

import "./Pagos.css"

import { useSelector } from "react-redux"

import { ScaleLoader } from "react-spinners"

import { getAllPagos } from "../../../services/purchase"

import { Link } from "react-router-dom"


export default function Pagos() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    function formatNumbersWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [pagos, setPagos] = useState(null)
    
    const [showWithdraw, setShowWithdraw] = useState(false)

    const openWithdraw = () => {
        setShowWithdraw(!showWithdraw)
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPagos(token)
            if(data != null && data != undefined) {
                setPagos(data)
            }
        }

        fetchData()
    }, [token])

    function getStatus(status) {
        if(status === 0) {
            return <h4 style={{color: "yellow"}}>Pendiente</h4>
        }
        if(status === 1) {
            return <h4 style={{color: "lightgreen"}}>Exitoso</h4>
        }
        if(status === 2) {
            return <h4 style={{color: "red"}}>Fallo</h4>
        }
    }

    function formatDate(date) {
        var date = new Date(date);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        return day + "/" + month + "/" + year;
    }

    return (
        <div className="adminpagos-body">
            <div className="adminpagos-container">
                <div style={{width: "100%", height: "50px"}} />
                <div className="adminpagos-balance">
                    <h2 style={{color: "white"}}>Balance de Pinkker</h2>
                    <div style={{width: "100%", marginTop: "20px", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px"}}>
                        
                        <div > 
                            <div style={{display: "flex", alignItems: "center"}}>
                                <h1 style={{color: "white", marginRight: "10px"}}>${formatNumbersWithCommas(4000)}</h1>
                                <a style={{fontSize: "18px", fontWeight: "800", color: "darkgray"}}>(Total facturado en 30d)</a>
                            </div>
                        
                        </div>
                        <button className="adminpagos-balance-button">Retirar fondos</button>
                    </div>
                </div>

                <div className="adminpagos-history">
                    <h2 style={{color: "#ededed"}}>Historial de pagos</h2>
                    <div style={{width: "100%", marginTop: "20px", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>

                    <div className="adminpagos-history-card-container">
                        <div style={{display: "flex", alignItems: "center", color: "#ededed", fontWeight: "600"}}>
                            <p style={{width: "20%"}}>Username</p>
                            <p style={{width: "7%"}}>Divisa</p>
                            <p style={{width: "20%"}}>Payment ID</p>
                            <p style={{width: "10%"}}>Monto</p>
                            <p style={{width: "20%"}}>Fecha</p>
                            <p style={{width: "10%"}}>Metodo</p>
                        </div>

                        {pagos != null ? pagos.map((withdraw, index) => <div className="adminpagos-history-card">
                            <div className="adminpagos-history-card-name">
                                <Link style={{textDecoration: "none"}} to={"/" + withdraw.name}><h4 style={{display: "flex", color: "#ededed", alignItems: "center"}}> <img style={{width: "25px", borderRadius: "50px", marginRight: "5px", marginLeft: "5px"}} src={withdraw.avatar}/> {withdraw.name}</h4></Link>
                            </div>

                            <div className="adminpagos-history-card-destino">
                                <h4>{withdraw.divisa}</h4>
                            </div>
                            <div className="adminpagos-history-card-amount">
                                <h4>{withdraw.payment_id}</h4>
                            </div>

                            <div className="adminpagos-history-card-status">
                                <h4 style={{display: "flex", alignItems: "center"}}>{withdraw.amount} <img style={{width: "20px", marginLeft: "5px"}} src="/images/pixel.png"/></h4>
                            </div>
                            <div className="adminpagos-history-card-date">
                                <h4>{formatDate(withdraw.createdAt)}</h4>
                            </div>

                            <div className="adminpagos-history-card-method">
                                <h4>{withdraw.payment_type === "MP" ? <img style={{width: "30px"}} src="/images/mp.png"/> : <img style={{width: "30px"}} src="/images/paypal.png"/>}</h4>
                            </div>
                        </div>) : <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}><ScaleLoader color="#f36197d7" /></div>}
                    </div>
                </div>
            </div>
        </div>
    )
}