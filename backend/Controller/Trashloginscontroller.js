import User from "../Models/UserModel.js";

export const restorelogin = async (req, res) => {
    try {
        const { _id } = req.body;
        if (_id) {
            const restorelogin = await User.findOneAndUpdate(
                { _id: req.user.userId, "logins._id": _id },
                { $set: { "logins.$.trash": false } },
                { new: true },
            );
            if (!restorelogin) {
                return res.status(404).json({ message: "login not found" });
            }
            res.status(200).json({
                message: "login restore successfully!"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "error while deleting", error: error.message })
    }
};

export const permanentlydeletelogin = async (req, res) => {
    try {
        const { _id } = req.body;
        if (_id) {
            const deletelogin = await User.findOneAndUpdate(
                { _id: req.user.userId },
                { $pull: { logins: { _id } } },
                { new: true }
            );
            if (!deletelogin) {
                return res.status(404).json({ message: "logins not found" });
            }
            res.status(200).json({
                message: "login deleted successfully!"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "error while deleting", error: error.message })
    }
};

export const trashlogins = async (req, res) => {
    try {
        const login = await User.findOne({ _id: req.user.userId })
        if (!login) {
            return res.status(404).json({ message: "login not found" });
        }
        const logins = login.logins.filter(item => item.trash);
        res.status(200).json({
            message: "logins fetch successfully!",
            deletedlogins: logins,
        });
    } catch (error) {
        res.status(500).json({ message: "error while fetch", error: error.message })
    }
};

