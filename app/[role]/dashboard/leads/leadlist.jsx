import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { deleteData, readData } from '@/helper/axios';
import { Paper, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function Leadlist({setOpen,setLeadId,rows,loader, GetLeads}) {
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
    // name, country, email, phone, product_interest, status, next_followup, remark, contactpersonname
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Compnay Name", width: 180 },
    { field: "country", headerName: "Country", width: 100,renderCell: (params) =>
      params.row.country.name,
   },
    { field: "email", headerName: "Email", width: 130 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "contactpersonname", headerName: "Contact personname", width: 120 },
    { field: "product_interest", headerName: "Product interest", width: 120 },
    { field: "next_followup", headerName: "Next followup", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "remark", headerName: "Remark", width: 120 },

  ];

  const handleEdit = (data)=>{
    setLeadId(data._id)
    setOpen(true)
  }
  const handleDelete = async (data) => {
    const token = localStorage.getItem("token");
    const res = await deleteData(`/leads/dashboard/deleteLead/${data._id}`, {
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
    });
    if (res.status === true) {
      GetLeads(token)
      toast.success("Product delted scussfully!!!")
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await GetLeads(token);  // ✔️ now state update happens asynchronously
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

export default Leadlist