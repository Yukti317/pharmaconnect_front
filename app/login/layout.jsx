import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { robotoSlab } from '../layout'
import Image from 'next/image'
import logo from '../../public/assets/logo.png'

function LoginPageLayout({ children }) {
    return (
        <div className='container'>
            <Card className='w-md m-auto mt-5' >
                <CardHeader>
                    <CardTitle className={robotoSlab.className}>
                        <div className='d-flex align-items-center justify-center'>
                            <Image src={logo} alt='logo' className='w-16' /> <span className='text-xl'>PharmaConnect</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{children}</div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPageLayout