/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import '../App/App.css';
import { Playlist } from '../Playlist/Playlist.js';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js'
import Spotify from '../../util/Spotify.js';

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
    this.search = this.search.bind(this);
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

    Spotify.savePlaylist(this.state.playlistName, trackURIS).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Spotify.search(term).then(results => {
      this.setState({
        searchResults: results
      })
    })
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
