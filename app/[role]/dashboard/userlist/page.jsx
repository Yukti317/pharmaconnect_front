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
function UserList() {
  const router = useRouter()
  const [loader, setLoader] = useState(false)
  const [rows, setRows] = useState([]);

  const Getusers = async (token) => {
    setLoader(true)
    try {
      const res = await readData(`/admin/dashboard/getUsers`, {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });
      if (res.message === 'Get Users Scussfully!!!') {
        setRows(res.users)
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
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "status", headerName: "Status", width: 120 },
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

export default UserList