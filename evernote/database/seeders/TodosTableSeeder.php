<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\Share;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Seeder;

class TodosTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   */
  public function run(): void {

    $todoData = [
      [1, 2, null, 'Very Important Todo', null, null],
      [1, 2, null, 'Don\'t forget about this Todo!', null, new \DateTime('2024-12-24')],

      [1, 5, null, '#1 pick up dirty clothes', null, null],
      [1, 5, null, '#2 put clothes in washing machine', null, null],
      [1, 5, null, '#3 hang up clothes to dry', null, null],

      [1, 10, null, 'set up a docker installation using wsl', null, null],
      [1, 10, null, 'create a new laravel project', null, null],
      [1, 10, null, 'set up database connection', null, null],
      [1, 10, null, 'create database migrations', null, null],
      [1, 10, null, 'create data model w/ OR-mapper', null, null],
      [1, 10, null, 'create controller for your model', null, null],
      [1, 10, null, 'set up api-route and connect to controller', null, null],
      [1, 10, null, 'test your new API route', null, null],

      [1, 11, null, '30ml Dry Gin', null, null],
      [1, 11, null, '30ml Campari', null, null],
      [1, 11, null, '30ml Sweet Vermouth', null, null],

      [4, 13, null, 'Frontend Setup', 'set up angular frontend ahead of next lesson', new \DateTime('2024-08-24')],
      [4, 13, null, 'Author REST Service', 'create REST service for Author model, analogous to Book', new \DateTime('2024-08-24')],

      [4, 14, 4, 'psychologist listing GET API', 'API should return an array of User objects (with filter options & pagination)', new \DateTime('2024-08-24')],
      [4, 14, 4, 'event listing GET API', 'API should return an array of Event objects (with filter options & pagination)', new \DateTime('2024-08-24')],
      [4, 14, 5, 'job listing GET API', 'API should return an array of Job objects (with filter options & pagination)', new \DateTime('2024-08-24')],
      [4, 14, 6, 'FE Design', 'Create Frontend Design', new \DateTime('2024-08-24')],
      [4, 14, 7, 'FE psy-listing component', 'Create Frontend component to list all User objects returned by psy-listing API', new \DateTime('2024-08-24')],

      [1, null, null, 'Don\'t forget to brush your teeth!', null, null],
      [1, null, null, 'Make an appointment at the hair salon!', null, null],
      [1, null, null, 'Buy a present for your firend\'s birthday!', null, new \DateTime('2024-04-26')]
    ];

    foreach ($todoData as $td) {
      $user = User::all()->find($td[0]);
      $note = $td[1] ? Note::all()->find($td[1]) : null;
      $assignedTo = $td[2] ? Share::all()->find($td[2]) : null;
      $todo = new Todo([
        'title' => $td[3],
        'description' => $td[4],
        'due_date' => $td[5]
      ]);
      $todo->user()->associate($user);
      if ($note) $todo->note()->associate($note);
      if ($assignedTo) $todo->share()->associate($assignedTo);
      $todo->save();
    }
  }
}
