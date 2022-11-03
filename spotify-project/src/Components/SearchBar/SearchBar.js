import React from 'react';
import '../SearchBar/SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({
            term : e.target.value
        })
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            console.log('enter press here! ');
            this.search();
        }
    }

    render() {
        return (
            <div className="SearchBar">
                {console.log("Inside SearchBar Component")}
                <input
                    placeholder="Enter A Song, Album, or Artist"
                    onChange={this.handleTermChange}
                    onKeyPress={this.handleKeyPress} />

                <button
                    className="SearchButton"
                    onClick={this.search}
                    >SEARCH</button>
            </div>
        )
    }
}