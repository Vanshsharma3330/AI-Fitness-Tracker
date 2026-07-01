import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";


const AppContext = createContext(initialState)

export const AppProvider = ( {children} : {children: React.ReactNode} )=>{

    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)
    const [isUserFetched, setIsUserFetched] = useState(false)
    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('onboardingCompleted') === 'true'
    })
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    const signup = async (credentials: Credentials)=>{
        const {data} = await mockApi.auth.register(credentials)
        setUser(data.user)
        setOnboardingCompleted(false)
        localStorage.setItem('token', data.jwt)
        localStorage.setItem('onboardingCompleted', 'false')
    }

    const login = async (credentials: Credentials)=>{
        const {data} = await mockApi.auth.login(credentials)
        setUser({...data.user, token: data.jwt})
        const completed = localStorage.getItem('onboardingCompleted') === 'true'
        setOnboardingCompleted(completed)
        localStorage.setItem('token', data.jwt)
    }

    const fetchUser = async(token: string)=>{
        const {data} = await mockApi.user.me()
        setUser({...data, token})
        const completed = localStorage.getItem('onboardingCompleted') === 'true'
        setOnboardingCompleted(completed)
        setIsUserFetched(true)
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('onboardingCompleted')
        setUser(null)
        setOnboardingCompleted(false)
        navigate('/')
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            fetchUser(token)
        } else {
            setIsUserFetched(true)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('onboardingCompleted', String(onboardingCompleted))
    }, [onboardingCompleted])


    const value = {
        user, setUser, isUserFetched, fetchUser, signup, login, logout, onboardingCompleted, setOnboardingCompleted, allFoodLogs, allActivityLogs, setAllFoodLogs, setAllActivityLogs
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}



export const useAppContext = ()=> useContext(AppContext)