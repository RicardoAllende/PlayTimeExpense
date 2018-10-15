export function isNotEmpty(data){
    if(data.numRows == 0){
        return false;
    }
    return true;
}

export function formatSeconds(seconds){
    minutes = 0;
    if(seconds > 59){
        minutes = parseInt(seconds / 60);
        seconds = seconds - (minutes * 60);
    }else{
        return seconds + " segundos"
    }
    return minutes + ':' + seconds;
}