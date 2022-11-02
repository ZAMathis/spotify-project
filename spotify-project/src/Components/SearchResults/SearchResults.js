import React from 'react';
import { TrackList } from 'spotify-project\src\Components\TrackList\TrackList.js';
import './SearchResults.css';

export class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList />
            </div>
        );
    }
}