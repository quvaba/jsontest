import React from 'react';

// Returns a JSX div of spans of authors that match the netIds given
// [PARAMS] peopleJson - the json to find matching data from
//          netIds - the array of netIds to be matched
export function getMatchingAuthors(peopleJson, netIds){
  let allAuthors = peopleJson.entries;
  let entryAuthors = allAuthors.filter(function(value, index, arr){
    return (netIds.includes(value.netId));
  });

  let authorList = entryAuthors.map(
    (author) => <span className="Author" key={entryAuthors.indexOf(author)}>
                  {author.pageUrl.length > 0 ?
                    (<a href={author.pageUrl}>{author.name}</a>) :
                    (<span>{author.name}</span>)
                  }

                </span>
  );

  return(
    <div> {authorList} </div>
  );
}

//
// [PARAMS] num - number of most recent publications to return
//          projectId - the id of the project to search for related
//                      publications of
//          publicationsJson - the json to find matching data from
export function getTopPublications(num, projectId, publicationsJson){
  let allPublications = publicationsJson.entries;
  let matchingPubs = allPublications.filter(
    function(value, index, arr){
      return(value.projectId === projectId);
    }
  );

  matchingPubs.sort((a, b) => (a.year < b.year) ? 1 : -1);
  matchingPubs = matchingPubs.slice(0, 2);

  let pubList = matchingPubs.map(
    (pub) => <span key={matchingPubs.indexOf(pub)}>
                <a href={pub.url}>{pub.title}</a><br/>
             </span>
  );

  return(
    <div> {pubList} </div>
  );
}

// Same as getTopPublications, but returns all matching pubs
export function getMatchingPublications(projectId, publicationsJson){
  let allPublications = publicationsJson.entries;
  let matchingPubs = allPublications.filter(
    function(value, index, arr){
      return(value.projectId === projectId);
    }
  );

  let pubList = matchingPubs.map(
    (pub) => <span key={matchingPubs.indexOf(pub)}>
                <a href={pub.url}>{pub.title}</a><br/>
             </span>
  );

  return(
    <div> {pubList} </div>
  );
}
