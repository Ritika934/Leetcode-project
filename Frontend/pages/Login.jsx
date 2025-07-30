import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from "react-redux";
import { LoginUser } from '../authslice';
import { useNavigate, NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 
import signInWithGoogle from "./firebaseConf"
import axiosclient from '../axiosclient';
import {checkAuth} from "../authslice";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const signupschema = z.object({
    emailId: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password should be of 8 characters")
});

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupschema)
    });

    const navigate = useNavigate();
    const [showPassword, setshowPassword] = useState(false);
    const[error,seterror]=useState(null)
   

        const dispatch = useDispatch();

    const { isAuthenticated} = useSelector((state) => state.slice1);
 

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async(data) => {
        seterror(null)

       const response= await dispatch(LoginUser(data));

      if(response.type==="slice1/login/rejected"){

        const errMessage=response.payload.response.data.message

        setTimeout(() => seterror(errMessage), 0)
       
        console.log(response.payload.response.data.message)
        // this console is properly printinf the error Invalid credentials
      }
    };
  
const HandleGoogleSignin=async()=>{
    try{
         const auth = getAuth(); 
         await setPersistence(auth, browserLocalPersistence); 
    const result=    await signInWithGoogle();
    const user=result.user
     const response = await axiosclient.post("/api/auth/google", {
                emailId: user.email,
                FirstName: user.displayName,
                _id: user.uid,
                photoURL: user.photoURL
            });
              if (response.status === 201) {
                await dispatch(checkAuth());
    }
}
catch (err) {
            console.error('Google sign-in error:', err);
            if (err.code !== 'auth/popup-closed-by-user') {
                seterror("Failed to sign in with Google. Please try again.");
            }

        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-300 font-mono">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">YourCode</h1>
                    <p className="mt-2 text-gray-400">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-400" htmlFor="emailId">Email</label>
                        <input
                            id="emailId"
                            type="email"
                            className={`w-full px-3 py-2 mt-1 text-white bg-[#2a2a2a] border ${errors.emailId ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 placeholder-gray-500`}
                            {...register("emailId")}
                            placeholder="you@example.com"
                        />
                        {errors.emailId && (<span className='text-sm text-red-500 mt-1'>{errors.emailId.message}</span>)}
                    </div>

                    <div className="relative">
                        <label className="text-sm font-medium text-gray-400" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-3 py-2 mt-1 text-white bg-[#2a2a2a] border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 placeholder-gray-500`}
                                {...register('password')}
                                placeholder="••••••••"
                                //  autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white'
                                onClick={() => setshowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (<span className='text-sm text-red-500 mt-1'>{errors.password.message}</span>)}
                    </div>
                    
                    <div>
                        <button className='w-full px-4 py-2 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-[#1a1a1a] transition-colors duration-200' type="submit">
                            Login
                        </button>
                    </div>
                   
                    {error && (
                        <div className="p-2 text-sm text-center text-red-500 bg-red-500/10 rounded-md">
                            {error}
                            
                        </div> 
                     )}
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-center space-x-4">
                     
                        <button aria-label="Sign in with Google" className="p-2 border
                         border-gray-600 rounded-full hover:bg-gray-700"
                        onClick={HandleGoogleSignin}>
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            
                            </svg>
                            </button>
                    </div>
                </div>

                <div className='text-center text-sm text-gray-400'>
                    Don't have an account?{' '}
                    <NavLink to="/signup" className="font-medium text-yellow-400 hover:text-yellow-500">
                        Sign up
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;





// function HandleGoogleSignIn(){

   
//    const dispatch = useDispatch()
//     const navigate= useNavigate();


//    const handleSignIn = async () => {

//   try {

// const{isAuthenticated} = useSelector((state)=>state.slice1)

//     const result = await signInWithGoogle();

//     const User =  result.user;
    
// const response = await axiosclient.post("/api/auth/google",{
            
//               emailId: User.email,
//               FirstName: User.displayName,
//               _id :User.uid
//     })


    

//   if (response.status === 201) {
    
// const response = await dispatch(checkAuth())




//       }
  
//   } 
  
//   catch (error) {
//     console.error('Google sign-in error:', error);
//   }

//  }
    
// handleSignIn()

//  return (
//     <div className="flex justify-center items-center h-screen">
//       {/* <span className="loading loading-spinner loading-lg"></span> */}
//       <p>Signing in with Google...</p>
//     </div>
//   );

// }

// export default HandleGoogleSignIn;




























