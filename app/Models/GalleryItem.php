<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A single marketing gallery entry — one uploaded image that IS the whole design.
 * Managed from the admin "Gallery" screen; rendered on the homepage + /gallery.
 */
class GalleryItem extends Model
{
    protected $fillable = [
        'image',
        'sort_order',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'sort_order' => 'integer',
    ];
}
