const express=require("express");
const User= require("../UserSchema")

async function Streak(userId) {

    try {

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const now = new Date();
        const lastUpdated = user.streak?.lastUpdated;
        
        let newStreak = 1;
        let shouldUpdate = true;

        if (lastUpdated) {
          
            const last = new Date(lastUpdated);
            last.setHours(0, 0, 0, 0);
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
             
                shouldUpdate = false;
            } else if (diffDays === 1) {
         
                newStreak = user.streak.current + 1;
            } else if (diffDays > 1) {
            
                newStreak = 1;
            }
        }

        if (shouldUpdate) {
            const update = {
                'streak.lastUpdated': now,
                'streak.current': newStreak
            };
            
            await User.findByIdAndUpdate(userId, update);
        }

        return { success: true, newStreak };
        
      


    } catch (error) {
        console.error("Error updating streak:", error);
        throw error;
    }
}

module.exports=Streak;






