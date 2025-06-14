import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import type { UserFieldErrors } from "../../interfaces/user/UserFieldErrors";
import ErrorHandler from "../../../components/handler/ErrorHandler";
import type { Users } from "../../interfaces/user/Users";
import UserService from "../../../services/UserService";
import type { Genders } from "../../interfaces/gender/Genders";
import GenderService from "../../../services/GenderService";
import type React from "react";
import type { Roles } from "../../interfaces/role/Roles";
import RoleService from "../../../services/RoleService";

interface EditUserFormProps {
    user: Users | null;
    setSubmitForm: React.RefObject<(() => void) | null>;
    setLoadingUpdate: (loading: boolean) => void;
    onUserUpdated: (message: string) => void;
}

const EditUserForm = ({ user, setSubmitForm, setLoadingUpdate, onUserUpdated }: EditUserFormProps) => {
    const [state, setState] = useState({
        loadingGenders: true,
        genders: [] as Genders[],
        loadingRoles: true,
        roles: [] as Roles[],
        user_id: 0,
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix_name: "",
        birth_date: "",
        gender: "",
        address: "",
        contact_number: "",
        email: "",
        role: "",
        errors: {} as UserFieldErrors,
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLoadGenders = () => {
        GenderService.loadGenders()
            .then((res) => {
                if (res.status === 200) {
                    setState((prevState) => ({
                        ...prevState,
                        genders: res.data.genders,
                    }));
                } else { console.error("Unexpected status error while loading genders: ", res.status); }
            }).catch((error) => { ErrorHandler(error, null); }).finally(() => {
                setState((prevState) => ({
                    ...prevState,
                    loadingGenders: false,
                }));
            });
    };

    const HandleLoadRoles = () => {
        RoleService.LoadRoles()
            .then((res) => {
                if (res.status === 200) {
                    setState((prevState) => ({
                        ...prevState,
                        roles: res.data.roles,
                    }));
                } else { console.error("Unexpected status error while loading roles: ", res.status); }
            }).catch((error) => { ErrorHandler(error, null); }).finally(() => {
                setState((prevState) => ({
                    ...prevState,
                    loadingRoles: false,
                }));
            });
    };


    const handleUpdateUser = (e: FormEvent) => {
        e.preventDefault();

        setLoadingUpdate(true);

        UserService.updateUser(state.user_id, state)
            .then((res) => {
                if (res.status === 200) {
                    onUserUpdated(res.data.message);
                } else { console.error("Unexpected status error while updating user: ", res.status); }
            }).catch((error) => {
                if (error.response.status === 422) {
                    setState((prevState) => ({
                        ...prevState,
                        errors: error.response.data.errors,
                    }));
                } else { ErrorHandler(error, null); }
            }).finally(() => { setLoadingUpdate(false); });
    };

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        handleLoadGenders();
        HandleLoadRoles();

        if (user) {
            setState((prevState) => ({
                ...prevState,
                user_id: user.user_id,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                suffix_name: user.suffix_name,
                birth_date: user.birth_date,
                gender: user.gender.gender_id.toString(),
                address: user.address,
                contact_number: user.contact_number,
                email: user.email,
                role: user.role.role_id.toString()
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                user_id: 0,
                first_name: "",
                middle_name: "",
                last_name: "",
                suffix_name: "",
                birth_date: "",
                gender: "",
                address: "",
                contact_number: "",
                email: "",
                role: "",
                errors: {} as UserFieldErrors,
            }));
        }

        setSubmitForm.current = () => {
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        };
    }, [user, setSubmitForm]);

    return (
        <>
            <form ref={formRef} onSubmit={handleUpdateUser}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className={`form-control ${state.errors.first_name ? "is-invalid" : ""}`} name="first_name" id="first_name" value={state.first_name} onChange={handleInputChange}/>
                            {state.errors.first_name && (
                                <span className="text-danger">
                                    {state.errors.first_name[0]}
                                </span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="middle_name">Middle Name</label>
                            <input type="text" className={"form-control"} name="middle_name" id="middle_name" value={state.middle_name} onChange={handleInputChange}/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className={`form-control ${state.errors.last_name ? "is-invalid" : ""}`} name="last_name" id="last_name" value={state.last_name} onChange={handleInputChange}/>
                            {state.errors.last_name && (
                                <span className="text-danger">{state.errors.last_name[0]}</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="suffix_name">Suffix Name</label>
                            <input type="text" className={"form-control"} name="suffix_name" id="suffix_name" value={state.suffix_name} onChange={handleInputChange}/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="birth_date">Birth Date</label>
                            <input type="date" className={`form-control ${state.errors.birth_date ? "is-invalid" : ""}`} name="birth_date" id="birth_date" value={state.birth_date} onChange={handleInputChange}/>
                            {state.errors.birth_date && (
                                <span className="text-danger">
                                    {state.errors.birth_date[0]}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="gender">Gender</label>
                            <select className={`form-select ${state.errors.gender ? "is-invalid" : ""}`} name="gender" id="gender" value={state.gender} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                {state.loadingGenders ? (
                                    <option value="">Loading...</option>
                                ) : (
                                    state.genders.map((gender, index) => (
                                        <option value={gender.gender_id} key={index}>
                                            {gender.gender}
                                        </option>
                                    ))
                                )}
                            </select>
                            {state.errors.gender && (
                                <span className="text-danger">{state.errors.gender[0]}</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address">Address</label>
                            <input type="text" className={`form-control ${state.errors.address ? "is-invalid" : ""}`} name="address" id="address" value={state.address} onChange={handleInputChange}/>
                            {state.errors.address && (
                                <span className="text-danger">{state.errors.address[0]}</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="contact_number">Contact Number</label>
                            <input type="text" className={`form-control ${state.errors.contact_number ? "is-invalid" : ""}`} name="contact_number" id="contact_number" value={state.contact_number} onChange={handleInputChange}/>
                            {state.errors.contact_number && (
                                <span className="text-danger">
                                    {state.errors.contact_number[0]}
                                </span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="text" className={`form-control ${state.errors.email ? "is-invalid" : ""}`} name="email" id="email" value={state.email} onChange={handleInputChange}/>
                            {state.errors.email && (
                                <span className="text-danger">{state.errors.email[0]}</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role">User Role</label>
                            <select className={`form-select ${state.errors.role ? "is-invalid" : ""}`} name="role" id="role" value={state.role} onChange={handleInputChange}>
                                <option value="">Select Role</option>
                                {state.loadingRoles ? (
                                    <option value="">Loading...</option>
                                ) : (
                                    state.roles.map((role, index) => (
                                        <option value={role.role_id} key={index}>
                                            {role.role}
                                        </option>
                                    ))
                                )}
                            </select>
                            {state.errors.role && (
                                <span className="text-danger">{state.errors.role[0]}</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditUserForm;