<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public function properties() {
        return $this->hasMany(Property::class);
    }

    protected $fillable = ['nama_kategori'];
}
