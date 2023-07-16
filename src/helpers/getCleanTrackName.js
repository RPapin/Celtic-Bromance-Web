function getCleanTrackName(trackName) {
    var cleanTrack = trackName.replace(/_/g, " ");
    var re = /(\b[a-z](?!\s))/g;
    cleanTrack = cleanTrack.replace(re, function(x){return x.toUpperCase();});
    return cleanTrack
}

export default getCleanTrackName;