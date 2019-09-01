import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import './App.scss';

import pagesJson from './data/pages.json';
import coursesJson from './data/courses.json';
import peopleJson from './data/people.json';
import karrieJson from './data/karrie.json';
import projectsJson from './data/projects.json';
import publicationsJson from './data/publications.json';

import {getMatchingAuthors} from './utils/utils.js'
import {getMatchingPublications} from './utils/utils.js'
import {getTopPublications} from './utils/utils.js'

import karriePic from './data/mit-karrie.jpg';

import Grid from '@material-ui/core/Grid';
import {Nav, Navbar, NavbarBrand, NavbarToggler, Collapse} from 'reactstrap';


/**
 * App - contains everything. Wraps a NavBar and a page contents.
 *
 * [STATE] currentPage - The page being displayed. "Home" by default.
 */
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
        pageContents = <ProjectPage json={projectsJson} id={current} />;
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


/**
 * NavBar - the navigation bar at the top of the page.
 *          https://react-bootstrap.github.io/components/navbar/
 *
 * [PROPS] loadPage - function that passes page clicked to App
 */
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
    let pagesArray = pagesJson.pages;
    let pages = pagesArray.map(
      (page) => <NavOption
                  key={pagesArray.indexOf(page)}
                  title={page.title}
                  onClick={this.handleClick}
                />
    );

    return(
      <div className="NavBar">
      <Navbar className="navbar-light" expand="md">
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


/**
 * NavOption - one of the links in the navigation bar.
 *
 * [PROPS] onClick - function to be called when clicked.
 *         title - the title of the page it links to
 */
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


/*****************************************************************************************************************

                                            INDIVIDUAL PAGES

*****************************************************************************************************************/

/* ListPage - includes People, Projects, Publications, Karrie, and Courses
 *
 * [PROPS] json - the json to be read from
 *         pageType - the type of page to render
 */
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
        projects.sort((a, b) => (a.startYear < b.startYear) ? 1 : -1);

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
                          id={project.projectId}
                        />
                     </li>
        )}
         </Grid>
        </Grid>
        break;

      case "Publications":
        let publications = this.props.json.entries;
        publications.sort((a, b) => (a.year < b.year) ? 1 : -1);

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
 * Publication - An individual publication object
 *
 * [PROPS] title, year, conference, url, authors (array), awards
 */
class Publication extends Component {
  render(){
    let authorList = getMatchingAuthors(peopleJson, this.props.authors);
    // sort publications by year

    return(
      <div className="Publication">
        <a href={this.props.url} className="PublicationTitle">{this.props.title}</a>
        <div>{this.props.conference}</div>
        <div>{authorList}</div>
      </div>
    );
  }
}


/* Person - An individual person object
 *
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


/* Project - An individual project object.
 *
 * [PROPS] title, description, author, id
 */
class Project extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.onClick(this.props.id);
  }

  applyCharCap(description){
    let short = description;
    if (short.length > 350){
      short = short.substring(1, 350) + "...";
    }
    return short;
  }

  render(){
    return(
      <div>
        <div onClick={this.handleClick} className="ProjectTitle">{this.props.title}</div>
        <div>{this.applyCharCap(this.props.description)}</div>
      </div>
    );
  }

}


/* Karrie - Karrie's CV
 *
 * [PROPS] name, position, email, phone, awards
 */
class Karrie extends Component {
  render(){

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


/* Course - Page full of social spaces courses.
 *
 * [PROPS] url, title, abbrev, schedule, description
 */
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


/* ProjectPage - An individual project's page.
 *
 * [PROPS]
 */
class ProjectPage extends Component {
  render(){
    let allEntries = projectsJson.entries;
    let id = this.props.id;
    let targetEntry = allEntries.filter(function(value, index, arr){
      return (id === value.projectId);
    });

    targetEntry = targetEntry[0];
    let authorList = getMatchingAuthors(peopleJson, targetEntry.authorIds);
    let publicationList = getMatchingPublications(id, publicationsJson);

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
            <div className="ProjectPageTitle"> {targetEntry.title} </div>
            <div> {authorList} </div>
            <div> {publicationList} </div>
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


/* HomePage - The home page of the social spaces website.
 *
 * [PROPS]
 */
class HomePage extends Component {
  render(){
    let allProjects = projectsJson.entries;
    let featuredProjects = allProjects.filter(
      function(value, index, arr){
        return (value.onFrontPage === true);
      }
    );

    let projList = featuredProjects.map(
      (project) => <li>
          <div>{project.title}</div>
          <div>{project.description}</div>
          <div> {getTopPublications(2, project.projectId, publicationsJson)} </div>
      </li>
    );

    return(
      <div>
        <img src={karriePic}></img>
        <div>
          Our goal is to investigate sociable systems for mediated communication.
          This encompasses a wide range of areas:<br/>

          ➭ Explore and build virtual-physical spaces for mediated communication<br/>
          ➭ Build communication objects that connect people and/or spaces<br/>
          ➭ Build interactive interfaces that connect spaces<br/>
          ➭ Visualize and study how people interact within social spaces<br/>
          And more!
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
