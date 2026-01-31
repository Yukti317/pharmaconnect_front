"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Quatationlayout({children}) {
    const router = useRouter()
  return (
   <div className='container'>
            <Card className='w-4xl m-auto mt-5' >
                <CardHeader>
                    <CardTitle className={` text-lg`}>
                      <div className='d-flex align-items-center justify-between'>
                        <div>Leads</div>
                        <div className='w-[100px]'>
                            <Button className='commonbtn mt-0' onClick={()=>router.push("/admin/dashboard/quatation")}><PlusIcon /> Add</Button>
                        </div>
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

export default Quatationlayout