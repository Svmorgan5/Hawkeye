
import  {createContext, useContext, useReducer} from 'react';
import type { ReactNode } from 'react'

//Define action types
type TokenAction =
| {type:"SET_TOKEN"; payload: string};


interface TokenState {
    token: string;

}

//initial state
const initialState: TokenState = {
    token: '', 
}

//Reducer function

const tokenReducer = (
    state: TokenState,
    action: TokenAction
): TokenState => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {...state, token:action.payload};

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

