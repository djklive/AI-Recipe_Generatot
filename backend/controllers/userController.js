import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';

/**
 * Get user profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const preferences = await UserPreferences.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                user,
                preferences
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const user = await User.update(req.user.id, {name, email});

        res.json({
            success: true,
            message: 'Profile updated succesfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res, next) => {
    try {
        const preferences = await UserPreferences.upsert(req.user.id, req.body);

        res.json({
            success: true,
            message: 'Preferences updated succesfully',
            data: { preferences }
        })
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Verify current password
        const user = await User.findByEmail(req.user.email);
        const isValid = await User.verifyPassword(currentPassword, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: true,
                message: 'Current password is incorrect'
            });
        }

        //Update password
        await User.updatePassword(req.user.id, newPassword);

        res,json({
            success: true,
            message: 'Password changed succesfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete account
 */
export const deleteAccount = async (req, res, next) => {
    try {
        await User.delete(req.user.id);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}