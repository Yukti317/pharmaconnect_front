'use client'
import { deleteData, readData } from '@/helper/axios';
import { Paper, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { Button } from '@/components/ui/button';
import { Edit, Edit2Icon, Edit3Icon, EditIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { DataGridPro } from '@mui/x-data-grid-pro';

function QuatationList() {
  const router = useRouter()
  const [loader, setLoader] = useState(false)
  const [rows, setRows] = useState([]);

  const Getusers = async (token) => {
    setLoader(true)
    try {
      const res = await readData(`quotations/dashboard/Getallquotation`, {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });
      console.log("ress",res)
      if (res.message === 'Get Quotation Scussfully!!!') {
        setRows(res.alldata)
        setLoader(false)
      }
    } catch (error) {
      console.log("errorr", error)
      setLoader(false)
    }

  }
  const handleEdit = async (data) => {
    await router.push(`/admin/dashboard/users/${data._id}`);
  }

  const handleDelete = async (data) => {
    const token = localStorage.getItem("token");
    const res = await deleteData(`/admin/dashboard/deleteUser/${data._id}`, {
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
    });
    if(res.status === true){
      Getusers(token)
    }
  }
 const columns = [
     {
    field: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={2} className='mt-3'>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          <Edit2Icon size={16} />
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row)}
        >
          <Trash2Icon size={16} />
        </Button>
      </Stack>
    ),
  },
  {
    field: "quotation_no",
    headerName: "Quotation No",
    width: 100,
  },
  {
    field: "lead_name",
    headerName: "Lead ID",
    width: 140,
  },
  {
    field: "currency",
    headerName: "Currency",
    width: 100,
  },
  {
    field: "followup_date",
    headerName: "Follow-up Date",
    width: 150,
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
  },
  {
    field: "items",
    headerName: "Total Items",
    width: 130,
    renderCell: (params) => params.row?.items?.length || "-",
  },
 
];


  const paginationModel = { page: 0, pageSize: 10 };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await Getusers(token);  // ✔️ now state update happens asynchronously
    };

    fetchData();
  }, [])

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

export default QuatationList