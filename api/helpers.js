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

/* Clean up ampersands, octothorpes, and pluses */
function amperoctoplus(s) {
    s = s.replace(/&/g, "%26");
    s = s.replace(/#/g, "%23");
    s = s.replace(/\+/g, "%2B");
    s = s.replace(/@/g, "%40");
    s = s.replace(/:/g, "%3A");
    return s;
}

export function makeFBLink(uri) {
    uri = amperoctoplus(encodeURI(uri));
    return "https://www.facebook.com/sharer/sharer.php?u=" + uri;
}

export function makeLinkedInLink(uri, title, summary) {
    // var title = "Playtime";
    title = amperoctoplus(encodeURI(title));
    // var summary = "Te invitamos a descargar Playtime";
    summary = amperoctoplus(encodeURI(summary));
    uri = amperoctoplus(encodeURI(uri));
    return "https://www.linkedin.com/shareArticle?mini=true&url=" + uri + "&title=" + title + "&summary=" + summary;
}

export function makeTwitterLink(tweet) {
    tweet = amperoctoplus(encodeURI(tweet))
	return "https://twitter.com/home?status=" + tweet;
}