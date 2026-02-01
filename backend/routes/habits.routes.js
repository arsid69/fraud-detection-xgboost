const url = require('url');
const habitsController = require('../controllers/habits.controller');
const authMiddleware = require('../middleware/auth.middleware');

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    authMiddleware(req, res, () => {
        if (path === '/api/habits' && req.method === 'GET') {
            habitsController.getAllHabits(req, res);
        } else if (path === '/api/habits' && req.method === 'POST') {
            habitsController.createHabit(req, res);
        } else if (path.match(/\/api\/habits\/\d+/) && req.method === 'PUT') {
            habitsController.updateHabit(req, res);
        } else if (path.match(/\/api\/habits\/\d+/) && req.method === 'DELETE') {
            habitsController.deleteHabit(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
};
