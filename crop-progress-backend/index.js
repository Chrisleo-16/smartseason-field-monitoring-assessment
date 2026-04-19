const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.js');
const db = require('./db.js');
const fieldManagementRoutes = require('./routes/field-management.js');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/field-management', fieldManagementRoutes);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})