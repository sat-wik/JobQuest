const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');  // Import UUID
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Job model
const jobSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Use UUIDs for _id
  title: String,
  company: String,
  status: String,
  dateApplied: String,
});
const Job = mongoose.model('Job', jobSchema);

const { processEmails } = require('./emailParser');

// API routes
app.get('/jobs', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

app.post('/jobs', async (req, res) => {
  const newJob = new Job({
    title: req.body.title,
    company: req.body.company,
    status: req.body.status,
    dateApplied: req.body.dateApplied
  });
  const savedJob = await newJob.save();
  res.status(201).json(savedJob);
});

app.patch('/jobs/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});

app.delete('/jobs/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

app.post('/update-status-from-email', async (req, res) => {
  try {
    await processEmails();
    res.json({ message: 'Job statuses updated from emails' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job statuses', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
