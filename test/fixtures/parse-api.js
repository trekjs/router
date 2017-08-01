// Parse
// https://parse.com/docs/rest#summary
module.exports = [
  // Objects
  ['POST', '/1/classes/:className', '/1/classes/3n2b'],
  ['GET', '/1/classes/:className/:objectId', '/1/classes/3n2b/233'],
  ['PUT', '/1/classes/:className/:objectId', '/1/classes/3n2b/233'],
  ['GET', '/1/classes/:className', '/1/classes/3n2b'],
  ['DELETE', '/1/classes/:className/:objectId', '/1/classes/3n2b/233'],

  // Users
  ['POST', '/1/users', '/1/users'],
  ['GET', '/1/login', '/1/login'],
  ['GET', '/1/users/:objectId', '/1/users/1024'],
  ['PUT', '/1/users/:objectId', '/1/users/1025'],
  ['GET', '/1/users', '/1/users'],
  ['DELETE', '/1/users/:objectId', '/1/users/233'],
  ['POST', '/1/requestPasswordReset', '/1/requestPasswordReset'],

  // Roles
  ['POST', '/1/roles', '/1/roles'],
  ['GET', '/1/roles/:objectId', '/1/roles/233'],
  ['PUT', '/1/roles/:objectId', '/1/roles/233'],
  ['GET', '/1/roles', '/1/roles'],
  ['DELETE', '/1/roles/:objectId', '/1/roles/233'],

  // Files
  ['POST', '/1/files/:fileName', '/1/files/router.js'],

  // Analytics
  ['POST', '/1/events/:eventName', '/1/events/update'],

  // Push Notifications
  ['POST', '/1/push', '/1/push'],

  // Installations
  ['POST', '/1/installations', '/1/installations'],
  ['GET', '/1/installations/:objectId', '/1/installations/233'],
  ['PUT', '/1/installations/:objectId', '/1/installations/233'],
  ['GET', '/1/installations', '/1/installations'],
  ['DELETE', '/1/installations/:objectId', '/1/installations/233'],

  // Cloud Functions
  ['POST', '/1/functions', '/1/functions']
]
