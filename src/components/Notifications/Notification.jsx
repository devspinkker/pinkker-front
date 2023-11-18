import React, { useState } from "react";

import "./Notification.css"

const Notification = props => {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth(prev => {
        if (prev < 100) {
          return prev + 0.5;
        }

        clearInterval(id);
        return prev;
      });
    }, 20);

    setIntervalID(id);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalID);
  };

  const handleCloseNotification = () => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id
      })
    }, 100)
  };

  React.useEffect(() => {
    if (width === 100) {
      // Close notification
      handleCloseNotification()
    }
  }, [width])

  React.useEffect(() => {
    handleStartTimer();
  }, []);

  function obtenerNotification() {
    if (props.type === "SUCCESS") {
      return (
        <div className={"notification-wrapper"} >
          <div onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer} className={`notification-success success`}>

              <div style={{display: "flex", alignItems: "center"}}>
                    <div className="notification-icon">
                    <i style={{color: "lightgreen", fontSize: "18px"}} class="fas fa-check-circle"></i>
                    </div>
                    <div className="notification-text">
                    <h4 style={{letterSpacing: "2px"}}>¡Bien!</h4>
                    <p style={{fontSize: "12px", marginTop: "5px"}}>{props.message}</p>
                    </div>

              </div>

            

          </div>

          <div className={"bar"} style={{ width: `calc(${width}% - 24px)` }} />


        </div>
        
      )
    }

    if (props.type === "ERROR") {
      return (
        <div className={"notification-wrapper"} >
          <div onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer} className={`notification-error error`}>

              <div style={{display: "flex", alignItems: "center"}}>
                    <div className="notification-icon">
                    <i style={{color: "#AE0026", fontSize: "18px"}} class="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="notification-text">
                    <h4 style={{letterSpacing: "2px"}}>¡Error!</h4>
                    <p style={{fontSize: "12px", marginTop: "5px"}}>{props.message}</p>
                    </div>

              </div>

            

          </div>

          <div className={"bar-error"} style={{ width: `calc(${width}% - 24px)` }} />


        </div>
        
      )
    }

    if (props.type === "MONSTER") {
      return (
        <div className="notification-monster">
            <div onMouseEnter={handlePauseTimer} onMouseLeave={handlePauseTimer} className={`notification-monster-success`}>
                <div className="notification-monster-close">
                    <i style={{width: "98%", color: "#ededed"}} onClick={() => handleCloseNotification()} class="fas fa-times"></i>
                </div>
                <div className="notification-monster-nft">
                    <img style={{maxWidth: "40%"}} src={props.nftImage} />
                    <h2 style={{color: "fuchsia"}}>Successful!</h2>
                    <h3>Check our Inventory</h3>
                </div>
            </div>
        </div>
       
      )
    }

    if (props.type === "INFO") {
      return (
        <div className={"notification-wrapper"} >
        <div onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer} className={`notification-info info`}>
          <div className="notification-text-info">
            <h3>INFO</h3>
            <p style={{color: "fuchsia"}}>{props.message}</p>
            <div className={"bar"} style={{ width: `${width}%` }} />
          </div>
          
        </div>
      </div>
      )
    }

    if (props.type === "WAIT") {
      return (
        <div className={"notification-wrapper"}>
            <div onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer} className={`notification-wait wait`}>
              <div className="notification-icon">
              <img className="notification-img" src="/images/logo-str.png" alt="" />
              </div>
              <div className="notification-text">
                <h3>Wait One Moment</h3>
                <p>{props.message}</p>
                <div className={"bar"} style={{ width: `${width}%` }} />
              </div>
            </div>
        </div>
      )
    }
  }

  return (
    <div>
      {obtenerNotification()}
    </div>
  );
};

export default Notification;