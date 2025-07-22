
import  {createContext, useContext, useReducer} from 'react';
import type { ReactNode } from 'react'

//Define action types
type InstitutionAction =
| {type:"SET_INST_ID";payload:number}
| {type:"SET_INST_NAME"; payload: string}
| {type:"SET_IS_SCHOOL"; payload: boolean}
| {type:"SET_INST_ADDRESS"; payload:string}
| {type:"SET_INST_PHONE";payload:string}
| {type:"SET_INST_LOGO";payload:string}
| {type:"SET_INST_IMAGE1";payload:string}
| {type:"SET_INST_IMAGE2";payload:string}
| {type:"CLEAR_INSTITUTION"}


interface InstitutionState {
    instId:number;
    instName:string;
    instType:boolean;
    instAddress:string;
    instPhone:string;
    instLogo:string|null;
    instImage1:string|null;
    instImage2:string|null;
    

}

//initial state
const initialState: InstitutionState = {
    instId:0,
    instName:'',
    instType:true,
    instAddress:'',
    instPhone:'',
    instLogo:null,
    instImage1:null,
    instImage2:null,
}

//Reducer function

const institutionReducer = (
    state: InstitutionState,
    action: InstitutionAction
): InstitutionState => {
    switch (action.type) {
        case 'SET_INST_ID':
            return {...state, instId:action.payload};
        case 'SET_INST_NAME':
            return {...state, instName:action.payload};
        case 'SET_IS_SCHOOL':
            return {...state, instType:action.payload};
        case 'SET_INST_ADDRESS':
            return {...state, instAddress:action.payload};
        case 'SET_INST_PHONE':
            return {...state, instPhone:action.payload};
        case 'SET_INST_LOGO':
            return {...state, instLogo:action.payload};
        case 'SET_INST_IMAGE1':
            return {...state, instImage1:action.payload};
        case 'SET_INST_IMAGE2':
            return {...state, instImage2:action.payload};
        case 'CLEAR_INSTITUTION':
            return initialState;
        default:
            throw new Error (`Unhandled action type`)
    }
}

interface InstitutionContextType extends InstitutionState {
    dispatch: React.Dispatch<InstitutionAction>
}

const InstitutionContext= createContext<InstitutionContextType|undefined>(undefined);

//Provider component
interface InstitutionProviderProps {
    children: ReactNode;
}

export const InstitutionProvider: React.FC<InstitutionProviderProps>= ({
    children,
}) => {
    const [state, dispatch] = useReducer(institutionReducer, initialState)

    return (
        <InstitutionContext.Provider value={{...state, dispatch}}>
            {children}
        </InstitutionContext.Provider>
    )
};

//custom hook for accessing the context
export const useInstitutionContext = (): InstitutionContextType => {
    const context = useContext(InstitutionContext);
    if (!context) {
        throw new Error('useInsitituionContext must be used within a InstitutionProvider')
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

