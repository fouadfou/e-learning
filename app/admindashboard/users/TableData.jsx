"use client"
import React, {useState, useEffect , useMemo , useCallback} from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination
  } from "@nextui-org/react";

import InsertModal from '@/components/modal/InsertModal';
import UpdateModal from '@/components/modal/UpdateModal';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoChevronDown } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

import { useAuth ,useUser } from "@clerk/nextjs";
import { deleteUser, getUsers } from '@/app/utils/userRequestes';



 const INITIAL_VISIBLE_COLUMNS = ["Username", "First name","Last name", "Role" ,"Actions"]; 

 const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "Nom d'utilisateur", uid: "Username", sortable: true},
    {name: "nom", uid: "Last name"},
    {name: "prénom", uid: "First name"},
    {name: "Role", uid: "Role"},
    {name: "Actions", uid: "Actions"},
  
  ];

  const RoleOptions = [
    {name: "Admin", color:"danger" , uid: "Admin"},
    {name: "Enseignante", color:"success", uid: "Teacher"},
    {name: "Parent", color:"secondary", uid: "Parent"},
    {name: "Élève", color:"warning", uid: "Student"},
    
  ];

 
const TableData = ({children}) => {

    
     const { userId, getToken } = useAuth();
    const { isSignedIn, user } = useUser();

    const [users, setUsers] = useState([]);
  const [action, setAction] = useState(false);





    useEffect(() => {
      
      const fetchUsers = async () => {
        const token = await getToken({ template: "supabase" });
        const fetchedUsers = await getUsers({token }); // Fetch users data
        setUsers(fetchedUsers); // Update users state
        
    };

        if (isSignedIn ) {
            fetchUsers(); // Call fetchUsers only when user is signed in
        }
    }, [isSignedIn, getToken, userId ]); // Include dependencies to ensure useEffect runs when they change
    
  


     
   
    const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [RoleFilter, setRoleFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    
    let filteredUsers = [...users];
  

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>

      user.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.prenom.toLowerCase().includes(filterValue.toLowerCase())
      );
    }


    if (RoleFilter !== "all" && Array.from(RoleFilter).length !== RoleOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(RoleFilter).includes(user.role),
      );
    }


    return filteredUsers;
  }, [users, filterValue, RoleFilter]);







  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);



  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "Username":
        return (
          <p className="text-bold text-small capitalize">{user?.username}</p>
        );

        case "Last name":
          return (
            <p className="text-bold text-small capitalize">{user.nom}</p>
          );

        case "First name":
        return (
          <p className="text-bold text-small capitalize">{user.prenom}</p>
        );
       
     
      case "Role":
        return (
          <Chip className="capitalize" color={ RoleOptions.find(option => option.uid === user.role)?.color || "defaultColor"} size="sm" variant="flat">
            {user.role}
          </Chip>
        );
      case "Actions":
        return (
          <div className="relative flex items-center justify-between">

            <UpdateModal setUsers={setUsers} user_id={user.user_id} />
          
            {React.cloneElement(children, { user_Id : user.user_id , content: <MdDelete className="text-base text-danger-400 cursor-pointer" /> , setUsers:setUsers })}

          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);


  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Recherche par prénom, nom"
            startContent={<CiSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<IoChevronDown className="text-small" />} variant="flat">
                  Roles
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={RoleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {RoleOptions.map((role) => (
                  <DropdownItem key={role.uid} className="capitalize">
                    {role.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<IoChevronDown className="text-small" />} variant="flat">
                    Colonnes
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>


          <InsertModal setUsers={setUsers} />
      
          </div>
        </div>
        
          <span className="text-default-400 text-small">Total {users.length} utilisateurs</span>
          
        
      </div>
    );
  }, [
    filterValue,
    RoleFilter,
    visibleColumns,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className=" text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} sur ${filteredItems.length} sélectionnés`}
        </span>
        <Pagination
          classNames={{

            cursor:"bg-primaryColor ",
    
          }} 
          isCompact
          showControls
          page={page}
          total={pages}
          onChange={setPage}
        />
        <Button color="danger" className="" size="sm" variant="flat"  >
              Supprimer les sélections
        </Button>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (

    <div className='  max-h-screen '>

<Table

      
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper:"shadow-none w-full",
        thead:"hidden md:table-header-group",
        
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="inside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  )
}

export default TableData