import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const create = async(data) => {
        setError("")
        setIsLoading(true)
        try {
            const account = await authService.createAccount(data)
            if (account) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login({userData}));
                navigate("/")
            }
        } catch (err) {
            setError(err?.message || "Something went wrong. Please try again")
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create new account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>

                        <div>
                        <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        {...register("name", {
                            required:"Name is required",
                        })}
                        />
                        
                       {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}

                        </div>

                        <div>
                        <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            validate: {
                               matchPattern: (value) =>  /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim()) ||
                                                  "Please enter a valid email address",
                            }
                        })}
                        />

                        {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}

                      </div>

                      <div className="relative">
                        <Input
                        label="Password: "
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",})}
                        />

                           <button
                             type="button"
                             onClick={() => setShowPassword((prev) => !prev)}
                             className="absolute right-3 top-9 text-gray-500 text-sm"
                    >
                                 {showPassword ? "Hide" : "Show"}
                            </button>

                         {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}   
                        </div>

                        <Button type="submit" 
                        className="w-full"
                        disabled={isLoading}
                        >
                           {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup