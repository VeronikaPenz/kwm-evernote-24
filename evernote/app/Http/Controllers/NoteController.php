<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Tag;
use App\Models\Todo;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller {

  private function associateTags(Request $req, Note $note): Note {
    $note->tags()->delete();
    if (isset($req['tags']) && is_array($req['tags'])) {
      foreach ($req['tags'] as $tn) {
        $tag = Tag::firstOrNew([
          'label' => $tn['label'],
          'color' => $tn['color'],
          'user_id' => auth()->user()->id
        ]);
        $note->tags()->save($tag);
      }
    }
    return $note;
  }


  public function getById($id): JsonResponse {
    $list = Note::with(['tags'])->find($id);
    return response()->json($list);
  }

  public function getUnlistedByUserId(Request $req): JsonResponse {
    $userId = $req->route('userId');
    $filter = $req->query('filter');
    if ($filter) {
      $notes = Note::with(['tags', 'todos.tags'])
        ->where('user_id', '=', $userId)
        ->where('list_id', '=', null)
        ->whereHas('tags', function ($query) use ($filter) {
          $query->where('id', '=', $filter);
        })
        ->orWhere('user_id', '=', $userId)
        ->where('list_id', '=', null)
        ->WhereHas('todos', function ($query) use ($filter) {
          $query->whereHas('tags', function ($query) use ($filter) {
            $query->where('id', '=', $filter);
          });
        })->get();
    } else {
      $notes = Note::with(['tags', 'todos.tags'])
        ->where('user_id', '=', $userId)
        ->where('list_id', '=', null)->get();
    }
    return response()->json($notes, 200);
  }

  public function getByListId($listId): JsonResponse {
    $notes = Note::with(['tags'])
      ->where('list_id', '=', $listId)->get();
    return response()->json($notes, 200);
  }

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $note = $req->all();
      $note['user_id'] = auth()->user()->id;
      $note = Note::create($note);
      $note = $this->associateTags($req, $note);
      DB::commit();
      $r = Note::with(['tags', 'todos.tags'])->find($note->id);
      return response()->json($r);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function update(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $id = $req->route('id');
      $note = Note::all()->find($id);
      $note->update($req->all());
      $note = $this->associateTags($req, $note);

      if (isset($req['todos']) && is_array($req['todos'])) {
        foreach ($req['todos'] as $todo) {
          $todo = Todo::find($todo['id']);
          if ($todo) $note->todos()->save($todo);
        }
      }

      TagController::cleanupTags();
      DB::commit();
      $r = Note::with(['tags', 'todos.tags'])->find($note->id);
      return response()->json($r);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete($id): JsonResponse {
    DB::beginTransaction();
    try {
      $note = Note::all()->find($id);
      $note->delete();
      TagController::cleanupTags();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

}
