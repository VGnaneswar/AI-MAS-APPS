import { gapi } from 'gapi-script';

const CLIENT_ID = '564442321016-tq2rb4o7tp5mk381krqgnnb7f8sed2v9.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDarguvTGWVV2uikwTcqZtY7OG_8d2dzzM';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

export const initGmailClient = () => {
  function start() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
      scope: SCOPES,
    });
  }

  gapi.load('client:auth2', start);
};

export const signInWithGmail = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const listGmailMessages = async () => {
  const response = await gapi.client.gmail.users.messages.list({
    userId: 'me',
    maxResults: 5,
  });

  return response.result.messages;
};
