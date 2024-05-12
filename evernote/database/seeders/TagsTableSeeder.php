<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\Tag;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Seeder;

class TagsTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   */
  public function run(): void {

    $tagData = [
      [1, 'Very Important', '#aa2340', [1, 3, 26], [3, 6]],
      [1, 'Lorem', '#08a39b', [6, 7], [1, 6]],
      [1, 'Ipsum', '#77b013', [6, 7], [6, 9]],
      [4, 'FE Task', '#d422ce', [17, 23], [13, 14]],
      [4, 'BE Task', '#2d57d6', [18, 19, 20, 21], [13, 14]],
      [3, 'Dolor', '#e88e3f', null, [19]],
    ];

    foreach ($tagData as $td) {
      $creator = User::all()->find($td[0]);
      $tag = new Tag([
        'label' => $td[1],
        'color' => $td[2]
      ]);
      $tag->user()->associate($creator);
      $tag->save();
      if ($td[3]) $tag->todos()->sync($td[3]);
      if ($td[4]) $tag->notes()->sync($td[4]);
      $tag->save();
    }


  }
}
