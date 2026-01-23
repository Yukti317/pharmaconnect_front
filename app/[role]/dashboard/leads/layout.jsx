import { Card } from '@/components/ui/card'
import React from 'react'

function LeadesLayout({children}) {
    return (
        <div className='container'>
            <Card className='w-4xl m-auto mt-5' >
                {children}
            </Card>
        </div>
    )
}

export default LeadesLayout