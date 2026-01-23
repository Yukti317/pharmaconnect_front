import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { createData, readData, updateData } from '@/helper/axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from "yup"

function Leadsform({ open, setOpen, leadId, setLeadId, Getleads }) {
    const [initialValues, setInitialValues] = useState({
        companyname: "",
        country: null,
        email: "",
        phone: "",
        product_interest: "",
        next_followup: "",
        remark: "",
        status: "",
        contactpersonname: ""
    })
    const [loader, setLoader] = useState(false)
    const [country, setCountry] = useState([])
    const vailidation = Yup.object().shape({
        companyname: Yup.string()
            .required("Company name is required")
            .min(2, "Company name is too short"),

        contactpersonname: Yup.string()
            .required("Contact person name is required")
            .min(2, "Name is too short"),

        country: Yup.object()
            .nullable()
            .required("Country is required"),

        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),

        phone: Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

        product_interest: Yup.string()
            .required("Product interest is required"),

        next_followup: Yup.date()
            .required("Next follow-up date is required")
            .nullable(),
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: vailidation,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("values", values.next_followup)
            let token = localStorage.getItem("token");
            setLoader(true)
            const data = {
                ...(leadId && { id: leadId }),
                name: values.companyname,
                country: values.country,
                email: values.email,
                phone: values.phone,
                product_interest: values.product_interest,
                status: values.status,
                next_followup: values.next_followup,
                remark: values.remark,
                contactpersonname: values.contactpersonname
            }
            if (!leadId) {
            try {
                const res = await createData("", "/leads/dashboard/Addlead", data, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': `Bearer ${token}`
                    },
                });
                if (res.data.status === true) {
                    Getleads(token)
                    setOpen(false)
                    setLoader(false)
                    setInitialValues({
                        companyname: "",
                        country: "",
                        email: "",
                        phone: "",
                        product_interest: "",
                        next_followup: "",
                        remark: "",
                        status: "",
                        contactpersonname: ""
                    })

                }
            } catch (error) {
                console.log("error", error)
                setLoader(false)
            }
            } else {
                console.log("12333")
                try {

                    const res = await updateData("/leads/dashboard/updateLead", data, {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            'authorization': `Bearer ${token}`
                        },
                    });
                    if(res.status === true){
                        setLoader(false)
                        setOpen(false)
                        Getleads(token)
                    }
                } catch (error) {
                    console.log("error", error)
                    setLoader(false)

                }
            }
        }
    })
    const GetLeadbyid = async (token) => {
        setLoader(true)
        try {
            const res = await readData(`/leads/dashboard/getLeadsbyId/${leadId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`
                },
            });
            console.log("res", res)
            if (res.status === true) {
                const data = res.result
                console.log("data", data)
                setInitialValues({
                    companyname: data.name,
                    country: data.country,
                    email: data.email,
                    phone: data.phone,
                    product_interest: data.product_interest,
                    next_followup: data.next_followup,
                    remark: data.remark,
                    status: data.status,
                    contactpersonname: data.contactpersonname
                })
                setLoader(false)
            }
        } catch (error) {
            console.log("errorr", error)
            setLoader(false)
        }
    }

    useEffect(() => {
        if (leadId) {
            const fetchData = async () => {
                const token = localStorage.getItem("token");
                await GetLeadbyid(token);  // ✔️ now state update happens asynchronously
            };
            fetchData();
        }
    }, [leadId])

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
            .then(res => res.json())
            .then(data => {
                const countryList = data.map((country) => ({
                    name: country.name.common,
                    value: country.cca2
                }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountry(countryList)
            })

    }, []);


    return (
        <div>
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);

                if (!isOpen) {
                    formik.resetForm();
                    setInitialValues({
                        companyname: "",
                        country: "",
                        email: "",
                        phone: "",
                        product_interest: "",
                        next_followup: "",
                        remark: "",
                        status: "",
                        contactpersonname: ""
                    });
                    setLeadId(null); // ✅ CLEAR ID
                }
            }}>
                <DialogContent className=' p-4 w-full sm:max-w-4xl m-auto h-[90%] overflow-auto'>
                    <DialogTitle className='text-center'>Add Leads</DialogTitle>
                    <div>
                        <div className="row text-left align-items-center">
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Company Name</Label>
                                <Input placeholder="Enter Company Name" name="companyname" value={formik.values.companyname} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.companyname ? formik.errors.companyname : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Contact Person Name</Label>
                                <Input placeholder="Enter Person Name" name="contactpersonname" value={formik.values.contactpersonname} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.contactpersonname ? formik.errors.contactpersonname : ""}</span>
                            </div>

                            <div className="col-6">
                                <Label className='m-2 text-muted'>Country</Label>
                                <Select
                                    value={formik.values?.country?.value || ""}
                                    onValueChange={(val) => {
                                        const selectedCountry = country.find(c => c.value === val);
                                        formik.setFieldValue("country", selectedCountry);
                                    }}
                                >
                                    <SelectTrigger className="w-full categoryselect">
                                        <SelectValue placeholder="Select a country " />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            {country.map((data, i) => {
                                                return (
                                                    <SelectItem key={i} value={data.value}>{data.name}</SelectItem>
                                                )
                                            })}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.country ? formik.errors.country : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Email</Label>
                                <Input placeholder="Enter email" name="email" value={formik.values.email} type='email' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.email ? formik.errors.email : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Phone</Label>
                                <Input placeholder="Enter Number" name="phone" value={formik.values.phone} type='number' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.phone ? formik.errors.phone : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Product interest</Label>
                                <Input placeholder="Enter product name" name="product_interest" value={formik.values.product_interest} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.product_interest ? formik.errors.product_interest : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Next followUp date</Label>
                                <Input placeholder="Enter Date" name="next_followup" value={formik.values.next_followup} type='date' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.next_followup ? formik.errors.next_followup : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Status</Label>
                                <Input placeholder="Enter status" name="status" value={formik.values.status} type='text' onChange={formik.handleChange} />
                            </div>

                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Remark</Label>
                                <Textarea placeholder="Enter Description" id="strength" name="remark" value={formik.values.remark} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.remark ? formik.errors.remark : ""}</span>
                            </div>

                        </div>
                        <div className='w-50 m-auto'>

                            {/* <Button className='commonbtn' onClick={formik.handleSubmit}>{'Add Lead'}</Button> */}
                            <Button className='commonbtn' onClick={formik.handleSubmit}>{loader ? <Spinner /> : leadId ? 'Update product' : 'Add Product'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Leadsform