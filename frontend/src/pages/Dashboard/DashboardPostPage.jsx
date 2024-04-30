import React from 'react'
import Navbar from '../../components/wholepage/Navbar';
import PostsTable from '../../components/Displaycomponents/PostsTable';

const DashboardPostPage = ({User,userBack}) => {
  const backUsers = () => {
    userBack(User)
  };
  return (
  <>
    {User ? (
                <button className="btn btn-primary" onClick={backUsers}>Back</button>
            ) : null}

                <PostsTable User={User} Admin={true} />
    
      
  </>
    
  )
}

export default DashboardPostPage