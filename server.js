import 'dotenv/config'
import express from 'express'
import './config/connection.js'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'


const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(express.json());
 
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/', taskRoutes);
 
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));