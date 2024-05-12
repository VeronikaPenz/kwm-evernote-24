<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\NoteList;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotesTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   */
  public function run(): void {
    $noteData = [
      [1, 1, null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut scelerisque urna.', false, null],
      [1, 1, null, 'Phasellus efficitur efficitur mi, id ultrices velit imperdiet non. Nunc rutrum vehicula lacus in efficitur.', false, null],
      [1, 1, null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', true, 'https://picsum.photos/id/20/400/300'],
      [1, 1, null, 'Maecenas rutrum elit efficitur, lobortis orci eu, rutrum nisl.', false, null],

      [1, 2, 'Do Laundry!', 'Don\'t forget to do the laundry this weekend!', true, null],
      [1, 2, null, 'Maecenas sodales diam non arcu pretium accumsan.', true, null],
      [1, 2, null, 'Vivamus sapien diam, mollis a tempor ut, pulvinar eu lacus.', false, null],
      [1, 2, null, 'Cras pharetra fringilla sem, non bibendum mauris fermentum at.', false, null],
      [1, 2, 'Phasellus porta', 'Aliquam id iaculis ante, non scelerisque est. Duis ut nisl nec metus scelerisque auctor ut dapibus magna.', false, null],

      [1, null, 'How to set up a REST Service!', 'Step-by-step instructions on how to set up a Laravel Rest Service using a docker environment', false, 'https://picsum.photos/400/400'],
      [1, null, 'Cocktail Recipe: Negroni', 'Stir on ice, serve straight-up.', false, 'https://picsum.photos/id/54/400/400'],
      [1, null, null, 'Sed magna arcu, vestibulum id odio in, volutpat tincidunt enim. 
        Pellentesque et pharetra urna. Maecenas rutrum elit efficitur, lobortis orci eu, rutrum nisl. 
        Proin condimentum ligula mauris, vel tempus nulla viverra vitae. Vivamus in elit at lacus semper feugiat. 
        Nullam sit amet erat augue. Nulla sodales diam justo, at ultrices nulla tincidunt eget. Vestibulum fermentum placerat turpis. 
        Aliquam id iaculis ante, non scelerisque est. Duis ut nisl nec metus scelerisque auctor ut dapibus magna.', true, null],

      [4, 3, 'WEB Development', 'Assignments until next week', true, null],
      [4, 3, 'Semester Project', 'psychologie.at TODOs', false, null],
      [4, 3, 'E-Learning', 'Create a WBT for truck drivers about road safety!', false, 'https://picsum.photos/id/253/400/300'],

      [3, 4, 'BE Development', 'Sed eget dui et quam bibendum accumsan. Donec hendrerit ex sed aliquet mattis.', false, 'https://picsum.photos/id/12/800/500'],
      [3, 4, 'FE Development', 'Cras dolor eros, finibus in pharetra non, ultrices id ante.', false, 'https://picsum.photos/id/30/500/400'],
      [3, 4, null, 'Etiam mauris arcu, vulputate a eleifend fringilla, maximus et quam. Phasellus porta risus non quam finibus tempus.', false, null],
      [3, 4, null, 'Cras tincidunt erat purus, vitae tempus leo hendrerit eu. Integer id nunc sit amet sem sollicitudin porta. 
        Praesent non lacus quam. Etiam vitae tortor eros. Vivamus pretium ullamcorper nunc et maximus. 
        Cras pharetra fringilla sem, non bibendum mauris fermentum at.', false, null],
    ];

    foreach ($noteData as $nd) {
      $user = User::all()->find($nd[0]);
      $list = $nd[1] ? NoteList::all()->find($nd[1]) : null;
      $note = new Note([
        'title' => $nd[2],
        'text' => $nd[3],
        'important' => $nd[4],
        'image' => $nd[5]
      ]);
      $note->user()->associate($user);
      if ($list) $note->list()->associate($list);
      $note->save();
    }
  }
}
