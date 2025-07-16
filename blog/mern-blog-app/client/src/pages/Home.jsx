import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';
import Post from '../components/Blog/Post';
import Pagination from '../components/Pagination/Pagination';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (page) => {
    setLoading(true);
    const data = await postService.getAllPosts(page);
    setPosts(data.posts);
    setTotalPosts(data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="home">
      <h1>Blog Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPosts={totalPosts}
            postsPerPage={10}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Home;