import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axiosClient from "./axiosclient";



export const registerUser=createAsyncThunk(
    'slice1/register',
    async ( userData ,{rejectWithValue}) => {
        
        try{
       const response  =  await axiosClient.post('/user/register', userData);

           return response.data.user 


        }
        catch(error){
            return rejectWithValue(error) }
  
    }
)

// export const GoogleUser = createAsyncThunk(

//     'slice1/GoogleUser',

//     async ( userData ,{rejectWithValue}) => {
        
//         try{

//        const response  =  await axiosClient.post('/api/auth/google', userData);

//            return response.data.user 
           
        

//         }

        
//         catch(error){
//             return rejectWithValue(error) }
  
//     }
// )


export const LoginUser=createAsyncThunk(
    'slice1/login',
    async(credentials,{rejectWithValue})=>{
        try{
      const response=  await axiosClient.post('/user/login',credentials);
      console.log(response.data.user.role)
      return response.data.user
    
        }  
        catch(error){
             return rejectWithValue(error);
        }
        }
    
)

export const checkAuth=createAsyncThunk(
    'slice1/check',
    async(_ ,{rejectWithValue})=>{
        try{
            const {data} = await axiosClient.get('/user/check')
            return data.user
        
        }
        catch(error){
            return rejectWithValue(error)
        }
    }
)

export const LogoutUser=createAsyncThunk(
    'slice1/logout',

    async(_,{rejectWithValue})=>{
        
        try{
            await axiosClient.post("/user/logout")
          return null
        }
        catch(error){
        return rejectWithValue(error)}

    
})

// export const GoogleUser=
const authslice = createSlice({
    name:'slice1',
    initialState:{
        user:null,
        isAuthenticated:false,
        error:false,
        loading:false
    },

    reducers:{},
    extraReducers:(builder)=>{
        builder

    .addCase(registerUser.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(registerUser.fulfilled,(state,action)=>{
        state.loading=false,
        state.isAuthenticated=!!action.payload;
        state.user=action.payload
    })
    .addCase(registerUser.rejected,(state , action)=>{
        state.loading = false,
        state.error = action.payload?.message||"Something went wrong",
        state.user = null,
        state.isAuthenticated = false
    })

    // .addCase(GoogleUser.pending,(state)=>{
    //     state.loading=true,
    //     state.error=null
    // })
    // .addCase(GoogleUser.fulfilled,(state,action)=>{
    //     state.loading=false,
    //     state.isAuthenticated=!!action.payload;
    //     state.user=action.payload
    // })
    // .addCase(GoogleUser.rejected,(state , action)=>{
    //     state.loading = false,
    //     state.error = action.payload?.message||"Something went wrong",
    //     state.user = null,
    //     state.isAuthenticated = false
    // })


    // login
.addCase(LoginUser.pending,(state)=>{
   state.loading=true,
    state.error=null
    }
)
.addCase(LoginUser.fulfilled,(state,action)=>{
    state.loading=false,
    state.isAuthenticated=!!action.payload,
    state.user=action.payload

}) 
     
.addCase(LoginUser.rejected,(state,action)=>{
    state.loading=false,
    state.error=action.payload?.message||"Something went wrong",
    state.user=null,
    state.isAuthenticated=false
})

// check
.addCase(checkAuth.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(checkAuth.fulfilled,(state,action)=>{
    state.loading=false,
    state.isAuthenticated=!!action.payload,
    state.user=action.payload
})

.addCase(checkAuth.rejected,(state,action)=>{
    state.loading=false,
    state.error=action.payload?.message||"Something went wrong",
    state.user=null,
    state.isAuthenticated=false
})
// logout
.addCase(LogoutUser.pending,(state)=>{
    state.loading=true,
    state.error=null
})

.addCase(LogoutUser.fulfilled,(state,action)=>{
    state.loading=false,
    state.error=null
    state.user=null,
    state.isAuthenticated=false
})

.addCase(LogoutUser.rejected,(state,action)=>{
    state.loading=false,
    state.error=action.payload?.message||"Something went wrong",
    state.user=null,
    state.isAuthenticated=false
})
    }
})

export default authslice.reducer;





















