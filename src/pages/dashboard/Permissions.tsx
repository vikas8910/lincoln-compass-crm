import MainLayout from '@/components/layout/MainLayout'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table";
import { useLocation } from 'react-router-dom';
import { UserCog } from "lucide-react";
import { useEffect, useState } from 'react';
import { getModulePermissionsByRoleId } from '@/services/permission-service/permission-service';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { Button } from '@/components/ui/button';

const Permissions = () => {
    const location = useLocation();
    const roleData = location.state;
    const [moduleData, setModuleData] = useState([]);
    const [selectedModuleData, setSelectedModuleData] = useState([]);

    useEffect(() => {
        const fetchModulePermissions = async () => {
            const res = await getModulePermissionsByRoleId(roleData.role.id as string);
            setModuleData(res);
        }
        fetchModulePermissions();
    },[]);


    const handleSave = () => {
        // handle all api call to save selected permissions
    };

    const handleModuleSelections = (module: string, action: string, value: string) => {
        // update selected module data as per the selections
    };


    
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
            <span className='flex flex-row items-center gap-2 justify-center'>
                <UserCog/>
                {roleData.role.name}
                {" "}
                Permissions
            </span>
        </h1>
      </div>
        <div className='flex flex-col gap-3 mb-10'>
            <div>
                <span className='font-bold text-xl'>Modules</span>
                <Table className="border-none">
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Edit</TableHead>
                            <TableHead>Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {moduleData.map((module, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className='flex align-items-center gap-2'>
                                        <input type="checkbox" checked={module.canView || module.canEdit || module.canDelete} onChange={(e) => console.log(e.target.checked)}/> 
                                        <span className="font-medium">{module.moduleName}</span>
                                    </div>
                                </TableCell>
                                {["view", "edit", "delete"].map((action, index) => (
                                    <TableCell key={index}>
                                        <Select onValueChange={(value) => handleModuleSelections(module, action, value)} defaultValue={module[`${action}Scope`]}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={"all"}>All Records</SelectItem>
                                                <SelectItem value={"owned"}>Own Records</SelectItem>
                                                <SelectItem value={"none"}>Can't {action.toLowerCase()}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div>
                <span className='font-bold text-xl'>Sales Activities</span>
                <Table className="border-none">
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Create</TableHead>
                            <TableHead>Edit</TableHead>
                            <TableHead>Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {["Tasks", "Meetings", "Call logs", "Custom sales activities"].map((module) => (
                            <TableRow key={module}>
                                <TableCell>
                                    <div className='flex align-items-center gap-2'>
                                        <input type="checkbox"/> 
                                        <span className="font-medium">{module}</span>
                                    </div>
                                </TableCell>
                                {["View", "Create", "Edit", "Delete"].map((action) => (
                                    <TableCell key={action}>
                                        <input type="checkbox"/>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div>
                <span className='font-bold text-xl'>Emails</span>
                <Table className="border-none">
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className='flex align-items-center gap-2'>
                                    <input type="checkbox"/> 
                                    <span className="font-medium">View email conversations</span>
                                </div>
                            </TableCell>
                            <TableCell >
                                <Select>
                                    <SelectTrigger className="w-[10rem] border p-1 rounded">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">View all emails</SelectItem>
                                        <SelectItem value="unread">View unread emails</SelectItem>
                                        <SelectItem value="starred">View starred emails</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='flex align-items-center gap-2'>
                                    <input type="checkbox"/> 
                                    <span className="font-medium">Share email templates</span>
                                </div>
                            </TableCell>
                            <TableCell >
                                <Select>
                                    <SelectTrigger className="w-[10rem] border p-1 rounded">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admins only</SelectItem>
                                        <SelectItem value="all">Everyone</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='flex align-items-center gap-2'>
                                    <input type="checkbox"/> 
                                    <span className="font-medium">Connect email</span>
                                </div>
                            </TableCell>
                            <TableCell className='flex flex-row'>
                                <Select>
                                    <SelectTrigger className="w-[10rem] border p-1 rounded">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2-way-sync">2-way sync</SelectItem>
                                        <SelectItem value="1-way-sync">1-way sync</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='flex align-items-center gap-2'>
                                    <input type="checkbox"/> 
                                    <span className="font-medium">Bulk email limit</span>
                                </div>
                            </TableCell>
                            <TableCell >
                                <input type="number" className='border border-gray-400 rounded p-2' defaultValue={0}/>
                                {" "} emails per day
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='flex align-items-center gap-2'>
                                    <input type="checkbox"/> 
                                    <span className="font-medium">Individual email limit</span>
                                </div>
                            </TableCell>
                            <TableCell >
                                <input type="number" className='border border-gray-400 rounded p-2' defaultValue={0}/> 
                                {" "} emails per day
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
        <div className='bg-gray-100 p-2 fixed bottom-0 left-0 right-0 flex justify-end'>
            <Button onClick={handleSave}>Save changes</Button>
        </div>
    </MainLayout>
  )
}

export default Permissions