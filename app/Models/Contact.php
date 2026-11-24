<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'organization_id',
        'created_by',
        'is_landing_page',
        'name',
        'email',
        'emails',
        'subject',
        'phone',
        'phones',
        'job_title',
        'website',
        'address',
        'avatar',
        'source',
        'message',
        'status',
        'notes',
    ];

    protected $casts = [
        'is_landing_page' => 'boolean',
        'emails' => 'array',
        'phones' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope for landing page contacts
     */
    public function scopeLandingPage($query)
    {
        return $query->where('is_landing_page', true);
    }

    /**
     * Scope for business contacts
     */
    public function scopeBusiness($query)
    {
        return $query->where('is_landing_page', false);
    }

    /**
     * Get the business that owns the contact.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Circles (segments) this contact belongs to.
     */
    public function circles()
    {
        return $this->belongsToMany(Circle::class, 'circle_contact')->withTimestamps();
    }

    /**
     * The organization (company) this contact belongs to.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * The user (owner or staff) who added this contact.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}