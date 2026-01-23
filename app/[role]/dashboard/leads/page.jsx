"use client"

import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Leadsform from './leadsform'
import Leadlist from './leadlist'
import { readData } from '@/helper/axios'

function LeadesPage() {
    const [open, setOpen] = useState(false)
    const [leadId, setleadId] = useState(null)
    const [loader, setLoader] = useState(false)
    const [rows, setRows] = useState([]);

    const Getleads = async (token) => {
        setLoader(true)
        try {
            const res = await readData(`/leads/dashboard/getAllleads`, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`
                },
            });
            if (res.status === true) {
                setRows(res.leads)
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
            await Getleads(token);  // ✔️ now state update happens asynchronously
        };

        fetchData();
    }, [])

    return (
        <>
            <CardHeader>
                <CardTitle className={`text-center text-lg`}>
                    <div className='d-flex align-items-center justify-between'>
                        <div>Leads</div>
                        <div className='w-[100px]'>
                            <Button className='commonbtn mt-0' onClick={() => setOpen(true)}><PlusIcon /> Add</Button>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Leadlist setOpen={setOpen} setLeadId={setleadId} rows={rows} loader={loader} GetLeads={Getleads} />

            </CardContent>

            <Leadsform open={open} setOpen={setOpen} setLeadId={setleadId} leadId={leadId} Getleads={Getleads} />
        </>
    )
}

export default LeadesPage