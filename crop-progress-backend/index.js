const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const db = require('./db.js');
const fieldManagementRoutes = require('./routes/field-management.js');


app.use(express.json());
// Simple CORS - allow everything
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Origin', 'Pragma']
}));
app.use('/api/auth', authRoutes);
app.use('/api/field-management', fieldManagementRoutes);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})