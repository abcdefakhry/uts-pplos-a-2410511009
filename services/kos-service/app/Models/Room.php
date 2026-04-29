<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    public function property() {
        return $this->belongsTo(Property::class);
    }

    protected $fillable = ['property_id', 'nomor_kamar', 'harga_per_bulan', 'is_available', 'fasilitas'];
}
