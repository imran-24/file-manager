import PropTypes from 'prop-types'
import Avater from '../../../components/ui/avater';
import { useState } from 'react';
import SettingsModal from '../../../components/modal/settings-modal';
import clsx from 'clsx';

import { PencilLine, Trash } from 'lucide-react';
import AlertModal from '../../../components/modal/alert-modal';
import axios from 'axios';

import toast from 'react-hot-toast';
import { getDeleteUserById } from '../../../actions/get-delete-user';

const UserBox = ({
    user
}) => {
    const [settingsModal, setSettingsModal] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // how to import env variable in VITE
    const baseURL = import.meta.env.VITE_REACT_SERVER_URL
    const onDelete = async()=>{
        if(!user.uid) return;
        try{
            setIsLoading(true)
            await axios.delete(`${baseURL}/users/${user?.uid}`).then(async()=>{
                await getDeleteUserById(user?.uid).then(()=>{
                    toast.success("User deleted")
                })
            })
        }catch(error){
            console.log(error)
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false)
        }
    }
    
    return ( 
        <>
        <SettingsModal
        currentUser={user}
        isOpen={settingsModal}
        onClose={()=> setSettingsModal(false)} />
        <AlertModal
        title={"Delete User"}
        description={"This action can't be undone!"}
        disabled={isLoading}
        isOpen={alertModal}
        onAction={onDelete}
        onClose={()=> setAlertModal(false)}
        />
        <div className="group border-b py-2 px-4 cursor-pointer transition-all hover:bg-neutral-200/50">
            <div className="flex items-center justify-between gap-y-2 gap-x-6">
                <div 
                className="flex-1 w-full grid grid-cols-4 items-center  gap-x-4"
                >    
                    <Avater currentUser={user} />                   
                    <div className="flex flex-col space-y-1 ">
                        <div className="text-xs font-medium flex items-center">
                            <span className="truncate overflow-hidden">{user.username}</span>
                        </div>
                    </div>
                    <div className={clsx('w-fit py-1 px-2 flex items-center rounded-full',
                    user.userType === "ADMIN" ? "bg-rose-500" : "bg-neutral-500/60")}>
                        <span className="text-[10px] font-medium lowercase text-white">{user.userType}</span>
                    </div>           
                </div>
                <div className="absolute right-8 ">
                    <div className="flex items-center gap-x-1">
                        <button  type="button" onClick={()=> setSettingsModal(true)} className="hidden group-hover:md:flex h-8 w-8 items-center justify-center hover:bg-neutral-300/50 rounded-full z-20">
                            {<PencilLine className="h-4 w-4" />}
                        </button> 
                        {user.userType !== "ADMIN" && 
                        <button onClick={()=> setAlertModal(true)} className="hidden group-hover:md:flex h-8 w-8 items-center justify-center hover:bg-neutral-300/50 rounded-full z-20">
                            {<Trash className="h-4 w-4 text-rose-500" />}
                        </button>}
                    </div>
                </div>
            </div>        
        </div>
        </>
     );
}

UserBox.propTypes = {
    user: PropTypes.object
}
 
export default UserBox;