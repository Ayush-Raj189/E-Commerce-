import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { loginFormControls } from '../../components/config'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/auth-slice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const initialState = {
  email: "",
  password: "",
}

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    })
  }

  return (
    <motion.div
      className='mx-auto w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-10 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]'>
          Sign In to your account
        </h1>
        <p className='mt-3 text-gray-400'>
          Don’t have an account?
          <Link
            className='ml-1 font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent hover:underline'
            to='/auth/register'
          >
            Register
          </Link>
        </p>
      </div>

      {/* Form */}
      <div className='space-y-6'>
        <CommonForm
          formControls={loginFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          buttonText="Sign In"
        />
      </div>

      {/* Divider */}
      <div className='relative mt-6'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-gray-700'></span>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='bg-background px-2 text-gray-400'>Welcome Back!</span>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthLogin
