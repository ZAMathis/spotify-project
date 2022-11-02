/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import './App.css';
import { Playlist } from 'spotify-project\src\Components\Playlist\Playlist.js';
import { SearchBar } from 'spotify-project\src\Components\SearchBar\SearchBar.js';
import { SearchResults } from 'spotify-project\src\Components\SearchResults\SearchResults.js'

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{name : ''},{artist : ''},{album : ''},{id : ''}],
      playlistName: 'any string',
      playlistTracks: [{name : 'yo'},{artist : 'mother'},{album : 'fuckin mama'},{id : '12'}]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    let currentPlaylist = this.state.playlistTracks;

    if (this.state.playlistTracks.indexOf(track.id) === -1) {
      currentPlaylist.push(track);
    }

    this.setState({
      playlistTracks: currentPlaylist
    });
  }

  removeTrack(track) {
    let currentPlaylist = this.state.playlistTracks;

    for (let i in currentPlaylist) {
      if (track.id === currentPlaylist[i].id) {
        currentPlaylist.splice(i, 1);
      }

      this.setState({
        playlistTracks: currentPlaylist
      })
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    let trackURIS = [];
    let tracks = this.state.playlistTracks;

    for (let i in tracks) {
      trackURIS.push(tracks[i].uri);
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults 
            searchResults={this.state.searchResults} />
            <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks}
            onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

/*

Leaving all the default stuff just in case

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

*/