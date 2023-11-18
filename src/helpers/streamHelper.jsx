const existsRecientsChannel = () => {
    const recientsChannel = localStorage.getItem('recientsChannel');
    if (recientsChannel) {
        return true;
    } else {
        return false;
    }
}

//Exits channel name in recientsChannel
const existsRecientsChannelName = (channelName) => {
    const recientsChannel = getRecientsChannel();
    if (recientsChannel.length > 0) {
        for (let i = 0; i < recientsChannel.length; i++) {
            if (recientsChannel[i].streamer === channelName) {
                return true;
            }
        }
    }
    return false;
}

const getRecientsChannel = () => {
    const recientsChannel = localStorage.getItem('recientsChannel');
    if (recientsChannel) {
        return JSON.parse(recientsChannel);
    } else {
        return [];
    }
}

const addRecientsChannel = (channel) => {
    const recientsChannel = getRecientsChannel();
    if (recientsChannel.length < 6) {
        recientsChannel.push(channel);
        localStorage.setItem('recientsChannel', JSON.stringify(recientsChannel));
    } else {
        recientsChannel.shift();
        recientsChannel.push(channel);
        localStorage.setItem('recientsChannel', JSON.stringify(recientsChannel));
    }
}


export {
    existsRecientsChannel,
    getRecientsChannel,
    addRecientsChannel,
    existsRecientsChannelName
}