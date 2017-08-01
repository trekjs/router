module.exports = [
  // OAuth Authorizations
  ['GET', '/authorizations', '/authorizations'],
  ['GET', '/authorizations/:id', '/authorizations/233'],
  ['POST', '/authorizations', '/authorizations'],
  //['PUT', '/authorizations/clients/:client_id'],
  //['PATCH', '/authorizations/:id'],
  ['DELETE', '/authorizations/:id', '/authorizations/377'],
  [
    'GET',
    '/applications/:client_id/tokens/:access_token',
    '/applications/233/tokens/12345tokens'
  ],
  ['DELETE', '/applications/:client_id/tokens', '/applications/377/tokens'],
  [
    'DELETE',
    '/applications/:client_id/tokens/:access_token',
    '/applications/610/tokens/5678tokens'
  ],

  // Activity
  ['GET', '/events', '/events'],
  ['GET', '/repos/:owner/:repo/events', '/repos/trekjs/router/events'],
  ['GET', '/networks/:owner/:repo/events', '/networks/trekjs/router/events'],
  ['GET', '/orgs/:org/events', '/orgs/trekjs/events'],
  ['GET', '/users/:user/received_events', '/users/fundon/received_events'],
  [
    'GET',
    '/users/:user/received_events/public',
    '/users/fundon/received_events/public'
  ],
  ['GET', '/users/:user/events', '/users/fundon/events'],
  ['GET', '/users/:user/events/public', '/users/fundon/events/public'],
  ['GET', '/users/:user/events/orgs/:org', '/users/fundon/events/orgs/trekjs'],
  ['GET', '/feeds', '/feeds'],
  ['GET', '/notifications', '/notifications'],
  [
    'GET',
    '/repos/:owner/:repo/notifications',
    '/repos/trekjs/trek/notifications'
  ],
  ['PUT', '/notifications', '/notifications'],
  [
    'PUT',
    '/repos/:owner/:repo/notifications',
    '/repos/trekjs/router/notifications'
  ],
  ['GET', '/notifications/threads/:id', '/notifications/threads/233'],
  //['PATCH', '/notifications/threads/:id'],
  [
    'GET',
    '/notifications/threads/:id/subscription',
    '/notifications/threads/377/subscription'
  ],
  [
    'PUT',
    '/notifications/threads/:id/subscription',
    '/notifications/threads/610/subscription'
  ],
  [
    'DELETE',
    '/notifications/threads/:id/subscription',
    '/notifications/threads/233/subscription'
  ],
  ['GET', '/repos/:owner/:repo/stargazers', '/repos/trekjs/trek/stargazers'],
  ['GET', '/users/:user/starred', '/users/fundon/starred'],
  ['GET', '/user/starred', '/user/starred'],
  ['GET', '/user/starred/:owner/:repo', '/user/starred/koa-modules/swig'],
  ['PUT', '/user/starred/:owner/:repo', '/user/starred/koa-modules/i18n'],
  ['DELETE', '/user/starred/:owner/:repo', '/user/starred/trekjs/router'],
  [
    'GET',
    '/repos/:owner/:repo/subscribers',
    '/repos/trekjs/router/subscribers'
  ],
  ['GET', '/users/:user/subscriptions', '/users/fundon/subscriptions'],
  ['GET', '/user/subscriptions', '/user/subscriptions'],
  [
    'GET',
    '/repos/:owner/:repo/subscription',
    '/repos/trekjs/router-mapper/subscription'
  ],
  [
    'PUT',
    '/repos/:owner/:repo/subscription',
    '/repos/trekjs/router-mapper/subscription'
  ],
  [
    'DELETE',
    '/repos/:owner/:repo/subscription',
    '/repos/trekjs/router-mapper/subscription'
  ],
  [
    'GET',
    '/user/subscriptions/:owner/:repo',
    '/user/subscriptions/trekjs/trek'
  ],
  [
    'PUT',
    '/user/subscriptions/:owner/:repo',
    '/user/subscriptions/trekjs/trek'
  ],
  [
    'DELETE',
    '/user/subscriptions/:owner/:repo',
    '/user/subscriptions/trekjs/trek'
  ],

  // Gists
  ['GET', '/users/:user/gists', '/users/fundon/gists'],
  ['GET', '/gists', '/gists'],
  //['GET', '/gists/public'],
  //['GET', '/gists/starred'],
  ['GET', '/gists/:id', '/gists/233'],
  ['POST', '/gists', '/gists'],
  //['PATCH', '/gists/:id'],
  ['PUT', '/gists/:id/star', '/gists/377/star'],
  ['DELETE', '/gists/:id/star', '/gists/610/star'],
  ['GET', '/gists/:id/star', '/gists/987/star'],
  ['POST', '/gists/:id/forks', '/gists/987/forks'],
  ['DELETE', '/gists/:id', '/gists/987'],

  // Git Data
  [
    'GET',
    '/repos/:owner/:repo/git/blobs/:sha',
    '/repos/trekjs/trek/git/blobs/abcdefgh'
  ],
  ['POST', '/repos/:owner/:repo/git/blobs', '/repos/trekjs/trek/git/blobs'],
  [
    'GET',
    '/repos/:owner/:repo/git/commits/:sha',
    '/repos/trekjs/trek/git/commits/abcdefgh'
  ],
  ['POST', '/repos/:owner/:repo/git/commits', '/repos/trekjs/trek/git/commits'],
  //['GET', '/repos/:owner/:repo/git/refs/*ref'],
  ['GET', '/repos/:owner/:repo/git/refs', '/repos/trekjs/trek/git/refs'],
  ['POST', '/repos/:owner/:repo/git/refs', '/repos/trekjs/trek/git/refs'],
  //['PATCH', '/repos/:owner/:repo/git/refs/*ref'],
  //['DELETE', '/repos/:owner/:repo/git/refs/*ref'],
  [
    'GET',
    '/repos/:owner/:repo/git/tags/:sha',
    '/repos/trekjs/trek/git/tags/233'
  ],
  ['POST', '/repos/:owner/:repo/git/tags', '/repos/trekjs/trek/git/tags'],
  [
    'GET',
    '/repos/:owner/:repo/git/trees/:sha',
    '/repos/trekjs/trek/git/trees/377'
  ],
  ['POST', '/repos/:owner/:repo/git/trees', '/repos/trekjs/trek/git/trees'],

  // Issues
  ['GET', '/issues', '/issues'],
  ['GET', '/user/issues', '/user/issues'],
  ['GET', '/orgs/:org/issues', '/orgs/trekjs/issues'],
  ['GET', '/repos/:owner/:repo/issues', '/repos/trekjs/trek/issues'],
  [
    'GET',
    '/repos/:owner/:repo/issues/:number',
    '/repos/trekjs/trek/issues/377'
  ],
  ['POST', '/repos/:owner/:repo/issues', '/repos/trekjs/trek/issues'],
  //['PATCH', '/repos/:owner/:repo/issues/:number'],
  ['GET', '/repos/:owner/:repo/assignees', '/repos/trekjs/trek/assignees'],
  [
    'GET',
    '/repos/:owner/:repo/assignees/:assignee',
    '/repos/trekjs/trek/assignees/31231'
  ],
  [
    'GET',
    '/repos/:owner/:repo/issues/:number/comments',
    '/repos/trekjs/trek/issues/610/comments'
  ],
  //['GET', '/repos/:owner/:repo/issues/comments'],
  //['GET', '/repos/:owner/:repo/issues/comments/:id'],
  [
    'POST',
    '/repos/:owner/:repo/issues/:number/comments',
    '/repos/trekjs/trek/issues/377/comments'
  ],
  //['PATCH', '/repos/:owner/:repo/issues/comments/:id'],
  //['DELETE', '/repos/:owner/:repo/issues/comments/:id'],
  [
    'GET',
    '/repos/:owner/:repo/issues/:number/events',
    '/repos/trekjs/trek/issues/233/events'
  ],
  //['GET', '/repos/:owner/:repo/issues/events'],
  //['GET', '/repos/:owner/:repo/issues/events/:id'],
  ['GET', '/repos/:owner/:repo/labels', '/repos/trekjs/trek/labels'],
  ['GET', '/repos/:owner/:repo/labels/:name', '/repos/trekjs/trek/labels/help'],
  ['POST', '/repos/:owner/:repo/labels', '/repos/trekjs/trek/labels'],
  //['PATCH', '/repos/:owner/:repo/labels/:name'],
  [
    'DELETE',
    '/repos/:owner/:repo/labels/:name',
    '/repos/trekjs/trek/labels/iojs'
  ],
  [
    'GET',
    '/repos/:owner/:repo/issues/:number/labels',
    '/repos/trekjs/trek/issues/388/labels'
  ],
  [
    'POST',
    '/repos/:owner/:repo/issues/:number/labels',
    '/repos/trekjs/trek/issues/388/labels'
  ],
  [
    'DELETE',
    '/repos/:owner/:repo/issues/:number/labels/:name',
    '/repos/trekjs/trek/issues/233/labels/help'
  ],
  [
    'PUT',
    '/repos/:owner/:repo/issues/:number/labels',
    '/repos/trekjs/trek/issues/233/labels'
  ],
  [
    'DELETE',
    '/repos/:owner/:repo/issues/:number/labels',
    '/repos/trekjs/trek/issues/399/labels'
  ],
  [
    'GET',
    '/repos/:owner/:repo/milestones/:number/labels',
    '/repos/trekjs/trek/milestones/0/labels'
  ],
  ['GET', '/repos/:owner/:repo/milestones', '/repos/trekjs/trek/milestones'],
  [
    'GET',
    '/repos/:owner/:repo/milestones/:number',
    '/repos/trekjs/trek/milestones/1024'
  ],
  ['POST', '/repos/:owner/:repo/milestones', '/repos/trekjs/trek/milestones'],
  //['PATCH', '/repos/:owner/:repo/milestones/:number'],
  [
    'DELETE',
    '/repos/:owner/:repo/milestones/:number',
    '/repos/trekjs/trek/milestones/233'
  ],

  // Miscellaneous
  ['GET', '/emojis', '/emojis'],
  ['GET', '/gitignore/templates', '/gitignore/templates'],
  ['GET', '/gitignore/templates/:name', '/gitignore/templates/233'],
  ['POST', '/markdown', '/markdown'],
  ['POST', '/markdown/raw', '/markdown/raw'],
  ['GET', '/meta', '/meta'],
  ['GET', '/rate_limit', '/rate_limit'],

  // Organizations
  ['GET', '/users/:user/orgs', '/users/fundon/orgs'],
  ['GET', '/user/orgs', '/user/orgs'],
  ['GET', '/orgs/:org', '/orgs/trekjs'],
  //['PATCH', '/orgs/:org'],
  ['GET', '/orgs/:org/members', '/orgs/trekjs/members'],
  ['GET', '/orgs/:org/members/:user', '/orgs/trekjs/members/fundon'],
  ['DELETE', '/orgs/:org/members/:user', '/orgs/trekjs/members/fundon'],
  ['GET', '/orgs/:org/public_members', '/orgs/trekjs/public_members'],
  [
    'GET',
    '/orgs/:org/public_members/:user',
    '/orgs/trekjs/public_members/fundon'
  ],
  [
    'PUT',
    '/orgs/:org/public_members/:user',
    '/orgs/trekjs/public_members/fundon'
  ],
  [
    'DELETE',
    '/orgs/:org/public_members/:user',
    '/orgs/trekjs/public_members/fundon'
  ],
  ['GET', '/orgs/:org/teams', '/orgs/trekjs/teams'],
  ['GET', '/teams/:id', '/teams/233'],
  ['POST', '/orgs/:org/teams', '/orgs/trekjs/teams'],
  //['PATCH', '/teams/:id'],
  ['DELETE', '/teams/:id', '/teams/233'],
  ['GET', '/teams/:id/members', '/teams/233/members'],
  ['GET', '/teams/:id/members/:user', '/teams/233/members/fundon'],
  ['PUT', '/teams/:id/members/:user', '/teams/377/members/fundon'],
  ['DELETE', '/teams/:id/members/:user', '/teams/610/members/fundon'],
  ['GET', '/teams/:id/repos', '/teams/987/repos'],
  ['GET', '/teams/:id/repos/:owner/:repo', '/teams/987/repos/trekjs/trek'],
  ['PUT', '/teams/:id/repos/:owner/:repo', '/teams/987/repos/trekjs/trek'],
  ['DELETE', '/teams/:id/repos/:owner/:repo', '/teams/987/repos/trekjs/trek'],
  ['GET', '/user/teams', '/user/teams'],

  // Pull Requests
  ['GET', '/repos/:owner/:repo/pulls', '/repos/trekjs/trek/pulls'],
  ['GET', '/repos/:owner/:repo/pulls/:number', '/repos/trekjs/trek/pulls/233'],
  ['POST', '/repos/:owner/:repo/pulls', '/repos/trekjs/trek/pulls'],
  //['PATCH', '/repos/:owner/:repo/pulls/:number'],
  [
    'GET',
    '/repos/:owner/:repo/pulls/:number/commits',
    '/repos/trekjs/trek/pulls/233/commits'
  ],
  [
    'GET',
    '/repos/:owner/:repo/pulls/:number/files',
    '/repos/trekjs/trek/pulls/233/files'
  ],
  [
    'GET',
    '/repos/:owner/:repo/pulls/:number/merge',
    '/repos/trekjs/trek/pulls/233/merge'
  ],
  [
    'PUT',
    '/repos/:owner/:repo/pulls/:number/merge',
    '/repos/trekjs/trek/pulls/233/merge'
  ],
  [
    'GET',
    '/repos/:owner/:repo/pulls/:number/comments',
    '/repos/trekjs/trek/pulls/233/comments'
  ],
  //['GET', '/repos/:owner/:repo/pulls/comments'],
  //['GET', '/repos/:owner/:repo/pulls/comments/:number'],
  [
    'PUT',
    '/repos/:owner/:repo/pulls/:number/comments',
    '/repos/trekjs/trek/pulls/233/comments'
  ],
  //['PATCH', '/repos/:owner/:repo/pulls/comments/:number'],
  //['DELETE', '/repos/:owner/:repo/pulls/comments/:number'],

  // Repositories
  ['GET', '/user/repos', '/user/repos'],
  ['GET', '/users/:user/repos', '/users/fundon/repos'],
  ['GET', '/orgs/:org/repos', '/orgs/trekjs/repos'],
  ['GET', '/repositories', '/repositories'],
  ['POST', '/user/repos', '/user/repos'],
  ['POST', '/orgs/:org/repos', '/orgs/trekjs/repos'],
  ['GET', '/repos/:owner/:repo', '/repos/trekjs/trek'],
  //['PATCH', '/repos/:owner/:repo'],
  [
    'GET',
    '/repos/:owner/:repo/contributors',
    '/repos/trekjs/trek/contributors'
  ],
  ['GET', '/repos/:owner/:repo/languages', '/repos/trekjs/trek/languages'],
  ['GET', '/repos/:owner/:repo/teams', '/repos/trekjs/trek/teams'],
  ['GET', '/repos/:owner/:repo/tags', '/repos/trekjs/trek/tags'],
  ['GET', '/repos/:owner/:repo/branches', '/repos/trekjs/trek/branches'],
  [
    'GET',
    '/repos/:owner/:repo/branches/:branch',
    '/repos/trekjs/trek/branches/master'
  ],
  ['DELETE', '/repos/:owner/:repo', '/repos/trekjs/trek'],
  [
    'GET',
    '/repos/:owner/:repo/collaborators',
    '/repos/trekjs/trek/collaborators'
  ],
  [
    'GET',
    '/repos/:owner/:repo/collaborators/:user',
    '/repos/trekjs/trek/collaborators/fundon'
  ],
  [
    'PUT',
    '/repos/:owner/:repo/collaborators/:user',
    '/repos/trekjs/trek/collaborators/fundon'
  ],
  [
    'DELETE',
    '/repos/:owner/:repo/collaborators/:user',
    '/repos/trekjs/trek/collaborators/fundon'
  ],
  ['GET', '/repos/:owner/:repo/comments', '/repos/trekjs/trek/comments'],
  [
    'GET',
    '/repos/:owner/:repo/commits/:sha/comments',
    '/repos/trekjs/trek/commits/abcdefgh/comments'
  ],
  [
    'POST',
    '/repos/:owner/:repo/commits/:sha/comments',
    '/repos/trekjs/trek/commits/abcdefgh/comments'
  ],
  [
    'GET',
    '/repos/:owner/:repo/comments/:id',
    '/repos/trekjs/trek/comments/1024'
  ],
  //['PATCH', '/repos/:owner/:repo/comments/:id'],
  [
    'DELETE',
    '/repos/:owner/:repo/comments/:id',
    '/repos/trekjs/trek/comments/1024'
  ],
  ['GET', '/repos/:owner/:repo/commits', '/repos/trekjs/trek/commits'],
  [
    'GET',
    '/repos/:owner/:repo/commits/:sha',
    '/repos/trekjs/trekj/commits/abcdefgh'
  ],
  ['GET', '/repos/:owner/:repo/readme', '/repos/trekjs/trek/readme'],
  //['GET', '/repos/:owner/:repo/contents/*path'],
  //['PUT', '/repos/:owner/:repo/contents/*path'],
  //['DELETE', '/repos/:owner/:repo/contents/*path'],
  //['GET', '/repos/:owner/:repo/:archive_format/:ref'],
  ['GET', '/repos/:owner/:repo/keys', '/repos/trekjs/trek/keys'],
  ['GET', '/repos/:owner/:repo/keys/:id', '/repos/treks/trek/keys/abcdefgh'],
  ['POST', '/repos/:owner/:repo/keys', '/repos/trekjs/trek/keys'],
  //['PATCH', '/repos/:owner/:repo/keys/:id'],
  ['DELETE', '/repos/:owner/:repo/keys/:id', '/repos/trekjs/trek/keys/233'],
  ['GET', '/repos/:owner/:repo/downloads', '/repos/trekjs/trek/downloads'],
  [
    'GET',
    '/repos/:owner/:repo/downloads/:id',
    '/repos/trekjs/trek/downloads/233'
  ],
  [
    'DELETE',
    '/repos/:owner/:repo/downloads/:id',
    '/repos/trekjs/trek/downloads/987'
  ],
  ['GET', '/repos/:owner/:repo/forks', '/repos/trekjs/trek/forks'],
  ['POST', '/repos/:owner/:repo/forks', '/repos/trekjs/trek/forks'],
  ['GET', '/repos/:owner/:repo/hooks', '/repos/trekjs/trek/hooks'],
  ['GET', '/repos/:owner/:repo/hooks/:id', '/repos/trekjs/trek/hooks/388'],
  ['POST', '/repos/:owner/:repo/hooks', '/repos/trekjs/trek/hooks'],
  //['PATCH', '/repos/:owner/:repo/hooks/:id'],
  [
    'POST',
    '/repos/:owner/:repo/hooks/:id/tests',
    '/repos/trekjs/trek/hooks/231/tests'
  ],
  ['DELETE', '/repos/:owner/:repo/hooks/:id', '/repos/trekjs/trek/hooks/231'],
  ['POST', '/repos/:owner/:repo/merges', '/repos/trekjs/trek/merges'],
  ['GET', '/repos/:owner/:repo/releases', '/repos/trekjs/trek/releases'],
  [
    'GET',
    '/repos/:owner/:repo/releases/:id',
    '/repos/trekjs/trek/releases/233'
  ],
  ['POST', '/repos/:owner/:repo/releases', '/repos/trejs/trek/releases'],
  //['PATCH', '/repos/:owner/:repo/releases/:id'],
  [
    'DELETE',
    '/repos/:owner/:repo/releases/:id',
    '/repos/trekjs/trek/releases/231'
  ],
  [
    'GET',
    '/repos/:owner/:repo/releases/:id/assets',
    '/repos/trekjs/trek/releases/233/assets'
  ],
  [
    'GET',
    '/repos/:owner/:repo/stats/contributors',
    '/repos/trekjs/trek/stats/contributors'
  ],
  [
    'GET',
    '/repos/:owner/:repo/stats/commit_activity',
    '/repos/trejs/trek/stats/commit_activity'
  ],
  [
    'GET',
    '/repos/:owner/:repo/stats/code_frequency',
    '/repos/trekjs/trek/stats/code_frequency'
  ],
  [
    'GET',
    '/repos/:owner/:repo/stats/participation',
    '/repos/trekjs/trek/stats/participation'
  ],
  [
    'GET',
    '/repos/:owner/:repo/stats/punch_card',
    '/repos/trekjs/trek/stats/punch_card'
  ],
  [
    'GET',
    '/repos/:owner/:repo/statuses/:ref',
    '/repos/trekjs/trek/statuses/dev'
  ],
  [
    'POST',
    '/repos/:owner/:repo/statuses/:ref',
    '/repos/trekjs/trek/statuses/master'
  ],

  // Search
  ['GET', '/search/repositories', '/search/repositories'],
  ['GET', '/search/code', '/search/code'],
  ['GET', '/search/issues', '/search/issues'],
  ['GET', '/search/users', '/search/users'],
  [
    'GET',
    '/legacy/issues/search/:owner/:repository/:state/:keyword',
    '/legacy/issues/search/trekjs/trek/open/iojs'
  ],
  ['GET', '/legacy/repos/search/:keyword', '/legacy/repos/search/trekjs'],
  ['GET', '/legacy/user/search/:keyword', '/legacy/user/search/go+iojs'],
  ['GET', '/legacy/user/email/:email', '/legacy/user/email/cfddream@gmail.com'],

  // Users
  ['GET', '/users/:user', '/users/fundon'],
  ['GET', '/user', '/user'],
  //['PATCH', '/user'],
  ['GET', '/users', '/users'],
  ['GET', '/user/emails', '/user/emails'],
  ['POST', '/user/emails', '/user/emails'],
  ['DELETE', '/user/emails', '/user/emails'],
  ['GET', '/users/:user/followers', '/users/fundon/followers'],
  ['GET', '/user/followers', '/user/followers'],
  ['GET', '/users/:user/following', '/users/fundon/following'],
  ['GET', '/user/following', '/user/following'],
  ['GET', '/user/following/:user', '/user/following/fundon'],
  [
    'GET',
    '/users/:user/following/:target_user',
    '/users/fundon/following/echo'
  ],
  ['PUT', '/user/following/:user', '/user/following/fundon'],
  ['DELETE', '/user/following/:user', '/user/following/fundon'],
  ['GET', '/users/:user/keys', '/users/fundon/keys'],
  ['GET', '/user/keys', '/user/keys'],
  ['GET', '/user/keys/:id', '/user/keys/233'],
  ['POST', '/user/keys', '/user/keys'],
  //['PATCH', '/user/keys/:id'],
  ['DELETE', '/user/keys/:id', '/user/keys/233']
]
