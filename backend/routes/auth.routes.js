const url = require('url');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (path === '/api/auth/register' && req.method === 'POST') {
        authController.register(req, res);
    } else if (path === '/api/auth/login' && req.method === 'POST') {
        authController.login(req, res);
    } else if (path === '/api/auth/profile' && req.method === 'GET') {
        authMiddleware(req, res, () => {
            authController.getProfile(req, res);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
