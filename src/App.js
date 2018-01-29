import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: { hits: updatedHits, page}
    });
  }
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}\
      ${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, thits: updatedHits }
    });
  }
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  };
  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    if (! result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
        <Search value={searchTerm} onChange={this.onSearchChange}
        onSearchSubmit={this.onSearchSubmit}
        >Search</Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss} />
        }
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
          </div>
      </div>
    );
  }
}

const Table = ({list, pattern, onDismiss}) =>
  <div className="table">
    {list.map(item =>
      <div className="table-row" key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comment}</span>
        <span>{item.points}</span>
        <span>
          <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
        </span>
      </div>
    )}
  </div>

const Search = ({ value, onChange, onSubmit, children}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {{children}}
    </button>
  </form>

const Button = ({onClick, className = '', children}) =>
    <button onClick={onClick} className={className} type="button">{children}</button>

const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};

export default App;
