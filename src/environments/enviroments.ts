export const environment = {
  apiAuthUrl: "https://portal.meico.local/auth-meico/",
  apiAppUrl: "http://127.0.0.1:8000/",
  idAplicacion: "9",
  azure: {
    clientId: 'a91c9d2f-a0e0-478b-a265-4a1da3d441a3',
    authority: 'https://login.microsoftonline.com/a06d2c92-7803-417f-9812-16af600fee47',
    loginRedirectUri: 'http://localhost:4300/',
    logoutRedirectUri: 'http://localhost:4300/',
    scopes: ['User.Read'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
