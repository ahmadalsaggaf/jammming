/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */

const clientID = 'f6879824e4524c048ac7c7f7d44c60cb';
const redirectURI = 'http://localhost:3000/callback/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expireTimeMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expireTimeMatch) {
      accessToken = accessTokenMatch[1];
      const expireTime = Number(expireTimeMatch[1]);
      window.setTimeout(() => (accessToken = ''), expireTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

    window.location = accessUrl;
  },

  search(searchterm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchterm}
    `,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.tracks) {
          return [];
        }
        return responseJson.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackURI) {
    if (!name || !trackURI.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userid;

    return fetch(
      `https://api.spotify.com/v1/me
    `,
      { headers }
    )
      .then((response) => response.json())
      .then((jsonResponse) => {
        userid = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userid}/playlists
        `,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({ name }),
          }
        )
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistID = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userid}/playlists/${playlistID}/tracks
            `,
              {
                headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURI }),
              }
            );
          });
      });
  },
};

export default Spotify;
