import { OAuth2Client } from 'google-auth-library';
import http from 'node:http'
import url from 'node:url'
import open from 'open'
import serverDestroy from 'server-destroy'

import keys from './.creds.json' assert { type: 'json' }

const createServer = new Promise((resolve, reject) => {
  const oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0],
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: process.env.ACCESS_TYPE,
    scope: process.env.SCOPE,
  });

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url.indexOf(process.env.CALLBACK_PATH) > -1) {
        const qs = new url.URL(req.url, process.env.CALLBACK_BASE_URL).searchParams;
        const code = qs.get('code');
        res.end('Authentication successful! Please return to the console.');
        server.destroy();

        const r = await oAuth2Client.getToken(code);
        console.info('Tokens acquired.');
        console.log(r.tokens);
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).listen(3000, () => {
    open(authorizeUrl, { wait: false }).then(cp => cp.unref());
  });
  serverDestroy(server);
});

createServer.catch(console.error);
