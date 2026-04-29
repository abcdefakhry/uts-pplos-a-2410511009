<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $cat = \App\Models\Category::create(['nama_kategori' => 'Kos Campur']);

        $owner = \App\Models\Owner::create([
            'nama_pemilik' => 'Pak Haji Fakhry',
            'nomor_telepon' => '08123456789',
            'alamat_pemilik' => 'Depok'
        ]);

        $property = \App\Models\Property::create([
            'category_id' => $cat->id,
            'owner_id' => $owner->id,
            'nama_kos' => 'Kos Fakhry',
            'alamat' => 'Jl. Merdeka No. 123, Depok',
            'deskripsi' => 'Kos nyaman dengan fasilitas lengkap di pusat kota.'
        ]);

        \App\Models\Room::create([
            'property_id' => $property->id,
            'nomor_kamar' => 'A101',
            'harga_per_bulan' => 1500000,
            'is_available' => true,
            'fasilitas' => 'AC, Kamar mandi dalam, Wi-Fi'
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
