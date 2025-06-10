<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'tbl_feedbacks';
    protected $primaryKey = 'feedback_id';
    protected $fillable = [
        'email',
        'message',
        'rating',
    ];
}
