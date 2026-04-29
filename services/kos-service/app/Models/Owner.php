<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    public function properties() {
        return $this->hasMany(Property::class);
    }

    protected $fillable = ['nama_pemilik', 'nomor_telepon', 'alamat_pemilik'];
}
