import type { Genders } from "../gender/Genders";
import type { Roles } from "../role/Roles";

export interface Users {
    user_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix_name: string;
    age: number;
    birth_date: string;
    gender: Genders;
    address: string;
    contact_number: string;
    email: string;
    password: string;
    role: Roles;
    created_at: string;
    updated_at: string;
}