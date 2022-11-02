import React from "react";
import { Track } from "spotify-project\src\Components\Track\Track.js";
import './TrackList.css';

export class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                this.props.tracks.map(track => {
                    // eslint-disable-next-line no-undef
                    <Track 
                    track={track} 
                    key={track.id} 
                    onAdd={this.props.onAdd} 
                    onRemove={this.props.onRemove}
                    isRemoval={this.props.isRemoval} />
                })
            </div>
        );
    }
}