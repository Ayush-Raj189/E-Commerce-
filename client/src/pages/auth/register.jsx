import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { registerFormControls } from '../../components/config'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../store/auth-slice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const initialState = {
  userName: "",
  email: "",
  password: "",
}

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data.type === 'auth/registerUser/fulfilled') {
        toast.success(data.payload?.message);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      } else if (data.type === 'auth/registerUser/rejected') {
        toast.error(data.payload?.message || "Registration failed");
      }
    });
  };

  return (
    <motion.div
      className='mx-auto w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-10 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]'>
          Create New Account
        </h1>
        <p className='mt-3 text-gray-400'>
          Already have an account?
          <Link
            className='ml-1 font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:underline'
            to='/auth/login'
          >
            Login
          </Link>
        </p>
      </div>

      {/* Form */}
      <div className='space-y-6'>
        <CommonForm
          formControls={registerFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          buttonText="Create Account"
        />
      </div>

      {/* Divider */}
      <div className='relative mt-6'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-gray-700'></span>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='bg-background px-2 text-gray-400'>Join the Community!</span>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthRegister
