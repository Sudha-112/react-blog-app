import React from 'react'
import {useDispatch} from "react-redux";
import authService from "../../appwrite/auth";
import {logout} from "../../store/authSlice";

function LogoutBtn() {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        const isConfirmed = confirm("Are you sure you want to logout?");
        if (isConfirmed) {
            authService.logout().then(() => {
            dispatch(logout())
        })
    }
}
  return (
    <button className="inline-block px-6
     py-2 duration-200 hover:bg-blue-100 text-black rounded-full"
     onClick={logoutHandler}>
        Logout</button>
  )
}

export default LogoutBtn