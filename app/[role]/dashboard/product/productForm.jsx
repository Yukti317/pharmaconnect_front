import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { createData, readData, updateData } from "@/helper/axios"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { toast } from 'sonner'
import * as Yup from "yup";

export const ProductForm = ({ open, setOpen, productId,Getproducts }) => {
    const [initialValues, setInitialValues] = useState({
        productname: "",
        category: "",
        strength: "",
        price: "",
        availability: "",
        countryregistration: "",
        description: "",
        packing: ""
    })
    const [loader, setLoader] = useState(false)
    const vailidation = Yup.object().shape({
        productname: Yup.string().required("productname is required"),
        category: Yup.string().required("category is required"),
        strength: Yup.string().required("strength is required"),
        price: Yup.string().required("price is required"),
        availability: Yup.string().required("availability is required"),
        countryregistration: Yup.string().required("countryregistration is required"),
        packing: Yup.string().required("packing is required"),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: vailidation,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let token = localStorage.getItem("token");
            setLoader(true)
            const data = {
                ...(productId && { id: productId }),
                name: values.productname,
                category: values.category,
                strength: values.strength,
                price: Number(values.price),
                availability: values.availability,
                countryregistration: values.countryregistration,
                description: values.description,
                packing: values.packing
            }
            if (!productId) {
                try {
                    const res = await createData("", "/product/dashboard/Addproduct", data, {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            'authorization': `Bearer ${token}`
                        },
                    });
                    if (res.data.status === true) {
                        setOpen(false)
                        setLoader(false)
                    }
                } catch (error) {
                    console.log("error", error)
                    setLoader(false)
                }
            } else {
                try {
                    const res = await updateData("/product/dashboard/updateProduct", data, {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            'authorization': `Bearer ${token}`
                        },
                    });
                    if(res.status === true){
                        setLoader(false)
                        setOpen(false)
                        Getproducts(token)
                    }
                } catch (error) {
                    console.log("error", error)
                    setLoader(false)

                }
            }


        }
    })


    const GetProductbyid = async (token) => {
        setLoader(true)
        try {
            const res = await readData(`/product/dashboard/getproductsById/${productId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`
                },
            });
            if (res.message === 'Get products details Scussfully!!!') {
                const data = res.result
                setInitialValues({
                    productname: data?.name,
                    category: data?.category.toLowerCase(),
                    strength: data?.strength,
                    price: data?.price,
                    availability: data?.availability.toLowerCase(),
                    countryregistration: data?.countryregistration.toLowerCase(),
                    description: data?.description,
                    packing: data?.packing
                })
                setLoader(false)
            }
        } catch (error) {
            console.log("errorr", error)
            setLoader(false)
        }
    }



    useEffect(() => {
        if (productId) {
            const fetchData = async () => {
                const token = localStorage.getItem("token");
                await GetProductbyid(token);  // ✔️ now state update happens asynchronously
            };
            fetchData();
        }
    }, [productId])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className=' p-4 w-full sm:max-w-3xl m-auto h-[90%] overflow-auto'>
                    <DialogTitle className='text-center'>Add Product</DialogTitle>
                    <div>
                        <div className="row text-left align-items-center">
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Product Name</Label>
                                <Input placeholder="Enter Product Name" id="name" name="productname" value={formik.values.productname} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.productname ? formik.errors.productname : ""}</span>
                            </div>
                            <div className="col-6">
                                <Label className='m-2 text-muted'>Category</Label>
                                <Select
                                    value={formik.values.category}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("category", value)
                                    }
                                >
                                    <SelectTrigger className="w-full categoryselect">
                                        <SelectValue placeholder="Select a Category " />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="tablet">Tablet</SelectItem>
                                            <SelectItem value="capsule">Capsule</SelectItem>
                                            <SelectItem value="syrup">Syrup</SelectItem>
                                            <SelectItem value="injection">Injection</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.category ? formik.errors.category : ""}</span>
                            </div>
                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Packing</Label>
                                <Input placeholder="Packing(e.g.,10x10 Blister,100ml Bottle)" id="packing" name="packing" value={formik.values.packing} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.packing ? formik.errors.packing : ""}</span>
                            </div>
                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Strength</Label>
                                <Input placeholder="Strength(e.g., 500mg, 250mg)" id="strength" name="strength" value={formik.values.strength} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.strength ? formik.errors.strength : ""}</span>
                            </div>
                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Price</Label>
                                <Input placeholder="Price in USD" id="strength" name="price" value={formik.values.price} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.price ? formik.errors.price : ""}</span>
                            </div>

                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Country Registration</Label>
                                <Select
                                    value={formik.values.countryregistration}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("countryregistration", value)
                                    }
                                >
                                    <SelectTrigger className="w-full categoryselect">
                                        <SelectValue placeholder="Select a Country Registration" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="registered">Registered</SelectItem>
                                            <SelectItem value="underprocess">Under Process</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.countryregistration ? formik.errors.countryregistration : ""}</span>
                            </div>

                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Description</Label>
                                <Textarea placeholder="Enter Description" id="strength" name="description" value={formik.values.description} type='text' onChange={formik.handleChange} />
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.description ? formik.errors.description : ""}</span>
                            </div>

                            <div className="col-6 mt-4">
                                <Label className='m-2 text-muted'>Product Availability</Label>
                                <RadioGroup value={formik.values.availability}
                                    onValueChange={(value) => formik.setFieldValue("availability", value)} onChange={formik.handleChange} className='d-flex'>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="yes" id="s1" className='radiusbtn' />
                                        <Label htmlFor="s1">Yes</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="no" id="s2" className='radiusbtn' />
                                        <Label htmlFor="s2">No</Label>
                                    </div>
                                </RadioGroup>
                                <span className='text-red-500 ms-3 text-sm font-bold'>{formik.touched.availability ? formik.errors.availability : ""}</span>
                            </div>
                        </div>
                        <div className='w-50 m-auto'>

                            <Button className='commonbtn' onClick={formik.handleSubmit}>{loader ? <Spinner /> : productId != undefined ? 'Update product' : 'Add Product'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


        </>

    )
}