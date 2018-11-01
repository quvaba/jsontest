import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import pagesJson from './pages.json';
import peopleJson from './people.json';
import projectsJson from './projects.json';
import publicationsJson from './publications.json';

// Page - a page of the website.
//  Has a navigation bar and page content that varies based on
//  which section of the site you are browsing
class Page extends Component {
  render(){
    return(
      <div>
        <NavBar pages="pagesJson" className="navigation"/>
        <EntryList json={publicationsJson} />
      </div>
    );
  }
}

class NavBar extends Component {
  //should be able to render off of a json array
  render(){
    let pagesArray = {pagesJson}.pagesJson.pages;
    let pages = pagesArray.map(
      (page) => <span key={pagesArray.indexOf(page)}>
                    {page.title}
                </span>
    );

    return(
      <div> {pages} </div>
    );
  }
}

// Profile - used on the People page
//
class Profile extends Component {
  render(){
    return(
      <div> </div>
    );
  }
}

class Entry extends Component {
  render(){
    let allAuthors = {peopleJson}.peopleJson.entries;
    let authorIds = this.props.authorIds;
    var entryAuthors = allAuthors.filter(function(value, index, arr){
      return (authorIds.includes(value.netId));
    });

    let authorList = entryAuthors.map(
      (author) => <span key={entryAuthors.indexOf(author)}>
                    {author.name}
                  </span>
    );

    return(
      <div className = "entry">
        <div>{this.props.title}</div>
        <div>{this.props.description}</div>
        <div>{authorList}</div>
      </div>
    );
  }
}

class EntryList extends Component {
  render(){
    let summariesArray = this.props.json.entries;
    let entryList = summariesArray.map(
      (entry) => <li key={summariesArray.indexOf(entry)}>
                    <Entry title={entry.title} description={entry.description} authorIds={entry.authorIds}/>
                 </li>
    );

    return(
      <div className = "entry-list">
        {entryList}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Page />
      </div>
    );
  }
}

export default App;
