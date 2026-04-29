<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function owner() {
        return $this->belongsTo(Owner::class);
    }

    public function rooms() {
        return $this->hasMany(Room::class);
    }

    protected $fillable = ['category_id', 'owner_id', 'nama_kos', 'alamat', 'deskripsi'];
}
