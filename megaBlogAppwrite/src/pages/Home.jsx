import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components';
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/postSlice";

const POSTS_PER_PAGE = 4;

function Home() {
    
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const authStatus = useSelector((state) => state.auth.status);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        if(posts.length === 0 && authStatus){
          appwriteService.getPosts().then((res) => {
            if (res) {
                dispatch(setPosts(res.rows));
            }
        
        }).catch((error) => {
            console.log("Appwrite service :: getPosts :: error", error);
        });
    }
    }, [dispatch, authStatus]);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  
    if (posts.length === 0 && authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                             No post available yet.
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    
    }
    if(!authStatus){
            return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                              Please, Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
}
    return (
        <div className='w-full py-8'>
            <Container>
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
        </div>
    )
}

export default Home