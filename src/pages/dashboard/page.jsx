import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import Navigation from "../../components/ui/navigation";
import { useCurrentUser } from "../../hooks/use-current-user";
import { ROOT_FOLDER, useFolder } from "../../hooks/use-folder";
import Path from "../../components/path";
import EmptyState from "../../components/ui/empty-state";
import { useCurrentState } from "../../hooks/use-current-state";
import { useEffect } from "react";
import ContentList from "../../components/contents/content-list";
import Title from "../../components/ui/title";
import { useScrollTop } from "../../hooks/use-scroll";
import clsx from "clsx";
import Loading from "../../components/ui/loading";

const DashboarPage =() => {

    
    const {user, loading} = useCurrentUser()
    const {state, onSet} = useCurrentState()
    const {folderId} = useParams()
    const {folder, childFolders, childFiles} = useFolder(folderId, state, false )

    const scrolled = useScrollTop()

    useEffect(()=>{
        if(folder && folderId){
            onSet(folder)
        }else{
            onSet(ROOT_FOLDER)
        }
    },[folderId, folder, onSet])

    // if(user.uid) {
    //    const expired = await getAllFilesByUser(user)
    //    console.log(expired)
    // }
    if(loading && !user) return <Loading large={"large"} />

    return ( 
        <Sidebar >
            <div className="relative w-full space-y-4 h-full">
                <div className="flex flex-col gap-4">
                    
                    <div className={clsx(" gap-y-4 flex flex-col justify-center fixed top-0 right-0 left-0 sm:left-12 z-50 p-3 bg-white border-b",
                        scrolled && 'border-b shadow-sm')}>
                        <Navigation folder={folder}/>
                        <Path  folder={folder}/>
                        <Title />
                    </div>
                    
                    <div className="mt-36">
                        {(childFolders?.length > 0 || childFiles?.length > 0 )  && <ContentList folders={childFolders} files={childFiles} />}
                        {childFolders?.length === 0 && childFiles?.length === 0 && <EmptyState folder={folder} /> }
                    </div>
                </div>
            </div>
        </Sidebar>
     );
}
 
export default DashboarPage;