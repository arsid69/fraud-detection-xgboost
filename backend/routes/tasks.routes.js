const url = require('url');
const tasksController = require('../controllers/tasks.controller');
const authMiddleware = require('../middleware/auth.middleware');

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    authMiddleware(req, res, () => {
        if (path === '/api/tasks' && req.method === 'GET') {
            tasksController.getAllTasks(req, res);
        } else if (path === '/api/tasks' && req.method === 'POST') {
            tasksController.createTask(req, res);
        } else if (path.match(/\/api\/tasks\/\d+/) && req.method === 'PUT') {
            tasksController.updateTask(req, res);
        } else if (path.match(/\/api\/tasks\/\d+/) && req.method === 'DELETE') {
            tasksController.deleteTask(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
};
