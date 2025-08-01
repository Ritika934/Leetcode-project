// The `reducers` property in `createSlice` is typically used for synchronous actions. 
// Since we are only handling asynchronous actions (via the thunk) in this slice, 
// we don't have any synchronous reducers to define. Hence, the `reducers` object is empty.
// **Synchronous reducers**: For actions that update the state immediately (e.g., `setCredentials`, `logout`, `clearError`).

// This behavior is built into `createAsyncThunk`. It doesn't matter what kind of request you make (POST, GET, etc.) 
// — it always generates these three action types.
// The string `'auth/register'` is the **prefix** for the three actions.
// createAsyncThunk` automatically appends `/pending`, `/fulfilled`, and `/rejected` to create the full action types.
// .addMatcher():provided by builder(object)
// function:This is useful for handling common state updates for multiple actions that share a 
// characteristic (like having a certain string in the action type, or having a certain property)
// example:.addMatcher(
// (action) => action.type.endsWith('/pending'),
// (state) => {
// state.loading = true;
// }
// )
// tate.user`:
// State.user
// - This holds the actual user data object received from the server upon successful registration
// state.isAuthenticated`:
// - This is a boolean flag indicating whether the user is authenticated (logged in).
// - We set it to `!!action.payload` which converts the `action.payload` to a boolean:
// - If `action.payload` is truthy (i.e., we have a user object), then `!!action.payload` is `true`.
// - If `action.payload` is falsy (e.g., `null` or `undefined`), then it becomes `false`.
// 
// 
// 1. Server responds with some data (e.g., a user object).

// 2. Your async thunk function returns that user object.

// 3. The thunk middleware puts that user object into the `payload` of the `fulfilled` action.

// 4. Your slice's reducer for `fulfilled` takes that `action.payload` and assigns it to `state.user`.
// 
// - The `slicer1.reducer` is the actual reducer function that handles all actions
//  (both the ones from `reducers` and `extraReducers`).

// React form hook (usefield array)
// What is name in useFieldArray?
//It's a unique key that connects your dynamic array to the form's data structure.

//Think of it like an address where React Hook Form will store/retrieve your array data.
// 1. fields: visibleFields
// Purpose:
// fields (renamed here as visibleFields) contains the current array of field objects managed by useFieldArray.

// What it contains:
// Each item in fields represents a field in your dynamic array (visibleTestCases), including:
// Your form data (input, output, explanation).
// Metadata like id (auto-generated by React Hook Form for tracking).
// 
// 2. append: appendVisible
// Purpose:
// Adds a new item to the end of the array (visibleTestCases).
// 
// how Ui changes?
// 
// 
// React detects the state change in visiblefields

// It runs the map() function again over the now-non-empty array

// For each item in visiblefields, it renders:

// A remove button

// An input field
// 
// 
// clientID (Google Client ID)
// What it is: Your app's "username" for Google.

// Analogy: Like showing your ID card to enter a club. Google checks this to confirm it's really your app requesting login.
// 
//  clientSecret (Google Client Secret)
// What it is: Your app's "password" for Google.

// Analogy: Like the PIN for your debit card. Proves you own the clientID.
// 
// callbackURL
// What it is: The "return address" where Google sends users after they login.
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 















// https://rapidapi.com/judge0-official/api/judge0-ce


// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 



// I want that in profile.jsx page on clicking updare resume button if old resume exist then a button should appear on 
// profile page only that delete old resume if user clicks on yes then navigate h im to upload resume and if old resume doesn't 
// exist then on clicking update resume new resume file should be appeared
 