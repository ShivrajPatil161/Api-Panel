// src/constants/sidebarLinks.js
import { Building2, Package, Upload, Users, Repeat2, IndianRupee, FileText } from 'lucide-react'

export const sidebarLinks = [
  { label: "Vendor Master", path: "/vendor", icon: <Building2 /> },
  { label: "Vendor Rates", path: "/vendor-rates", icon: <IndianRupee /> },
  { label: "Product Master", path: "/product", icon: <Package /> },
  { label: "Inward Entry", path: "/inward", icon: <Upload /> },
  { label: "Outward Entry", path: "/outward", icon: <Repeat2 /> },
  { label: "Return Entry", path: "/return", icon: <Repeat2 /> },
  { label: "Customer Onboarding", path: "/customer", icon: <Users /> },
  { label: "Product Assignment", path: "/assignment", icon: <FileText /> },
  { label: "Product Pricing", path: "/pricing", icon: <IndianRupee /> },
  { label: "File Upload", path: "/upload", icon: <Upload /> },
  { label: "Charge Calculator", path: "/charges", icon: <IndianRupee /> },
]
