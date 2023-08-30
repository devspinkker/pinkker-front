const existsHistorySearch = () => {
    const historySearch = localStorage.getItem('historySearch');
    if (historySearch) {
        return true;
    } else {
        return false;
    }
}

//Exits channel name in recientsChannel
const existsHistoryChannelName = (channelName) => {
    const historySearch = getHistorySearch();
    if (historySearch.length > 0) {
        for (let i = 0; i < historySearch.length; i++) {
            if (historySearch[i] === channelName) {
                return true;
            }
        }
    }
    return false;
}

const getHistorySearch = () => {
    const historySearch = localStorage.getItem('historySearch');

    const historys = [];
    
    if (historySearch) {
        const history = JSON.parse(historySearch);

        for (let i = 0; i < history.length; i++) {

            //check if text in history exists in historys array to avoid duplicates in array
            if(historys.filter(e => e.text === history[i].text).length > 0) {
                continue;
            } else {
                historys.push(history[i]);
            }
            
        }

        historys.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        
        return historys;
    } else {
        return [];
    }
}

const addHistorySearch = (channel) => {
    const historySearch = getHistorySearch();
    if (historySearch.length < 15) {
        historySearch.push(channel);
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    } else {
        historySearch.shift();
        historySearch.push(channel);
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }
}

const removeHistorySearch = (text) => {
    const historySearch = getHistorySearch();
    const historys = [];

    for (let i = 0; i < historySearch.length; i++) {
        if (historySearch[i].text === text) {
            continue;
        } else {
            historys.push(historySearch[i]);
        }
    }
    localStorage.setItem('historySearch', JSON.stringify(historys));
} 


export {
    existsHistorySearch,
    getHistorySearch,
    addHistorySearch,
    existsHistoryChannelName,
    removeHistorySearch
}