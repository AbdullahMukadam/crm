"use client"
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner';

interface Props {
    headerText: string;
    TypeofTheForm: string;
}

interface UserDetails {
    username?: string;
    password: string;
    email: string;
}

function AuthenticationForm({ headerText, TypeofTheForm }: Props) {
    const isSignUpForm = TypeofTheForm === "Signup"
    const [userData, setUserData] = useState<UserDetails>({
        username: "",
        email: "",
        password: ""
    });
    const [isLoading, setisLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setisLoading(true)
            if (isSignUpForm) {
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userCredentials: userData
                    })
                })
                if (response) {
                    const data = await response.json();
                    if (data.success) {
                        toast(`Welcome ${data.user.username}`, {
                            description: "Youll be redirected to Onboard page"
                        })
                    }
                }

            } else {
                console.log("SignInForm")
            }
        } catch (error) {
            toast("Internal Server Error")
            console.error(error)
        } finally {
            setisLoading(false)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const Inputval = e.target.value
        setUserData((prev) => ({
            ...prev,
            [e.target.id]: Inputval
        }))
    }

    return (
        <div className='w-full lg:w-1/3 h-fit mt-2 lg:mt-6 overflow-hidden rounded-2xl text-white font-brcolage-grotesque lg:flex items-center justify-center'>
            <div className='w-full'>
                <form className='w-full p-2' onSubmit={handleSubmit}>
                    <h3 className='font-bold text-2xl text-white'>{headerText || "Authentication"}</h3>
                    <section className='w-full mt-3 flex flex-col gap-3'>
                        {TypeofTheForm === "Signup" && (
                            <div className='w-full flex flex-col gap-2'>
                                <label className='text-white' htmlFor="email">Username</label>
                                <input value={userData.username} onChange={handleChange} required className=' border-[0.2px] border-gray-900 bg-zinc-900 rounded-md p-2 outline-none hover:border-gray-800' id='username' type="text" placeholder='Enter your Username' />
                            </div>
                        )}
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-white' htmlFor="email">Email Address</label>
                            <input value={userData.email} onChange={handleChange} required className=' border-[0.2px] border-gray-900 bg-zinc-900 rounded-md p-2 outline-none hover:border-gray-800' id='email' type="email" placeholder='Enter your Email Address' />
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-white' htmlFor="password">Password</label>
                            <input value={userData.password} onChange={handleChange} required className='border-[0.2px] border-gray-900 bg-zinc-900 rounded-md p-2 outline-none hover:border-gray-800' id='password' type="password" placeholder='Enter your Password' />
                        </div>
                    </section>
                    <button disabled={isLoading} className='w-full bg-white cursor-pointer text-black rounded-md py-2 mt-3'>{isLoading ? "Please Wait" : "Continue"}</button>
                </form>
                <div className='w-full items-center p-3 flex mt-3 gap-1'>
                    <hr className="h-px bg-gray-500 grow" />
                    <span>or</span>
                    <hr className="h-px bg-gray-500 grow" />
                </div>
                <button className='w-full cursor-pointer py-2 mt-3 mx-2 text-black bg-white rounded-md flex items-center justify-center gap-2'>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
                <Link className='py-2 mt-6 text-center rounded-md border bg-zinc-950 border-gray-600 text-gray-400 flex items-center justify-center gap-1 hover:text-white transition-all ease-in-out duration-200 group' href={`${TypeofTheForm === "Signup" ? "/signin" : "signup"}`}>{TypeofTheForm === "Signup" ? "Already have an account? SignIn" : "Dont have an Account? Signup"} <ArrowRightIcon size={18} className='transition-transform duration-200 ease-in-out group-hover:translate-x-2' /></Link>
            </div>
        </div>
    )
}

export default AuthenticationForm