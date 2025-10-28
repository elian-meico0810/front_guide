import { MsalGuardConfiguration, MsalInterceptorConfiguration } from "@azure/msal-angular";
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";
import { environment } from "src/environments/enviroments";

/**
 * Funcion para obtener la configuracion de la instancia de MSAL
 * @returns Instancia de MSAL
 */
export function MsalInstance(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      redirectUri: environment.azure.loginRedirectUri,
      postLogoutRedirectUri: environment.azure.logoutRedirectUri,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false
    }
  });
}

/**
 * Funcion para obtener la configuracion del interceptor de MSAL
 * @returns Configuracion del interceptor
 */
export function MsalInterceptorConfig(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.azure.uri, environment.azure.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

/**
 * Funcion para obtener la configuracion del guard de MSAL
 * @returns Configuracion del Guard
 */
export function MsalGuardConfig(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.azure.scopes],
    },
    loginFailedRoute: environment.azure.logoutRedirectUri,
  };
}
