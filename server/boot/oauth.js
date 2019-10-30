'use strict';

const path = require('path');
const oauth2 = require('loopback-component-oauth2');

module.exports = function(app) {
  // set up view engine
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'hbs');

  // set up oauth Authorization server and Resource server
  const options = {
    dataSource: app.dataSources.db, // Data source for OAuth2 metadata persistence

    /*
     * authorization server options
     */
    authorizationServer: true,

    loginPage: '/oauth/login', // custom the login page URL
    loginPath: '/oauth/login', // custom the login form processing URL
    loginFailPage: '/oauth/login?fail',

    authorizePath: '/oauth/authorize', // custom the path to mount the authorization endpoint
    tokenPath: '/oauth/token', // custom the path to mount the token endpoint

    // grant types that should be enabled
    supportedGrantTypes: [
      'implicit',
      'jwt',
      'clientCredentials',
      'authorizationCode',
      'refreshToken',
      'resourceOwnerPasswordCredentials',
    ],

    /*
     * resource server options
     */
    resourceServer: true,
  };

  // initialize authorization server
  oauth2.oAuth2Provider(
    app, // The app instance
    options // The options
  );

  // protect endpoints with OAuth 2.0
  app.use(['/api'], oauth2.authenticate(options));

  const router = app.loopback.Router();

  // render user login page
  router.get(options.loginPage, function(req, res) {
    res.render('login', {
      loginFailed: req.query && req.query.fail == '' ? true : false,
    });
  });

  router.get('/oauth', function(req, res) {
    res.render('oauth', {
      host: 'localhost:3000',
    });
  });

  app.use(router);
};
