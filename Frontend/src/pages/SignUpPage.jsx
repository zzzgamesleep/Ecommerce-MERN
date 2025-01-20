import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, UserPlus, User, ArrowRight, Loader, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formdata);
  }
  const { signup, loading } = useUserStore()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (setter) => {
    setter((prevState) => !prevState);
  };
  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-black-400'>Create your account</h2>
      </motion.div>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className=" bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                Full name
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  id='name'
                  type='text'
                  required
                  value={formdata.name}
                  onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='John Doe'
                />
              </div>
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
                Email Address
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  id='email'
                  type='email'
                  required
                  value={formdata.email}
                  onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='your@example.com'
                />
              </div>
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                Password
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formdata.password}
                  onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='**********'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer' onClick={() => togglePasswordVisibility(setShowPassword)}>
                  {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
                Confirm Password
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formdata.confirmPassword}
                  onChange={(e) => setformdata({ ...formdata, confirmPassword: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='**********'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer' onClick={() => togglePasswordVisibility(setShowConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent
             rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
             hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2
             focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                  Sign up
                </>
              )}
            </button>

          </form>
          <p class="mt-8 text-center text-sm text-gray-400">
            Already have an account?
            <a href="/login" class="font-medium text-blue-400 hover:text-blue-300">
              Login here
            </a>
          </p>

        </div>
      </motion.div>
    </div>

  )
};

export default SignUpPage;
