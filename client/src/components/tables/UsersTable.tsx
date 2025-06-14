import { useEffect, useState } from "react";
import type { Users } from "../interfaces/user/Users";
import UserService from "../../services/UserService";
import ErrorHandler from "../handler/ErrorHandler";
import Spinner from "../Spinner";

interface UsersTableProps {
    refreshUsers: boolean;
    onEditUser: (user: Users) => void;
    onDeleteUser: (user: Users) => void;
}

const UsersTable = ({ refreshUsers, onEditUser, onDeleteUser }: UsersTableProps) => {
    const [state, setState] = useState({
        loadingUsers: true,
        users: [] as Users[],
    });

    const handleLoadUsers = () => {
        UserService.loadUsers()
            .then((res) => {
                if (res.status === 200) {
                    setState((prevState) => ({
                        ...prevState,
                        users: res.data.users,
                    }));
                } else {
                    console.error(
                        "Unexpected status error while loading users: ",
                        res.status
                    );
                }
            })
            .catch((error) => {
                ErrorHandler(error, null);
            })
            .finally(() => {
                setState((prevState) => ({
                    ...prevState,
                    loadingUsers: false,
                }));
            });
    };

    const handleUsersFullName = (user: Users) => {
        let fullName = "";

        if (user.middle_name) {
            fullName = `${user.last_name}, ${user.first_name
                } ${user.middle_name.charAt(0)}.`;
        } else {
            fullName = `${user.last_name}, ${user.first_name}`;
        }

        if (user.suffix_name) {
            fullName += ` ${user.suffix_name}`;
        }

        return fullName;
    };

    useEffect(() => {
        handleLoadUsers();
    }, [refreshUsers]);

    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Full Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Birthdate</th>
                            <th scope="col">Address</th>
                            <th scope="col">Contact Number</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.loadingUsers ? (
                            <tr className="text-center">
                                <td colSpan={8}>
                                    <Spinner />
                                </td>
                            </tr>
                        ) : state.users.length > 0 ? (
                            state.users.map((user) => (
                                <tr key={user.user_id}>
                                    <td>{handleUsersFullName(user)}</td>
                                    <td>{user.email}</td>
                                    <td>{user.gender.gender}</td>
                                    <td>{user.birth_date}</td>
                                    <td>{user.address}</td>
                                    <td>{user.contact_number}</td>
                                    <td className="fw-bold">{user.role.role}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-success btn-sm" onClick={() => onEditUser(user)}>
                                                Edit
                                            </button>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDeleteUser(user)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan={8} className="text-muted">
                                    No Users Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UsersTable;