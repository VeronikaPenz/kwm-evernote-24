<?php

namespace Database\Seeders;

use App\Models\NoteList;
use App\Models\User;
use Illuminate\Database\Seeder;

class ListsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $listData = [
        [1, 'KWM Notes', 'Notes for classes'],
        [1, 'Reminders', null],
        [4, 'Homework Assignments', null],
        [3, 'Work related', null],
      ];

      foreach ($listData as $ld) {
        $user = User::all()->find($ld[0]);
        $note = new NoteList([
          'title' => $ld[1],
          'description' => $ld[2],
        ]);
        $note->user()->associate($user);
        $note->save();
      }
    }
}
