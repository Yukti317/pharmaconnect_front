"use client"

import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ProductForm } from './productForm'
import Produstlist from './produstlist'
import { readData } from '@/helper/axios'

function ProductPage() {
  const [open, setOpen] = useState(false)
  const [produstId, setproductId] = useState()
  const [loader, setLoader] = useState(false)
  const [rows, setRows] = useState([]);

  const Getproducts = async (token) => {
    setLoader(true)
    try {
      const res = await readData(`/product/dashboard/getAllproducts`, {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });
      if (res.status === true) {
        setRows(res.products)
        setLoader(false)
      }
    } catch (error) {
      console.log("errorr", error)
      setLoader(false)
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await Getproducts(token);  // ✔️ now state update happens asynchronously
    };

    fetchData();
  }, [])

  return (
    <div>
      <CardHeader>
        <CardTitle className={`text-center text-lg`}>
          <div className='d-flex align-items-center justify-between'>
            <div>Produts</div>
            <div className='w-[100px]'>

              <Button className='commonbtn mt-0' onClick={() => setOpen(true)}><PlusIcon /> Add</Button>
            </div>
          </div>

        </CardTitle>
      </CardHeader>
      <CardContent>
        <Produstlist setOpen={setOpen} setproductId={setproductId} rows={rows} loader={loader} Getproducts={Getproducts}/>
      </CardContent>
      <ProductForm open={open} setOpen={setOpen} productId={produstId} Getproducts={Getproducts} />
    </div>
  )
}

export default ProductPage