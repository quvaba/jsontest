import React from 'react';

// Returns a JSX div of spans of authors that match the netIds given
// [PARAMS] peopleJson - the json to find matching data from
//          netIds - the array of netIds to be matched
export function getMatchingAuthors(peopleJson, netIds){
  let allAuthors = peopleJson.peopleJson.entries;
  let entryAuthors = allAuthors.filter(function(value, index, arr){
    return (netIds.includes(value.netId));
  });

  let authorList = entryAuthors.map(
    (author) => <span key={entryAuthors.indexOf(author)}>
                  {author.name}
                </span>
  );

  return(
    <div> {authorList} </div>
  );
}
