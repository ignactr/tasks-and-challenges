const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const challenges = require('../models/Challenges')
const bcrypt = require('bcrypt');
const logCheck = require('../middlewares/logCheck');

router.post('/delete', logCheck, async (req, res) => {
    try {
        const userId = req.userId;
        const givenPassword = req.body.password
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const password = user.password;
        if (!givenPassword || !password) {
            res.status(510).json({ error: 'Invalid password or hash' }); //510 invalid password or hash
            return;
        }
        const match = await bcrypt.compare(givenPassword, password);
        if (match) {
            const user = await users.findOne({ _id: givenId });
            if (!user) {
                res.status(410).json({ error: 'No user found' }); //410 no user found
                return;
            }
            const challengesOfThatUser = await challenges.find({ $and: [{ author: user.login }, { challengeState: { $ne: 3 } }] }, null, {}).select('_id');
            const challengeIds = challengesOfThatUser.map(challenge => challenge._id);

            await comments.deleteMany({ challengeId: { $in: challengeIds } }); // Delete comments associated with challengeIds
            await challenges.deleteMany({ _id: { $in: challengeIds } }); // Delete challenges associated with user
            await users.findOneAndRemove({ _id: givenId }, { new: true }); // Finally, delete that user
            res.status(205).json({ message: 'Successfully deleted' }); //205 successfully deleted 
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});
router.post('/changePassword', logCheck, async (req, res) => {
    try {
        const userId = req.userId;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters long' });
            return;
        }
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const password = user.password;
        if (!oldPassword || !password) {
            res.status(510).json({ error: 'Invalid password or hash' }); //510 invalid password or hash
            return;
        }
        const match = await bcrypt.compare(oldPassword, password);
        if (match) {
            const saltValue = bcrypt.genSaltSync(10);
            const encryptedPassword = await bcrypt.hash(newPassword, saltValue)
            await users.findOneAndUpdate({ _id: userId }, { password: encryptedPassword }, { new: true });
            res.status(205).json({ message: 'Successfully updated password' }); //205 successfully updated password
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;