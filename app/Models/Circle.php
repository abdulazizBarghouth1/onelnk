<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Circle extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'created_by',
        'name',
        'description',
        'color',
    ];

    /**
     * Curated palette reused across circles (and later the wallet UI).
     * A circle with no explicit colour is assigned one deterministically.
     */
    public const PALETTE = [
        '#0D9488', '#2563EB', '#7C3AED', '#DB2777', '#EA580C',
        '#CA8A04', '#16A34A', '#0891B2', '#4F46E5', '#DC2626',
    ];

    /**
     * Pick a stable colour for a name (so a circle keeps its colour).
     */
    public static function colorForName(string $name): string
    {
        $index = crc32($name) % count(self::PALETTE);

        return self::PALETTE[$index];
    }

    /**
     * The business (tenant scope) that owns the circle.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * The user who created the circle (for per-user counts).
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Contacts that belong to the circle.
     */
    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'circle_contact')->withTimestamps();
    }
}
