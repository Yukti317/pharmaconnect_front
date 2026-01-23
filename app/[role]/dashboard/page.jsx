'use client'

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { readData } from '@/helper/axios'
import { Tooltip } from 'bootstrap'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Rectangle, XAxis, YAxis } from 'recharts'
import dateFormat, { masks } from "dateformat";
function AdminDashboardPage() {
  const [dashboarddata, setDashboard] = useState([])
  const role = localStorage.getItem('userrole')
  const dashboardData = async (token) => {
    const res = await readData(`/admin/dashboard/stat`, {
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
    });
    if (res.success === true) {
      setDashboard(res)
    }
  }

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
console.log("dashboarddata",dashboarddata)
  const chartData = dashboarddata?.charts?.leadsByCountry.map((item, index) => {
    const key = item.country?.name?.toLowerCase();
    return {
      browser: key,
      visitors: item.count,
      fill: `var(--color-${key})`,
    };
  });

  const chartConfig = {
    visitors: { label: "Visitors" },
  };

  dashboarddata?.charts?.leadsByCountry.forEach((item, index) => {
    const key = item.country.name.toLowerCase();
    chartConfig[key] = {
      label: item.country,
      color: COLORS[index],
    };
  });


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await dashboardData(token);  // ✔️ now state update happens asynchronously
    };

    fetchData();
  }, [])

  return (
    <>
      <h3 className='headtxt-color'>Dashboard</h3>
      <div className='row mt-4'>

        <>
          {role === 'bde' ? <></> :
            <div className='col-3'>
              <Card>
                <CardContent>
                  <div>
                    <Link href='/admin/dashboard/userlist' className='text-lg font-bold headtxt-color'>
                      Total Users
                    </Link>
                  </div>
                  <p>{dashboarddata?.stats?.users}</p>
                </CardContent>
              </Card>
            </div>}
          <div className='col-3'>
            <Card>
              <CardContent>
                <div>
                  <Link href='' className='text-lg font-bold headtxt-color'>
                    Total Leads
                  </Link>
                </div>
                <p>{dashboarddata?.stats?.leads}</p>
              </CardContent>
            </Card>
          </div>
          <div className='col-3'>
            <Card>
              <CardContent>
                <div>
                  <Link href='' className='text-lg font-bold headtxt-color'>
                    Total Quotations
                  </Link>
                </div>
                <p>{dashboarddata?.stats?.quotations}</p>
              </CardContent>
            </Card>
          </div>
          <div className='col-3'>
            <Card>
              <CardContent>
                <div>
                  <Link href='' className='text-lg font-bold headtxt-color'>
                    Total Exports
                  </Link>
                </div>
                <p>{dashboarddata?.stats?.exports}</p>
              </CardContent>
            </Card>
          </div>
        </>


      </div>

      <div className='charts mt-5 mb-5'>
        <div className='row'>
          <div className='col-6'>
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Leads by Country</CardTitle>

              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="visitors"
                      nameKey="browser"
                      stroke="0"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>

            </Card>
          </div>
          <div className='col-6'>
            <Card className='h-[347px]'>
              <CardHeader className="items-center pb-0">
                <CardTitle>Follow-up Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <table class="table table-striped followuptable">
                  <thead>
                    <tr>
                      <th scope="col">Client Name</th>
                      <th scope="col">Country </th>
                      <th scope="col">Next Follow-up</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboarddata?.followups?.slice(0, 5).map((data) => (
                      <>
                        <tr>
                          <td>{data.clientName}</td>
                          <td>{data.country.name}</td>
                          <td>{dateFormat(data.mongoDate, "mmm d, yyyy")}</td>
                          <td>{data.status}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
                {dashboarddata?.followups?.length > 5 ? <Link href={''} className='d-flex justify-end text-sm font-bold'>View More</Link> : ""}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </>
  )
}

export default AdminDashboardPage