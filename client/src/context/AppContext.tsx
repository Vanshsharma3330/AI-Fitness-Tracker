import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";


const AppContext = createContext(initialState)

export const AppProvider = ( {children} : {children: React.ReactNode} )=>{

    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token') ? false : true)
    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('onboardingCompleted') === 'true'
    })
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    const resetSessionState = () => {
        setUser(null)
        setIsUserFetched(false)
        setOnboardingCompleted(false)
        setAllFoodLogs([])
        setAllActivityLogs([])
    }

    const signup = async (credentials: Credentials)=>{

        try {
            const {data} = await api.post('/api/auth/local/register', credentials)

            resetSessionState()
            setUser({...data.user, token: data.jwt})
            setOnboardingCompleted(Boolean(data?.user?.age && data?.user?.weight && data?.user?.goal))
            localStorage.setItem('token', data.jwt)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`
            await fetchUser(data.jwt)
            await fetchFoodLogs(data.jwt)
            await fetchActivityLogs(data.jwt)
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    const login = async (credentials: Credentials)=>{
        try {
            const {data} = await api.post('/api/auth/local', {identifier: credentials.email, password: credentials.password})
            resetSessionState()
            setUser({...data.user, token: data.jwt})
            setOnboardingCompleted(Boolean(data?.user?.age && data?.user?.weight && data?.user?.goal))
            localStorage.setItem('token', data.jwt)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`
            await fetchUser(data.jwt)
            await fetchFoodLogs(data.jwt)
            await fetchActivityLogs(data.jwt)
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    const fetchUser = async(token: string)=>{
        try {
            const {data} = await api.get('/api/users/me', {headers: {Authorization: `Bearer ${token}`}})
        setUser({...data, token})
        setOnboardingCompleted(Boolean(data?.age && data?.weight && data?.goal))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
        setIsUserFetched(true);
    }

    const fetchFoodLogs = async (token: string)=>{
        try {
            const {data} = await api.get('/api/food-logs', {headers: {Authorization: `Bearer ${token}`}})
            setAllFoodLogs(data)

        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    const fetchActivityLogs = async (token: string)=>{
        try {
            const {data} = await api.get('/api/activity-logs', {headers: {Authorization: `Bearer ${token}`}})
            setAllActivityLogs(data)

        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('onboardingCompleted')
        resetSessionState()
        setIsUserFetched(true)
        api.defaults.headers.common['Authorization'] = ''
        navigate('/')
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            void (async ()=>{
                await fetchUser(token)
                await fetchFoodLogs(token)
                await fetchActivityLogs(token)
            })()
        }
    }, [])

    useEffect(() => {
        if (user) {
            localStorage.setItem('onboardingCompleted', String(onboardingCompleted))
        } else {
            localStorage.removeItem('onboardingCompleted')
        }
    }, [onboardingCompleted, user])


    const value = {
        user, setUser, isUserFetched, fetchUser, signup, login, logout, onboardingCompleted, setOnboardingCompleted, allFoodLogs, allActivityLogs, setAllFoodLogs, setAllActivityLogs
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}



export const useAppContext = ()=> useContext(AppContext)