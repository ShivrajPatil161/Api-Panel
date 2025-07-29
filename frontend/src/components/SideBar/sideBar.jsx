// src/components/sidebar/Sidebar.jsx
import { NavLink } from "react-router"
import { sidebarLinks } from "../../constants/sidebarLinks"
import { useState } from "react"

export default function Sidebar() {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(prev => !prev);
    }

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed">
          <div className="flex flex-wrap">
              <NavLink className=" p-4 text-xl font-bold" to={"/"} >Dashboard</NavLink>
          <button onClick={handleToggle}>{toggle}</button>
          </div>
      <nav className="flex flex-col gap-2 px-4">
        {sidebarLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
          </nav>
    </aside>
  )
}
