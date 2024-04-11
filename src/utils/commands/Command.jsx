






export const ClearCommand = async (socket, callback) => {
    socket.emit("clearChat", () => setMessage(""));
}