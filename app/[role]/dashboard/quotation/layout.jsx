import { robotoSlab } from '@/app/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function Quatationlayout({ children }) {
  return (
    <div className='container'>
      <Card className='w-3xl m-auto mt-5' >
        <CardHeader>
          <CardTitle className={`${robotoSlab.className} text-center text-lg`}>
            Add Quotation
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