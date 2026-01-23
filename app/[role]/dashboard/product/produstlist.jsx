import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { deleteData, readData } from '@/helper/axios';
import { Paper, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function Produstlist({setOpen,setproductId,rows,loader, Getproducts}) {
  
  const columns = [
    {
      field: "actions",
      headerName: "Actions",

      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2} className='mt-3'>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              <Edit2Icon className='text-[#192839fc]' />
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(params.row)}
            >
              <Trash2Icon className='text-[#192839fc]' />
            </Button>
          </Stack>
        );
      },
    },
    { field: "id", headerName: "ID", width: 50 },
    { field: "productname", headerName: "Product Name", width: 180 },
    { field: "category", headerName: "Category", width: 100 },
    { field: "packing", headerName: "Packing", width: 130 },
    { field: "strength", headerName: "Strength", width: 120 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "countryregistration", headerName: "Country registration", width: 120 }

  ];

  const handleEdit = (data)=>{
    setproductId(data._id)
    setOpen(true)
  }
  const handleDelete = async (data) => {
    const token = localStorage.getItem("token");
    const res = await deleteData(`/product/dashboard/deleteProduct/${data._id}`, {
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
    });
    if (res.status === true) {
      Getproducts(token)
      toast.success("Product delted scussfully!!!")
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await Getproducts(token);  // ✔️ now state update happens asynchronously
    };

    fetchData();
  }, [])

  const paginationModel = { page: 0, pageSize: 6 };
  return (
    <div>
      {loader ? <div className="d-flex justify-content-center gap-6">
        <Spinner className="size-8" />
      </div> :
        <Paper sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
            loading={loader === true}
          />
        </Paper>
      }
    </div>
  )
}

export default Produstlist