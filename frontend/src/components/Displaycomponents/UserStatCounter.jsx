import React, { useState, useEffect } from "react";
import client from "../../api/client"; // Assuming you have a client for making API requests

const UserStatCounter = ({ user_ID }) => {
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await client.get(
          `users/users/total_counts_for_user/?user_id=${user_ID}`
        );

        setUserStats(response.data);
      } catch (error) {
        console.error("Error fetching user statistics:", error.message);
      }
    };

    fetchUserStats();
  }, [user_ID]);

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
      {userStats ? (
        <>
        <h1 className="text-3xl font-semibold mb-8">User Statistics</h1>

          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Total Transactions:</div>
              <div className="stat-value">{userStats.total_transactions}</div>
              <div className="stat-desc">User Transactions</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Inquiries: </div>
              <div className="stat-value">{userStats.total_inquiries}</div>
              <div className="stat-desc">User Inquiries</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Posts:</div>
              <div className="stat-value">{userStats.total_posts}</div>
              <div className="stat-desc">User Posts</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Posts:</div>
              <div className="stat-value">{userStats.total_posts}</div>
              <div className="stat-desc">User Posts</div>
            </div>
            <div>
        
            </div>
          </div>
          <div className="stats stats-vertical lg:stats-horizontal shadow mt-3">
            
            <div className="stat">
              <div className="stat-title">Total Damaged Items:</div>
              <div className="stat-value">{userStats.total_damaged_items}</div>
              <div className="stat-desc">User Damaged Items</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Broken Items:</div>
              <div className="stat-value">{userStats.total_broken_items}</div>
              <div className="stat-desc">User Broken Items</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Lost Items:</div>
              <div className="stat-value">{userStats.total_lost_items}</div>
              <div className="stat-desc">User Lost Items</div>
            </div>
            <div className="stat">
              <div className="stat-title"> Total Donated Items</div>
              <div className="stat-value"> {userStats.total_donated_items}</div>
              <div className="stat-desc">Total Donated Items</div>
            </div>
        
          </div>
        </>
      ) : (
        <p>Loading user statistics...</p>
      )}
    </div>
  );
};

export default UserStatCounter;
