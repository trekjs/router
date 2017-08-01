// Google+
// https://developers.google.com/+/api/latest/
// (in reality this is just a subset of a much larger API)
module.exports = [
  // People
  ['GET', '/people/:userId', '/people/233'],
  ['GET', '/people', '/people'],
  [
    'GET',
    '/activities/:activityId/people/:collection',
    '/activities/233/people/377'
  ],
  ['GET', '/people/:userId/people/:collection', '/people/233/people/377'],
  ['GET', '/people/:userId/openIdConnect', '/people/233/openIdConnect'],

  // Activities
  [
    'GET',
    '/people/:userId/activities/:collection',
    '/people/377/activities/333'
  ],
  ['GET', '/activities/:activityId', '/activities/1024'],
  ['GET', '/activities', '/activities'],

  // Comments
  ['GET', '/activities/:activityId/comments', '/activities/987/comments'],
  ['GET', '/comments/:commentId', '/comments/610'],

  // Moments
  ['POST', '/people/:userId/moments/:collection', '/people/233/moments/377'],
  ['GET', '/people/:userId/moments/:collection', '/people/233/moments/377'],
  ['DELETE', '/moments/:id', '/moments/377']
]
