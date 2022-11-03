let accessToken = "BQBsTpzWP6HYaO2CrEPxMj9gw0F0S3csuLkplUjI3MQno-76yBH-60WH1AgN1E6U7jK1RaX1HJNalFLuXa6iD06VoTcCBqxGMca0A7MgIJoSvYKs7mRraKFbw4ztUtFWe0A1qPGOJtzw9bf8JvpPTnh0_GDmEm2aOZsus5Xb0mZFfncXL-uQfnFDbymJGcN0YRk";
const clientID = 'eb4558ba7bdc4a6bbc2599c64da40028';
const redirectURI = 'http://illegal-feeling.surge.sh';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // If the access token is not already set, check the URL to see if it has just been obtained.
        // The implicit grant flow returns a user’s access token in the URL.
        let url = window.location.href;
        const accessTokenMatch = url.match(/access_token=([^&]*)/);
        const expiresInMatch = url.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            // The access token and expiration time are in the URL
            console.log("The access token and expiration time are in the URL");
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // This clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = "", expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        }

        // The access token variable is empty and is not in the URL.
        // This mean that we are going to have to authenticate the user so that they can get an access token
        // You will need the user’s access token to make requests to the Spotify API.
        else {
            console.log("Access Token is empty and not in url");
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(term) {
        let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        const accessToken = Spotify.getAccessToken();

        return fetch(url, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
            }).then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id : track.id,
                    name : track.name,
                    artist : track.artists[0].name,
                    album : track.album.name,
                    uri : track.uri
                }))
            }
        )
    },

    savePlaylist(playlistName, trackURIS) {
        if (!playlistName && !trackURIS.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization : `Bearer ${accessToken}`
        };
        let userID = "";

        let url = "https://api.spotify.com/v1/me";
        return fetch(url, {
            headers : headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log("What is the error in savePlaylist() ::  " + jsonResponse);
            userID = jsonResponse.id;
            let createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists`;

            return fetch(createPlaylistURL, {
                    headers : headers,
                    method : "POST",
                    body: JSON.stringify({ name : playlistName })
                }).then(response => {
                return response.json();
            }).then(jsonResponse => {

                // Created a new playlist, now lets add tracks to the same playlist we just created
                let playlistID = jsonResponse.id;
                let addTrackToPlaylistURL =`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;

                return fetch(addTrackToPlaylistURL, {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    },
                    method : "POST",
                    body : JSON.stringify({
                        uris : trackURIS
                    })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    playlistID = jsonResponse.id;
                })

            })
        })
    },

    getCurrentPlaylist() {
        const accessToken = Spotify.getAccessToken();
        console.log("What is access token:: " + accessToken);
        const headers = {
            Authorization : `Bearer ${accessToken}`
        };

        let url = "https://api.spotify.com/v1/me/playlists";
        return fetch(url, {
            headers : headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log("what is the current playlists:: " + jsonResponse.href);
            console.log("what is the current playlists:: " + jsonResponse.items.name);
            return jsonResponse;
        })
    }
};

export default Spotify