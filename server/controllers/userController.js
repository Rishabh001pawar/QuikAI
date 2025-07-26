import sql from "../config/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations = await sql`Select * from creations where user_id = ${userId} order by created_at DESC`;

    res.status(200).json({ success: true, creations });

  }catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve user creations", error: error.message });
  }
}

export const getPublishedCreations = async (req, res) => {
  try {
    
    const creations = await sql`Select * from creations where publish = true order by created_at DESC`;

    res.status(200).json({ success: true, creations });

  }catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve user creations", error: error.message });
  }
}

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`Select * from creations where id = ${id} and user_id = ${userId}`;

    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes
    const userIdString = userId.toString()
    let updatedLikes;
    let message;

    if( currentLikes.includes(userIdString) ) {
      updatedLikes = currentLikes.filter(user => user !== userIdString);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdString];
      message = "Creation liked";
    }

    const formattedArray = `{${updatedLikes.join(', ')}}`;

    await sql`Update creations set likes = ${formattedArray}::text[] where id = ${id} and user_id = ${userId}`;

    res.status(200).json({ success: true, message });

  }catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve user creations", error: error.message });
  }
   
}