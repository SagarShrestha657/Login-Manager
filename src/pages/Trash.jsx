import React from 'react'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { axiosInstance } from "../lib/axios";
import { FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '../components/ui/dialog';

const Trash = () => {
  const [logins, setlogins] = useState([])
  const { checkAuth } = useAuthStore()

  const datas = async () => {
    try {
      const res = await axiosInstance.get("/trashlogins/getall", { withCredentials: true })
      setlogins(res.data.deletedlogins)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const hidepassword = (psd) => {
    let len = psd.length
    let hidden = "*"
    for (let i = 0; i < len; i++) {

      hidden = hidden + "*"
    }
    return hidden
  };

  useEffect(() => {
    checkAuth()
    datas()
  }, []);

  useEffect(() => {
    setInterval(() => {
      checkAuth()
    }, 1000 * 60 * 2)
  });


  const permanentlydelete = async (_id) => {
    try {
      let d = confirm("do yo want to permanently delete this Login")
      if (d) {
        const res = await axiosInstance.delete("/trashlogins/deletelogin", { data: { _id } }, { withCredentials: true })
        setlogins(logins.filter(item => item._id !== _id))
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const restorelogin = async (_id) => {
    try {
      let d = confirm("do yo want to restore this Login")
      if (d) {
        const data = { _id }
        const res = await axiosInstance.patch("/trashlogins/restore", data, { withCredentials: true })
        setlogins(logins.filter(item => item._id !== _id))
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const coptext = (text) => {
    toast.success("Copied to Clickboard!");
    navigator.clipboard.writeText(text)
  };

  const getColor = (daysLeft) => {
    if (daysLeft > 20) return "text-green-500";
    if (daysLeft > 10) return "text-yellow-500";
    if (daysLeft > 5) return "text-orange-500";
    if (daysLeft > 0) return "text-red-500 font-bold";
  };

  return (
    <>
      <div className='bg-gray-100 w-full h-screen pt-2'>
        <div className='w-3/4 mx-auto h-fit pb-2 bg-white shadow-md rounded-lg flex flex-col '>
          <h1 className='text-center text-2xl my-3 font-semibold text-gray-800 pt-2'>Deleted Logins</h1>
          {logins.length === 0 && <div className='pl-5 m-4' >No Logins to Show</div>}
          {logins.length != 0 &&
            <div className='w-full h-96  overflow-auto scrollbar-hide'>
              <table className='w-full table-fixed  border border-gray-300 shadow-md rounded-md '>
                <thead >
                  <tr className='flex w-full bg-blue-500 text-white '>
                    <th className=' w-[9%]'>DaysLeft</th>
                    <th className=' w-[27%]'>Website</th>
                    <th className=' w-[27%]'>Username</th>
                    <th className=' w-[27%]'>Password</th>
                    <th className=' w-[10%]'>Action</th>
                  </tr>
                </thead>
                <tbody >
                  {logins.map((item, index) => {
                    return <tr key={index} className='odd:bg-gray-100 even:bg-white  flex w-full'>
                      <th className='border border-blue-400 w-[9%]  flex justify-between'>
                        <h3 className={`items-center ${getColor(item.daysLeft)} font-bold w-full`}>{item.daysLeft} Days</h3>
                      </th>
                      <th className='border border-blue-400 w-[27%]  flex justify-between'>
                        <h3 className=' overflow-auto  pl-2 ' >  <a href="item.site">{item.Website}</a></h3>
                        <span className='mx-1  pt-[2px] font-semibold cursor-pointer text-gray-500 hover:text-blue-500 ' onClick={() => { coptext(item.site) }}><FaCopy /></span>
                      </th>
                      <th className='border border-blue-400 w-[27%]  flex justify-between'>
                        <h3 className='font-bold pl-2 text-left overflow-auto  ' >{item.username}</h3>
                        <span className='mx-1 pt-[2px]  font-semibold  cursor-pointer text-gray-500 hover:text-blue-500' onClick={() => { coptext(item.username) }}><FaCopy /></span>
                      </th>
                      <th className='border border-blue-400 w-[27%]  flex justify-between'>
                        <h3 className='font-bold pl-2 text-left overflow-auto  ' >{hidepassword(item.password)}</h3>
                        <span className='mx-1 pt-[2px]  font-semibold cursor-pointer text-gray-500 hover:text-blue-500 ' onClick={() => { coptext(item.password) }}><FaCopy /></span>
                      </th>
                      <th className='border border-blue-400  w-[10%]  flex gap-2'>
                        <Dialog >
                          <DialogTrigger asChild>
                            <span className='m-auto cursor-pointer hover:text-green-700 text-green-500' ><FaTrashRestoreAlt /></span>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-center ">Restore Login</DialogTitle>
                              <DialogDescription className="text-center p-5">Do you want to restore this login?</DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <div className="flex justify-between w-full">
                                  <Button type="button" variant="secondary">
                                    Cancel
                                  </Button>
                                  <Button type="button" variant="secondary" onClick={() => { restorelogin(item._id) }}>
                                    Yes
                                  </Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog >
                          <DialogTrigger asChild>
                            <span className='m-auto cursor-pointer text-red-500 hover:text-red-700' ><MdDelete /></span>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-center ">Delete Login</DialogTitle>
                              <DialogDescription className="text-center p-5">Do you want to delete this login?</DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <div className="flex justify-between w-full">
                                  <Button type="button" variant="secondary">
                                    Cancel
                                  </Button>
                                  <Button type="button" variant="secondary" onClick={() => { permanentlydelete(item._id) }}>
                                    Yes
                                  </Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </th>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Trash;
