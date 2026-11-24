<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * A company/account a contact belongs to. Named "Organization" (UI label
 * "Company") to avoid colliding with the tenant concept (User.type = 'company').
 */
class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'created_by',
        'name',
        'website',
        'phone',
        'email',
        'notes',
    ];

    /**
     * The business (tenant scope) that owns the organization.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * The user who created the organization.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Contacts that belong to this organization.
     */
    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
}
