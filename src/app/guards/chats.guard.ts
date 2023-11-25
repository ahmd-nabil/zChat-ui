import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";

export const canActivateChats : CanActivateFn =
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const oauthService = inject(OAuthService);
    return oauthService
            .loadDiscoveryDocumentAndTryLogin()
            .then((res) => {
                return oauthService.hasValidIdToken() && oauthService.hasValidAccessToken()
            });
};