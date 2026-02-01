const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

// Initialize habits table
db.run(`CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    frequency TEXT,
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)`);

const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
};

exports.getAllHabits = (req, res) => {
    db.all('SELECT * FROM habits WHERE user_id = ?', [req.userId], (err, rows) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server error' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    });
};

exports.createHabit = async (req, res) => {
    try {
        const { name, frequency } = await getRequestBody(req);
        
        db.run('INSERT INTO habits (user_id, name, frequency) VALUES (?, ?, ?)', 
            [req.userId, name, frequency], 
            function(err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                    return;
                }
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Habit created', habitId: this.lastID }));
            }
        );
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const habitId = req.url.split('/').pop();
        const { name, frequency, streak } = await getRequestBody(req);
        
        db.run('UPDATE habits SET name = ?, frequency = ?, streak = ? WHERE id = ? AND user_id = ?', 
            [name, frequency, streak, habitId, req.userId], 
            function(err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Habit updated' }));
            }
        );
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
};

exports.deleteHabit = (req, res) => {
    const habitId = req.url.split('/').pop();
    
    db.run('DELETE FROM habits WHERE id = ? AND user_id = ?', [habitId, req.userId], function(err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server error' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Habit deleted' }));
    });
};
