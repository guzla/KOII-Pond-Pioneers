import express from 'express';
import { userProfileService } from '../services/UserProfileService';

const router = express.Router();

/**
 * POST /profile - Create a new user profile
 */
router.post('/profile', (req, res) => {
  try {
    const { walletAddress, username, email, metadata } = req.body;
    
    const profile = userProfileService.createProfile({
      walletAddress,
      username,
      email,
      metadata
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error creating profile' 
    });
  }
});

/**
 * PUT /profile/:id - Update an existing user profile
 */
router.put('/profile/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, metadata } = req.body;

    const updatedProfile = userProfileService.updateProfile(id, {
      username,
      email,
      metadata
    });

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error updating profile' 
    });
  }
});

/**
 * GET /profile - Get all profiles
 */
router.get('/profile', (req, res) => {
  try {
    const profiles = userProfileService.getAllProfiles();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error retrieving profiles' 
    });
  }
});

/**
 * DELETE /profile/:id - Delete a user profile
 */
router.delete('/profile/:id', (req, res) => {
  try {
    const { id } = req.params;
    userProfileService.deleteProfile(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ 
      message: error instanceof Error ? error.message : 'Error deleting profile' 
    });
  }
});

export default router;