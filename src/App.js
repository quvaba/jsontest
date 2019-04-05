import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import './App.css';
import pagesJson from './data/pages.json';
import coursesJson from './data/courses.json';
import peopleJson from './data/people.json';
import karrieJson from './data/karrie.json';
import projectsJson from './data/projects.json';
import publicationsJson from './data/publications.json';
import {getMatchingAuthors} from './utils/utils.js'
import Grid from '@material-ui/core/Grid';
import {Nav, Navbar, NavbarBrand, NavbarToggler, Collapse} from 'reactstrap';

// App - contains everything.
//    Has a navigation bar and page content that varies based on
//    which section of the site you are browsing
// [STATE] currentPage - The page being displayed. Called by NavBar.
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentPage: "Home"
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
        pageContents = <HomePage />
        break;
      case "Karrie":
        pageContents = <ListPage json={karrieJson} pageType = "Karrie"/>;
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
//https://react-bootstrap.github.io/components/navbar/
class NavBar extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

  }

  handleClick(pageName){
    this.props.loadPage(pageName);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
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
      <div className="NavBar">
      <Navbar className="navbar-dark" expand="md">

          <NavbarBrand href="/">Social Spaces</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />

      <Collapse isOpen={this.state.isOpen} navbar>

      <Nav navbar>
      {pages}
      </Nav>

      </Collapse>

      </Navbar>
      </div>
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
        let currentPeople;
        let alumniPeople;
        currentPeople = people.filter(list => {
          return list.status.toLowerCase().includes("current");
        });
        alumniPeople = people.filter(list => {
          return list.status.toLowerCase().includes("alum");
        });
        entryList =
        <Grid container justify="center">
          <Grid item xs={10} sm={8} lg={6}>
           <div className="StudentList">Current Students</div>
            <Grid container className="People" justify="flex-start" spacing={16}>
              {currentPeople.map(person => (
                <Grid key={people.indexOf(person)} item xs={12} sm={6} md={3}>
                  <Person
                    name={person.name}
                    pageUrl={person.pageUrl}
                    photoUrl={person.photoUrl}
                    status={person.status}
                    degree={person.degree}
                  />
                </Grid>
              ))}
            </Grid>
            <div className="StudentList">Alumni</div>
            <Grid container className="People" justify="flex-start" spacing={16}>
              {alumniPeople.map(person => (
                <Grid key={people.indexOf(person)} item xs={12} sm={6} md={3}>
                  <Person
                    name={person.name}
                    pageUrl={person.pageUrl}
                    photoUrl={person.photoUrl}
                    status={person.status}
                    degree={person.degree}
                    currentRole={person.currentRole}
                    gradYear={person.gradYear}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>


        break;

      case "Projects":
        let projects = this.props.json.entries;
        entryList =
        <Grid container justify="center">
        <Grid item xs={10} sm={8} md={8} lg={6}>
          {projects.map(
          (project) => <li key={projects.indexOf(project)}>
                        <Project
                          title={project.title}
                          authors={project.authorIds}
                          description={project.description}
                          publications={project.publications}
                          onClick={this.handleClick}
                        />
                     </li>
        )}
         </Grid>
        </Grid>
        break;

      case "Publications":
        let publications = this.props.json.entries;
        entryList =
        <Grid container justify="center">
        <Grid item xs={10} sm={8} md={8} lg={6}>
        {publications.map(
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
        )}
        </Grid>
        </Grid>
        break;

      case "Karrie":
        let karrieinfo = this.props.json.entries;
        entryList =
        <Grid container justify="center">
        <Grid item xs={12} sm={11} md={8} lg={6}>
          {karrieinfo.map(
          (karrie) => <li key={karrieinfo.indexOf(karrie)}>
                        <Karrie
                          name={karrie.name}
                          photoUrl={karrie.photoUrl}
                          position={karrie.position}
                          email={karrie.email}
                          address={karrie.address}
                          phone={karrie.phone}
                          awards={karrie.awards}
                        />
                     </li>
        )}
         </Grid>
        </Grid>
        break;

      case "Courses":
        let courses = this.props.json.entries;
        entryList =
        <Grid container justify="center">
        <Grid item xs={10} sm={8} md={8} lg={6}>
        {courses.map(
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
        )}
        </Grid>
        </Grid>
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
      <div className="Publication">
        <a href={this.props.url} className="PublicationTitle">{this.props.title}</a>
        <div>{this.props.conference}</div>
        <div>{authorList}</div>
      </div>
    );
  }
}


class Karrie extends Component {
  render(){
  /*  let allProjects = projectsJson.entries;
    let featuredProjects = allProjects.filter(
      function(value, index, arr){
        return (value.onFrontPage == true);
      }
    );

    let projList = featuredProjects.map(
      (project) => <li>
          <div>{project.title}</div>
      </li>
    );*/

    return(
      <div>
          <div className="KarrieIntroContainer">
            <span className="KarrieIntro">
                <img className="PersonImage" src={this.props.photoUrl} />
            </span>
            <span className="KarrieIntro">
                <span>
                  <div id="KarrieText">{this.props.name}</div>
                  <div>{this.props.position}</div>
                  <div className="InfoSpacing">{this.props.email}</div>
                  <div className="InfoSpacing">
                    {this.props.address.map(addressLine =>
                      <div> {addressLine} </div>
                    )}
                  </div>
                  <div className="InfoSpacing">{this.props.phone}</div>
                </span>
            </span>
          </div>

          <div className="Awards"> Awards </div>
          <div className="Awards">
          {this.props.awards.map( award =>
              <div> {award} </div>
            )
          }
          </div>

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
      <span className="Person">
        <div className="PeopleImageContainer">
          <img className="PersonImage" src={this.props.photoUrl} />
        </div>
        <div>
          {this.props.pageUrl.length > 0 ?
          (<a href={this.props.pageUrl}>{this.props.name} </a>):
          (<span>{this.props.name}</span>)
        }
        </div>
        <div>{this.props.degree} {this.props.gradYear ?
          (<span>{this.props.gradYear}</span>) :
          (<span></span>)
          }
        {this.props.currentRole ?
          (<div>Now at <b>{this.props.currentRole}</b></div>):
          (<span></span>)
        }
        </div>
      </span>
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
        <ProjectPublications publications={this.props.publications} />
      </div>
    );
  }
}

// [PROPS] publications - an array of publication titles to look up
class ProjectPublications extends Component {
  render(){

    let allEntries = publicationsJson.entries;
    let publications = this.props.publications;
    let matchingEntries = allEntries.filter(
      function(value, index, arr){
        for (var i = 0; i < publications.length; i++) {
          return (publications[i] == value.title);
        }
      }
    );

    let pubList = matchingEntries.map(
      (entry) => <a href={entry.url}> {entry.title} </a>
    );

    return(
      <div className="ProjectPublications">
        {pubList}
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
                      <div className="ProjectSectionTitle">{bodySection.sectionTitle}</div>
                      <div>{bodySection.sectionContent}</div>
                    </div>
                 </li>
    );

    return(
      <div className="ProjectPage">
        <Grid container justify="center">
          <Grid item xs={12} sm={8} lg={6}>
            <div className="ProjectPageTitle"> {title} </div>
            <div> {authorList} </div>
            <img src={targetEntry.imageUrls[0]}/>
            {bodyList}
            <img src={targetEntry.imageUrls[1]}/>
            {targetEntry.publications}
          </Grid>
        </Grid>
      </div>
    );
  }
}

class HomePage extends Component {
  render(){
    let allProjects = projectsJson.entries;
    let featuredProjects = allProjects.filter(
      function(value, index, arr){
        return (value.onFrontPage == true);
      }
    );

    let projList = featuredProjects.map(
      (project) => <li>
          <div>{project.title}</div>
      </li>
    );

    return(
      <div>
        <div>
          Our goal is to investigate sociable systems for mediated communication.
          This encompasses a wide range of areas:

          → Explore and build virtual-physical spaces for mediated communication
          → Build communication objects that connect people and/or spaces
          → Build interactive interfaces that connect spaces
          → Visualize and study how people interact within social spaces
          And more !
        </div>

        <div className="FeaturedProjects">
          <h2>Featured Projects</h2>
          {projList}
        </div>
      </div>

    );
  }
}

export default App;
