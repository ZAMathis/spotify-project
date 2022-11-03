const redirectURI = "http://localhost:3000";
const clientID = "eb4558ba7bdc4a6bbc2599c64da40028";
let accessToken=""

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        let url = window.location.href;
        const accessTokenMatch = url.match(/access_token=([^&]*)/);
        const expiresInMatch = url.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            console.log("The access token and expiration time are in the URL");
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken = "", expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
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


export default Spotify;