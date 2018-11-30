import React, { Component } from 'react';
import './App.css';
import pagesJson from './pages.json';
import coursesJson from './courses.json';
import peopleJson from './people.json';
import projectsJson from './projects.json';
import publicationsJson from './publications.json';
import {getMatchingAuthors} from './utils/utils.js'

// App - contains everything.
//    Has a navigation bar and page content that varies based on
//    which section of the site you are browsing
// [STATE] currentPage - The page being displayed. Called by NavBar.
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentPage: "Publications"
    };
    this.goToPage = this.goToPage.bind(this);
  }

  goToPage(pageName){
    this.setState({
      currentPage: pageName
    });
  }

  render(){
    let pageContents;
    let current = this.state.currentPage;

    switch (current) {
      case "Home":
        break;
      case "People":
        pageContents = <ListPage json={peopleJson} pageType = "People"/>;
        break;
      case "Publications":
        pageContents = <ListPage json={publicationsJson} pageType = "Publications"/>;
        break;
      case "Projects":
        pageContents = <ListPage json={projectsJson} pageType = "Projects" onClick={this.goToPage}/>;
        break;
      case "Courses":
        pageContents = <ListPage json={coursesJson} pageType = "Courses"/>;
        break;
      default:
        pageContents = <ProjectPage json={projectsJson} title={current} />;
        break;
    }

    return(
      <div className="App">
        <NavBar json={pagesJson} loadPage={this.goToPage}/>
        {pageContents}
      </div>
    );
  }
}

// NavBar - the navigation bar at the top of the page.
//    Displays all pages. Clickable.
// [PROPS] json - json of pages to be read from
//         loadPage - function that passes page clicked to App
class NavBar extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(pageName){
    this.props.loadPage(pageName);
  }

  render(){
    let pagesArray = this.props.json.pages;
    let pages = pagesArray.map(
      (page) => <NavOption
                  key={pagesArray.indexOf(page)}
                  title={page.title}
                  onClick={this.handleClick}
                />
    );

    return(
      <div className="NavBar"> {pages} </div>
    );
  }
}

// NavOption - one of the links in the navigation bar.
// [PROPS] onClick - function to be called when clicked
//         key - unique key for map
//         title - the title of the page it links to
class NavOption extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.onClick(this.props.title);
  }

  render(){
    return(
      <span onClick={this.handleClick} className="NavOption">
        {this.props.title}
      </span>
    );
  }
}

                            ////////////////////////////////////////////////////
                            //                                                //
                            //                INDIVIDUAL PAGES                //
                            //                                                //
                            ////////////////////////////////////////////////////

// ListPage -
//
// [PROPS] json - the json to be read from
//         pageType - the type of page to render
class ListPage extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(projectTitle){
    this.props.onClick(projectTitle);
  }

  render(){
    let entryList;

    switch (this.props.pageType) {
      case "People":
        let people = this.props.json.entries;
        entryList = people.map(
          (person) => <li key={people.indexOf(person)}>
                        <Person
                          name={person.name}
                          pageUrl={person.pageUrl}
                          photoUrl={person.photoUrl}
                          status={person.status}
                          degree={person.degree}
                        />
                     </li>
        );
        break;

      case "Projects":
        let projects = this.props.json.entries;
        entryList = projects.map(
          (project) => <li key={projects.indexOf(project)}>
                        <Project
                          title={project.title}
                          authors={project.authorIds}
                          description={project.description}
                          onClick={this.handleClick}
                        />
                     </li>
        );
        break;

      case "Publications":
        let publications = this.props.json.entries;
        entryList = publications.map(
          (publication) => <li key={publications.indexOf(publication)}>
                        <Publication
                          title={publication.title}
                          year={publication.year}
                          conference={publication.conference}
                          url={publication.url}
                          authors={publication.authorIds}
                          awards={publication.awards}
                        />
                     </li>
        );
        break;

      case "Courses":
        let courses = this.props.json.entries;
        entryList = courses.map(
          (course) => <li key={courses.indexOf(course)}>
                        <Course
                          title={course.title}
                          schedule={course.schedule}
                          abbrev={course.abbrev}
                          url={course.url}
                          description={course.description}
                          prior_versions={course.prior_versions}
                        />
                     </li>
        );
        break;

      default:

    }

    return(
      <div className="ListPage">{entryList}</div>
    );
  }
}

/*
 * Publication -
 * [PROPS] title, year, conference, url, authors (array), awards
 *
 */
class Publication extends Component {
  render(){
    let authorList = getMatchingAuthors({peopleJson}, this.props.authors);
    //handle awards...

    return(
      <div>
        <a href={this.props.url}>{this.props.title}</a>
        {this.props.conference}
        {authorList}
      </div>
    );
  }
}

/* Person -
 * [PROPS] name, pageUrl, photoUrl, status, degree
 */
class Person extends Component {
  render(){
    return(
      <div>
        <a href={this.props.pageUrl}>{this.props.name} </a>
        <img src={this.props.photoUrl} />
        <span>{this.props.degree}</span>
      </div>
    );
  }
}

// COURSE
class Course extends Component {
  render(){
    return(
      <div>

       { this.props.url ?
        (<div><a href={this.props.url}>{this.props.title}</a></div>) :
        (<div>{this.props.title} ({this.props.abbrev})</div>)
       }

        <div><span>{this.props.abbrev}</span></div>
        <div><span>{this.props.schedule}</span></div>
        <div><span>{this.props.description}</span></div>

       {this.props.prior_versions.length > 0 ?
        (
          <div>Prior versions of the course

            {this.props.prior_versions.map(priorVersion =>
                priorVersion.url ?
                (<span> - <a href={priorVersion.url}> {priorVersion.year} </a> </span>) :
                (<span> - {priorVersion.year} </span>)
                )
            }

          </div>
        ) :
        (<div></div>)
       }
      </div>
    );
  }
}

// Project -
// up to 2 images
// unspecified length array of paired paragraph and header
// title, authors, motivation
// links?
// [PROPS]
class Project extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.onClick(this.props.title);
  }

  render(){
    let authorList = getMatchingAuthors({peopleJson}, this.props.authors);

    return(
      <div>
        <div onClick={this.handleClick} className="ProjectTitle">{this.props.title}</div>
        <div>{this.props.description}</div>
        {authorList}
      </div>
    );
  }
}

class ProjectPage extends Component {
  render(){
    //search for matching
    let allEntries = this.props.json.entries;
    let title = this.props.title;
    let targetEntry = allEntries.filter(function(value, index, arr){
      return (title === value.title);
    });

    targetEntry = targetEntry[0];
    let authorList = getMatchingAuthors({peopleJson}, targetEntry.authorIds);

    let bodyList = targetEntry.body.map(
      (bodySection) => <li key={targetEntry.body.indexOf(bodySection)}>
                    <div>
                      <div>{bodySection.sectionTitle}</div>
                      <div>{bodySection.sectionContent}</div>
                    </div>
                 </li>
    );

    return(
      <div className="ProjectPage">
        <div> {title} </div>
        <div> {authorList} </div>
        <img src={targetEntry.imageUrls[0]}/>
        {bodyList}
        <img src={targetEntry.imageUrls[1]}/>
        {targetEntry.publications}
      </div>
    );
  }
}


export default App;
