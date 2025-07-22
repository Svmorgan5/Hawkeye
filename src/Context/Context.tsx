
import  {createContext, useContext, useReducer} from 'react';
import type { ReactNode } from 'react'

//Define action types
type TokenAction =
| {type:"SET_TOKEN"; payload: string}
| {type:"SET_USER_ID"; payload: number}
| {type:"SET_USER_NAME"; payload:string}
| {type:"SET_USER_INSTITUTION";payload:number}
| {type:"SET_USER_IMAGE";payload:string}
| {type:"CLEAR_USER"}
| {type:"SET_LOGIN";payload:boolean}



interface TokenState {
    token: string|null;
    login: boolean|null;
    user_id:number|null;
    user_name:string|null;
    user_institution_id:number|null;
    user_image:string|null;




}

//initial state
const initialState: TokenState = {
    token: localStorage.getItem('token')||null, 
    login:false,
    user_id:0,
    user_name:'',
    user_institution_id:0,
    user_image:null,
}

//Reducer function

const tokenReducer = (
    state: TokenState,
    action: TokenAction
): TokenState => {
    switch (action.type) {
        case 'SET_TOKEN':
            localStorage.setItem('token',action.payload)
            return {...state, token:action.payload};
        case 'SET_USER_ID':
            // localStorage.setItem('user_id',`${action.payload}`)
            return {...state, user_id:action.payload};
        case 'SET_USER_NAME':
            localStorage.setItem('user_name',action.payload)
            return {...state, user_name:action.payload};
        case 'SET_USER_INSTITUTION':
            // localStorage.setItem('user_institution_id',`${action.payload}`)
            return {...state, user_institution_id:action.payload};
        case 'SET_USER_IMAGE':
            // localStorage.setItem('user_image',action.payload)
            return {...state, user_image:action.payload};
        case 'SET_LOGIN':
            return {...state, login:action.payload};
        case 'CLEAR_USER':
            localStorage.clear();
            return {
                token: null,
                user_id: null,
                login:false,
                user_name: null,
                user_institution_id: null,
                user_image: null
            };
        default:
            return state;
    }
}

interface TokenContextType extends TokenState {
    dispatch: React.Dispatch<TokenAction>
}

const TokenContext= createContext<TokenContextType|undefined>(undefined);

//Provider component
interface TokenProviderProps {
    children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps>= ({
    children,
}) => {
    const [state, dispatch] = useReducer(tokenReducer, initialState)

    return (
        <TokenContext.Provider value={{...state, dispatch}}>
            {children}
        </TokenContext.Provider>
    )
};

//custom hook for accessing the context
export const useTokenContext = (): TokenContextType => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within a TokenProvider')
    }

    return context;
}





//  <QueryClientProvider client={queryClient}>
//      <ProductProvider>
//      <CartProvider>
//       <AuthProvider>  
       
//       <BrowserRouter>  
//       <NavBar />   
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/profile' element={<Profile />} />
//             <Route path='/cart' element={<Cart />} />
//             <Route path='/register' element={<Register />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/logout' element={<Logout />} />
//             <Route path='/add' element={<AddDataForm />} />
//             <Route path='/display' element={<DisplayData />} />
//             <Route path='/displayproducts' element={<ProductEditAndDisplay />} />
//             <Route path='/displayorders' element={<DisplayOrders />} />

            
            
//           </Routes>  
      
//       </BrowserRouter>


//         </AuthProvider>
    
//     </CartProvider>
//     </ProductProvider>
//     </QueryClientProvider>

