import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { setPosts } from "../store/postSlice";

const POSTS_PER_PAGE = 4;

function AllPosts() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        if(posts.length === 0){
        appwriteService.getPosts([]).then((res) => {
            if (res) {
                dispatch(setPosts(res.rows))
            }
        })
    }
    }, [dispatch])

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOption) {
        case "newest":
            return new Date(b.$createdAt) - new Date(a.$createdAt);
        case "oldest":
            return new Date(a.$createdAt) - new Date(b.$createdAt);
        case "az":
            return a.title.localeCompare(b.title);
        case "za":
            return b.title.localeCompare(a.title);
        default:
            return 0;
    }
});

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption]);

    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    return (
        <Container>
            <div className="mb-6">
                
                <input
                    type="text"
                    placeholder="Search posts by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2 mt-1 marker:border rounded-lg outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">Title: A-Z</option>
                    <option value="za">Title: Z-A</option>
                </select>
            </div>

            <div className='flex flex-wrap'>
                {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))
                ) : (
                    <p className="w-full text-center text-gray-500 py-6">No posts found.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded ${currentPage === page ? "bg-black text-white" : ""}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </Container>
    )
}

export default AllPosts