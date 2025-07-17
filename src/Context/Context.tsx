
import  {createContext, useContext, useReducer} from 'react';
import type { ReactNode } from 'react'

//Define action types
type TokenAction =
| {type:"SET_TOKEN"; payload: string}
| {type:"SET_USER_ID"; payload: number}
| {type:"SET_USER_NAME"; payload:string}
| {type:"SET_USER_INSTITUTION";payload:number}
| {type:"SET_USER_IMAGE";payload:string};


interface TokenState {
    token: string;
    user_id:number;
    user_name:string;
    user_institution_id:number;
    user_image:string;




}

//initial state
const initialState: TokenState = {
    token: '', 
    user_id:0,
    user_name:'',
    user_institution_id:0,
    user_image:'',
}

//Reducer function

const tokenReducer = (
    state: TokenState,
    action: TokenAction
): TokenState => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {...state, token:action.payload};
        case 'SET_USER_ID':
            return {...state, user_id:action.payload};
        case 'SET_USER_NAME':
            return {...state, user_name:action.payload};
        case 'SET_USER_INSTITUTION':
            return {...state, user_institution_id:action.payload};
        case 'SET_USER_IMAGE':
            return {...state, user_image:action.payload};
        default:
            throw new Error (`Unhandled action type`)
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

