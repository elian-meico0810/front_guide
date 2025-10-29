export const environment = {
  apiAuthUrl: "https://portal.meico.local/auth-meico/",
  idAplicacion: "3",
  azure: {
    clientId: 'a91c9d2f-a0e0-478b-a265-4a1da3d441a3',
    authority: 'https://login.microsoftonline.com/a06d2c92-7803-417f-9812-16af600fee47',
    loginRedirectUri: 'https://portal.meico.local/modulo-de-seguridad',
    logoutRedirectUri: 'https://portal.meico.local/modulo-de-seguridad/',
    scopes: ['User.Read'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
