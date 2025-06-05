<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'tbl_user_roles';
    protected $primaryKey = 'user_role_id';
    protected $fillable = [
        'user_role_name'
    ];
}
