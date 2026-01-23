import { robotoSlab } from '@/app/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function UserListlayout({ children }) {
    return (
        <div className='container'>
            <Card className='w-4xl m-auto mt-5' >
                <CardHeader>
                    <CardTitle className={`${robotoSlab.className}  text-lg`}>
                       UserList
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{children}</div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserListlayout