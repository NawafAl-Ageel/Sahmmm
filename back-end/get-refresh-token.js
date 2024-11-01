import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import { URL } from 'url';

// Add your actual credentials from Google Cloud Console here
const CLIENT_ID = '283948482860-3ig07n40iiciadedvf8aolj566tjfa20.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

async function getRefreshToken() {
    try {
        const oauth2Client = new OAuth2Client(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
        );

        const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://mail.google.com/'],
        prompt: 'consent'
        });

        console.log('\n========================================');
        console.log('Copy and paste this URL into your browser:');
        console.log('\n' + authorizeUrl + '\n');
        console.log('========================================\n');

        const server = http.createServer(async (req, res) => {
        try {
            if (req.url?.includes('/oauth2callback')) {
            const urlParams = new URL(req.url, 'http://localhost:3000');
            const code = urlParams.searchParams.get('code');
            
            if (code) {
                console.log('Authorization code received:', code);
                
                const { tokens } = await oauth2Client.getToken(code);
                console.log('\n========================================');
                console.log('YOUR REFRESH TOKEN (copy this):');
                console.log(tokens.refresh_token);
                console.log('========================================\n');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>Authentication successful!</h1><p>You can close this window and check your console for the refresh token.</p>');
                
                server.close(() => {
                console.log('Server closed. You can close this terminal window.');
                process.exit(0);
                });
            }
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Authentication failed');
        }
        });

        server.listen(3000, () => {
        console.log('Server is ready and listening on port 3000');
        });

    } catch (error) {
        console.error('Initial setup error:', error);
    }
}

console.log('Starting authentication process...');
getRefreshToken().catch(console.error);