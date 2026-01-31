"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { createData, readData } from "@/helper/axios"
import { useFormik } from "formik"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as Yup from "yup"

function Quotationpage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [leads, setLeads] = useState([])
    const [products, setProducts] = useState([])
    const validation = Yup.object({
        quotation_no: Yup.string().required("Quotation number required"),
        lead_id: Yup.string().required("Lead required"),
        currency: Yup.string().required("Currency required"),
        items: Yup.array().min(1, "Add at least one product")
    })

    const formik = useFormik({
        initialValues: {
            quotation_no: "",
            lead_id: "",
            currency: "USD",
            followup_date: "",
            status: "Sent",
            items: [
                { product_id: "", qty: "", price: "" }
            ]
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            setLoading(true)
            const token = localStorage.getItem("token")

            const payload = {
                ...values,
                items: values.items.map(item => ({
                    product_id: item.product_id,
                    qty: Number(item.qty),
                    price: Number(item.price)
                }))
            }
            console.log("payload", payload)
            try {
                const res = await createData(
                    "",
                    "/quotations/dashboard/Addquotation",
                    payload,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                )
                console.log("res", res)
                if (res.status === 201) {
                    toast.success("Quotation Added scussfully")
                    router.push("/admin/dashboard/quotationList");
                    setLoading(false)
                } else if(res.status === 400) {
                    console.log("1111")
                    toast.success(res.data.message)
                    setLoading(false)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
    })

    const addItem = () => {
        formik.setFieldValue("items", [
            ...formik.values.items,
            { product_id: "", qty: "", price: "" }
        ])
    }

    const removeItem = (index) => {
        const items = [...formik.values.items]
        items.splice(index, 1)
        formik.setFieldValue("items", items)
    }
    const Getleads = async (token) => {
        setLoading(true)
        try {
            const res = await readData(`/leads/dashboard/getAllleads`, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`
                },
            });

            if (res.status === true) {
                setLeads(res.leads)
                setLoading(false)
            }
        } catch (error) {
            console.log("errorr", error)
            setLoading(false)
        }

    }

    const Getproducts = async (token) => {
        setLoading(true)
        try {
            const res = await readData(`/product/dashboard/getAllproducts`, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`
                },
            });
            console.log("res", res)
            if (res.status === true) {
                setProducts(res.products)
                setLoading(false)
            }
        } catch (error) {
            console.log("errorr", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            await Getleads(token);
            await Getproducts(token)  // ✔️ now state update happens asynchronously
        };
        fetchData();
    }, [])
    const calculateItemTotal = (qty, price) => {
        return Number(qty || 0) * Number(price || 0);
    };
    console.log("formik", formik.values)
    return (
        <div className="space-y-5">

            <div className="row">
                <div className="col-6 mt-3">
                    <Label>Quotation No</Label>
                    <Input
                        name="quotation_no"
                        value={formik.values.quotation_no}
                        onChange={formik.handleChange}
                    />
                </div>

                <div className="col-6 mt-3">
                    <Label>Lead</Label>
                    <Select
                        value={formik.values.lead_id}
                        onValueChange={(v) => formik.setFieldValue("lead_id", v)}
                    >
                        <SelectTrigger className='w-full borderRadius'>
                            <SelectValue placeholder="Select Lead" />
                        </SelectTrigger>
                        <SelectContent>
                            {leads?.map(l => (
                                <SelectItem key={l._id} value={l._id}>
                                    {l.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-6 mt-3">
                    <Label>Currency</Label>
                    <Select
                        value={formik.values.currency}
                        onValueChange={(v) => formik.setFieldValue("currency", v)}
                    >
                        <SelectTrigger className='w-full borderRadius'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-6 mt-3">
                    <Label>Status</Label>
                    <Select
                        value={formik.values.status}
                        className='w-full'
                        onValueChange={(v) => formik.setFieldValue("status", v)}
                    >
                        <SelectTrigger className='w-full borderRadius'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Sent">Sent</SelectItem>
                            <SelectItem value="Negotiation">Negotiation</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-6 mt-3">
                    <Label>Follow-up Date</Label>
                    <Input
                        type="date"
                        name="followup_date"
                        value={formik.values.followup_date}
                        onChange={formik.handleChange}
                    />
                </div>

                <div className="col-12 mt-4">
                    <h6>Quotation Items</h6>

                    {formik.values.items.map((item, index) => (
                        <div className="row mb-2" key={index}>
                            <div className="col-3">
                                <Select
                                    value={item.product_id}
                                    onValueChange={(v) =>
                                        formik.setFieldValue(`items.${index}.product_id`, v)
                                    }
                                >
                                    <SelectTrigger className='w-full borderRadius'>
                                        <SelectValue placeholder="Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products?.map(p => (
                                            <SelectItem key={p._id} value={p._id}>
                                                {p.productname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-3">
                                <Input
                                    placeholder="Qty"
                                    value={item.qty}
                                    onChange={(e) => {
                                        const qty = e.target.value;
                                        formik.setFieldValue(`items.${index}.qty`, qty);

                                        const total = calculateItemTotal(qty, item.price);
                                        formik.setFieldValue(`items.${index}.total_price`, total);
                                    }}
                                />

                            </div>
                            <div className="col-3">
                                <Input
                                    placeholder="Price per piece"
                                    value={item.price}
                                    onChange={(e) => {
                                        const price = e.target.value;
                                        formik.setFieldValue(`items.${index}.price`, price);

                                        const total = calculateItemTotal(item.qty, price);
                                        formik.setFieldValue(`items.${index}.total_price`, total);
                                    }}
                                />

                            </div>
                            <div className="col-3">
                                <Input
                                    value={item.total_price || 0}
                                    disabled
                                />

                            </div>

                            <div className="col-1">
                                <Button
                                    variant="icon"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 color="red" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" className='borderRadius' onClick={addItem}>
                        + Add
                    </Button>
                </div>

                <div className="col-12 text-center mt-4">
                    <div className='w-50 m-auto'>

                        <Button className='commonbtn' onClick={formik.handleSubmit}>{'Add Quatation'}</Button>
                        {/* <Button className='commonbtn' onClick={formik.handleSubmit}>{loader ? <Spinner /> : leadId ? 'Update product' : 'Add Product'}</Button> */}
                    </div>
                </div>

            </div>
        </div>


    )
}
export default Quotationpage