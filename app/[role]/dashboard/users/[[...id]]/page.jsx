"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { createData, readData, updateData } from '@/helper/axios'
import { useFormik } from 'formik'
import { Eye, EyeClosed, EyeClosedIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as Yup from "yup";
function UserLayout() {
  const router = useRouter()
  const params = useParams();
  const userId = params?.id?.[0] || null;;
  const userrole = localStorage.getItem('userrole')
  const [loader, setLoader] = useState(false)
  const [showpsd, setpsd] = useState(false)
  const [initialValues, setInitialValues] = useState({
    userId: undefined,
    email: "",
    name: "",
    phone: "",
    password: "",
    role: userrole !== 'admin' ?'bde' : "",
    status: ""
  })
  const vailidation = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot be more than 50 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile number is required"),

    role: Yup.string()
      .oneOf(["admin", "bde", "manager"], "Select a valid role")
      .required("Role is required"),
    status: Yup.string()
      .oneOf(["active", "inactive"], "Select a valid status")
      .required("Status is required"),

    password: Yup.string().when("userId", {
      is: (id) => !id,  // If no ID → create mode
      then: (schema) =>
        schema
          .min(6, "Password must be at least 6 characters")
          .matches(/[A-Z]/, "Must include at least one uppercase letter")
          .matches(/[a-z]/, "Must include at least one lowercase letter")
          .matches(/[0-9]/, "Must include at least one number")
          .matches(/[@$!%*#?&]/, "Must include one special character")
          .required("Password is required"),
      otherwise: (schema) => schema.notRequired(), // Update mode → no validation
    })
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: vailidation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoader(true)
      const data = {
        ...(userId && { id: userId }),
        email: values.email,
        name: values.name,
        phone: values.phone,
        ...(!userId && { password: values.password, }),
        role: values.role,
        status: values.status
      }
      let token = localStorage.getItem("token");
      if (!userId) {
        const res = await createData("", "/admin/dashboard/Adduser", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${token}`
          },
        });
        if (res.status === 200) {
          toast.success(res.data.message)
          router.push("/admin/dashboard/userlist");
          setLoader(false)
        } else {
          setLoader(false)
        }
      } else {
        const res = await updateData("/admin/dashboard/UpdateUser", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${token}`
          },
        });
        if (res.message === 'User Updated Added!!!') {
          toast.success(res.message)
          router.push("/admin/dashboard/userlist");
          setLoader(false)
        } else {
          setLoader(false)
        }

      }
      setLoader(false)

    }
  })

  const GetUserbyid = async (token) => {
    try {
      const res = await readData(`/admin/dashboard/getUsersByID/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });

      if (res.message === 'Get Users details Scussfully!!!') {
        const data = res.result
        setInitialValues({
          userId: userId ?? undefined,
          email: data.email,
          name: data.name,
          phone: data.phone,
          // password: data.password,
          role: data.role,
          status: data.status
        })
        setLoader(false)
      }
    } catch (error) {
      console.log("errorr", error)
      setLoader(false)
    }
  }



  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        await GetUserbyid(token);  // ✔️ now state update happens asynchronously
      };

      fetchData();
    }
  }, [])

  return (
    <>
      <div className='container'>
        <div className=''>
          <div className='row'>
            <div className='col-6 mb-4'>
              <Label className='m-2 text-muted'>Name</Label>
              <Input placeholder="Enter Name" id="name" name="name" value={formik.values.name} type='text' onChange={formik.handleChange} />
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.name ? formik.errors.name : ""}</span>
            </div>
            <div className='col-6'>
              <Label className='m-2 text-muted'>Email</Label>
              <Input placeholder="Enter email" id="email" name="email" value={formik.values.email} type='email' onChange={formik.handleChange} />
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.email ? formik.errors.email : ""}</span>
            </div>
            <div className='col-6'>
              <Label className='m-2 text-muted'>Phone</Label>
              <Input placeholder="Enter phone number" id="phone" max={10} name="phone" value={formik.values.phone} type='number' onChange={formik.handleChange} />
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.phone ? formik.errors.phone : ""}</span>
            </div>
            <div className='col-6'>
              <Label className='m-2 text-muted'>Password</Label>
              <div className='d-flex'>
                <Input placeholder={userId != undefined ? '******' : "Enter password"} id="password" disabled={userId != undefined} name="password" value={formik.values.password} type={showpsd ? 'text' : 'password'} onChange={formik.handleChange} /> <span className='position-relative right-10 top-2'>
                  <div onClick={() => setpsd(!showpsd)} className={`cursor-pointer ${userId != undefined ? 'd-none' : ""}`}>
                    {showpsd ? <Eye /> : <EyeClosedIcon />}
                  </div>
                </span>

              </div>
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.password ? formik.errors.password : ""}</span>
            </div>
            <div className='col-6 mt-2'>
              <Label className='m-2 text-muted'>Role</Label>
              <div>
                <RadioGroup d value={formik.values.role}
                  onValueChange={(value) => formik.setFieldValue("role", value)} onChange={formik.handleChange} className='d-flex'>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="admin" id="r1" disabled={userrole !== 'admin'} className='radiusbtn' />
                    <Label htmlFor="r1" className={`${userrole !== 'admin'} ? text-muted-foreground : text-black` }>Admin</Label>
                  </div>
                  <div className="flex items-center gap-3" >
                    <RadioGroupItem value="manager" id="r2" disabled={userrole !== 'admin'} className='radiusbtn' />
                    <Label htmlFor="r2" className={`${userrole !== 'admin'} ? text-muted-foreground : text-black`}>Manager</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="bde" id="r3" className='radiusbtn' />
                    <Label htmlFor="r3">BDE</Label>
                  </div>
                </RadioGroup>
              </div>
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.role ? formik.errors.role : ""}</span>

            </div>
            <div className='col-6 mt-2'>
              <Label className='m-2 text-muted'>Status</Label>
              <div>
                <RadioGroup value={formik.values.status}
                  onValueChange={(value) => formik.setFieldValue("status", value)} onChange={formik.handleChange} className='d-flex'>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="active" id="s1" className='radiusbtn' />
                    <Label htmlFor="s1">Active</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="inactive" id="s2" className='radiusbtn' />
                    <Label htmlFor="s2">InActive</Label>
                  </div>

                </RadioGroup>
              </div>
              <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.status ? formik.errors.status : ""}</span>

            </div>
          </div>
          <div className='w-50 m-auto'>
            <Button className='commonbtn' onClick={formik.handleSubmit}>{loader ? <Spinner /> : userId != undefined ?'Update User' : 'Add User'}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserLayout