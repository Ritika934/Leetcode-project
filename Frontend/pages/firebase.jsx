import  signInWithGoogle from './firebaseConf';
import axiosclient from '../axiosclient';
import { useNavigate } from 'react-router';
import { useEffect,useState } from 'react';
import {checkAuth} from "../authslice"
import{useSelector,useDispatch} from "react-redux";


function HandleGoogleSignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.slice1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect to handle the Google sign-in process
    useEffect(() => {
        const initiateGoogleSignIn = async () => {
            if (isAuthenticated) {
                // If already authenticated, no need to sign in again, just navigate
                setLoading(false);
                navigate("/");
                return;
            }

            try {
                setLoading(true); // Start loading
                setError(null); // Clear any previous errorss

                // Initiate Google sign-in. This will open the pop-up.
                // The Promise resolves when the user successfully signs in and the pop-up closes.
                const result = await signInWithGoogle();
                const user = result.user; 

            console.log(user,"user")
                
                // Send user data to your backend for further authentication/registration
                const response = await axiosclient.post("/api/auth/google", {
                    emailId: user.email,
                    FirstName: user.displayName,
                    _id: user.uid,
                    photoURL:user.photoURL
                });
           

                if (response.status === 201) {
                    // Dispatch checkAuth to update Redux state with the new authentication status
                    await dispatch(checkAuth());
                }
            } catch (err) {
                console.error('Google sign-in error:', err);
                // Handle specific errors if needed (e.g., user cancelled pop-up)
                if (err.code === 'auth/popup-closed-by-user') {
                    setError("Google sign-in cancelled.");
                } else {
                    setError("Failed to sign in with Google. Please try again.");
                }
                setLoading(false); // Stop loading on error
            }
        };

        initiateGoogleSignIn();
    }, [dispatch, isAuthenticated, navigate]); // Dependencies: re-run if these change

    // Effect to handle navigation once authentication state changes
    useEffect(() => {
        // Navigate only if authenticated and the loading process has completed
        if (isAuthenticated && !loading) {
            navigate("/");
        }
    }, [isAuthenticated, loading, navigate]); // Dependencies: re-run if these change

    // Render loading UI while the process is ongoing
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-300 font-mono">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                <p className="mt-4 text-lg">Signing in with Google...</p>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
        );
    }

    // If not loading and an error occurred, display the error and a back button
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-300 font-mono text-center p-4">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-[#1a1a1a] transition-colors duration-200"
                >
                    Go back to Login
                </button>
            </div>
        );
    }

    // This component should ideally navigate away once loading is false and isAuthenticated is true.
    // If it reaches here without navigating, it means there's an unexpected state.
    return null;
}

export default HandleGoogleSignIn;




