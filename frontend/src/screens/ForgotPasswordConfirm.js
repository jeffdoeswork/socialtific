import React, {  useEffect, useState } from 'react'
import axios from "axios"
import PasswordChangeForm from '../components/PasswordChangeForm'

export default function FogotPasswordConfirm({history}) {
    const [sent, setSent] = useState()
    const [showForm, setShowForm] = useState()
    const [user, setUser] = useState()
    const token = history.location.search.split('=')[1]

    
    useEffect(()=>{
        if (!sent){
            axios.get(`/api/users/verify/token=${token}`)
            .then(res=>
                {
                console.log(res)
                    setShowForm(true)
                    setSent(true)
                    setUser(res.data.user)})
            .catch(err=>console.log(err.response))
        }
    }, [sent, showForm, token])

    return (
        
        <div>
            { !sent ? (
            <p>Please wait while we confirm your information </p> ): showForm && 
           <PasswordChangeForm  title="Change Password" user={user} history={history}/> }
        </div>
    )
}

