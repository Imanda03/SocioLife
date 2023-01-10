import User from "../routes/users.js";

/* READ*/
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(2000).json(user)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formatteFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) =>{
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(2000).json(formatteFriends)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}


/* UPDTAE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formatteFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) =>{
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(2000).json(formatteFriends)

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}