import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
import { addPost } from '../store/postSlice';

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const postsFromStore = useSelector((state) => state.posts.posts)

    useEffect(() => {
        if (slug) {
            setPost(null);
            const existingPost = postsFromStore.find((p) => p.$id === slug)
            if (existingPost) {
                setPost(existingPost)
            } else {
                appwriteService.getPost(slug).then((fetchedPost) => {
                    if (fetchedPost) {
                        setPost(fetchedPost)
                        
                        dispatch(addPost(fetchedPost))
                    }
                })
            }
        } else {
            navigate('/')
        }
    }, [slug, navigate, dispatch, postsFromStore])

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost