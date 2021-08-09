/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          name: 'name1',
          artist: 'artist1',
          album: 'album1',
          id: '1',
        },
        {
          name: 'name2',
          artist: 'artist2',
          album: 'album2',
          id: '2',
        },
        {
          name: 'name3',
          artist: 'artist3',
          album: 'album3',
          id: '3',
        },
      ],
      playlistName: 'My play list',
      playlistTracks: [
        {
          name: 'PlaylistName1',
          artist: 'PlaylistArtist1',
          album: 'PlaylistAlbum1',
          id: '4',
        },
        {
          name: 'PlaylistName2',
          artist: 'PlaylistArtist2',
          album: 'PlaylistAlbum2',
          id: '5',
        },
      ],
    };
    this.addTracks = this.addTracks.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTracks(track) {
    const tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    const selectedPlaylist = this.state.playlistTracks;
    const newPlaylist = selectedPlaylist.filter((item) => item.id !== track.id);
    this.setState({ playlistTracks: newPlaylist });
  }

  updatePlaylistName(newName) {
    this.setState({ playlistName: newName });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTracks}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
