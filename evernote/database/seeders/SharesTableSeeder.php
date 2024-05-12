<?php

namespace Database\Seeders;

use App\Models\NoteList;
use App\Models\Share;
use App\Models\User;
use Illuminate\Database\Seeder;

class SharesTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   */
  public function run(): void {

    $shareData = [
      [1, 2], [1, 4], [1, 5],
      [3, 1], [3, 2], [3, 5], [3, 6],
      [4, 1], [3, 7]
    ];

    foreach ($shareData as $sd) {
      $list = NoteList::all()->find($sd[0]);
      $sharedWith = User::all()->find($sd[1]);
      $share = new Share();
      $share->list()->associate($list);
      $share->user()->associate($sharedWith);
      $share->save();
    }
  }
}
