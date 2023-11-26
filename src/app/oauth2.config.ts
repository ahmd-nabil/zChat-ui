import { OAuthService, OAuthModule, AuthConfig } from 'angular-oauth2-oidc';


export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '899635750078-tprssq98ramdjpjno28m840cocqlo8u4.apps.googleusercontent.com',
    scope: 'openid email profile',
    redirectUri: window.location.origin + '/chats',
    responseType: 'token id_token',
    strictDiscoveryDocumentValidation: false,
    logoutUrl: window.location.origin
    // silentRefreshShowIFrame: true
};