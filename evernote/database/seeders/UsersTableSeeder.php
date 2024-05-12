<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   */
  public function run(): void {
    $userData = [
      ['Veronika', 'veronika@kwm.at', 'Password12!', 'admin', '27'],
      ['Simon', 'simon@kwm.at', 'Simon12!', 'user', '11'],
      ['Sabrina', 'sabrina@kwm.at', 'Sabrina12!', 'user', '10'],
      ['Marvin', 'marvin@kwm.at', 'Marvin12!', 'user', '32'],
      ['Lukas', 'lukas@kwm.at', 'Lukas12!', 'user', '57'],
      ['Nina', 'nina@kwm.at', 'Nina12!', 'user', '100'],
      ['Theresa', 'theresa@kwm.at', 'Theresa12!', 'user', '3'],
    ];

    foreach ($userData as $ud) {
      $user = new User([
        'name' => $ud[0],
        'email' => $ud[1],
        'password' => password_hash($ud[2], PASSWORD_DEFAULT),
        'role' => $ud[3],
        'profilepic' => "https://picsum.photos/id/$ud[4]/100"
      ]);
      $user->save();
    }
  }
}
