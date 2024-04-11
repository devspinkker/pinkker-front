export default function getIdentityEmblem(user, streamer) {
    if(user.name === streamer) {
      return (<i style={{backgroundColor: "rgb(110, 0, 0)", color: "white", padding: "3px", borderRadius: "3px", fontSize: "12px"}} class="fas fa-user-shield"></i>)
    }
    
}