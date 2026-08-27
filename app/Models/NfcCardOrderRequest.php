<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class NfcCardOrderRequest extends Model
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'OL-' . strtoupper(Str::random(8));
            }
        });
    }

    protected $fillable = [
        "order_number",
        "user_id",
        "nfc_card_id",
        "quantity",
        "status",
        "original_price",
        "subtotal",
        "shipping_fee",
        "total_price",
        "logo",
        "card_color",
        "text_color",
        "card_design",
        "shipping_address",
        "business_id",
        "plan_id",
        "recipient_name",
        "recipient_phone",
        "recipient_email",
        "city",
        "delivery_notes",
        "payment_method",
        "payment_status",
    ];

    protected $casts = [
        "original_price" => "decimal:2",
        "subtotal" => "decimal:2",
        "shipping_fee" => "decimal:2",
        "total_price" => "decimal:2",
        "card_design" => "array",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function nfcCard(): BelongsTo
    {
        return $this->belongsTo(NfcCard::class);
    }
    
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
