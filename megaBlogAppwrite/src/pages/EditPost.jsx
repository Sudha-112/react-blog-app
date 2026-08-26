import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
import { setPosts } from '../store/postSlice' // apna path check kar lena

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const postsFromStore = useSelector((state) => state.posts.posts)

    useEffect(() => {
        if (slug) {
            const existingPost = postsFromStore.find((p) => p.$id === slug)
            if (existingPost) {
                setPost(existingPost)
            } else {
                appwriteService.getPost(slug).then((fetchedPost) => {
                    if (fetchedPost) {
                        setPost(fetchedPost)
                        // agar direct URL se aaya hai to store bhi update kar do
                        dispatch(setPosts([...postsFromStore, fetchedPost]))
                    }
                })
            }
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost