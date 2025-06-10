import { useState } from "react";
import AddUserModal from "../components/modals/user/AddUserModal";
import EditUserModal from "../components/modals/user/EditUserModal"
import MainLayout from "../pages/layout/MainLayout";
import UsersTable from "../components/tables/UsersTable";
import type { Users } from "../components/interfaces/user/Users";
import DeleteUserModal from "../components/modals/user/DeleteUserModal";

const Users = () => {
    const [refreshUsers, setRefreshUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [openEditUserModal, setOpenEditUserModal] = useState(false);
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

    const handleOpenEditUserModal = (user: Users) => {
        setSelectedUser(user);
        setOpenEditUserModal(true);
    };
    const handleCloseEditUserModal = () => {
        setSelectedUser(null);
        setOpenEditUserModal(false);
    };

    const handleOpenDeleteUserModal = (user: Users) => {
        setSelectedUser(user);
        setOpenDeleteUserModal(true);
    };
    const handleCloseDeleteUserModal = () => {
        setSelectedUser(null);
        setOpenDeleteUserModal(false);
    };

    const content = (
        <>
            <div className="container-fluid mt-4">
            <AddUserModal
                showModal={openAddUserModal}
                onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
                onClose={() => setOpenAddUserModal(false)}
            />
            <EditUserModal
                showModal={openEditUserModal}
                user={selectedUser}
                onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
                onClose={handleCloseEditUserModal}
            />
            <DeleteUserModal
                showModal={openDeleteUserModal}
                user={selectedUser}
                onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
                onClose={handleCloseDeleteUserModal}
            />

            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm rounded-lg p-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title mb-0">User Details</h4>
                                <button type="button" className="btn btn-primary" onClick={() => setOpenAddUserModal(true)}>
                                    Add New User
                                </button>
                            </div>
                            <UsersTable refreshUsers={refreshUsers} onEditUser={handleOpenEditUserModal} onDeleteUser={handleOpenDeleteUserModal} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return <MainLayout content={content} />;
};

export default Users;