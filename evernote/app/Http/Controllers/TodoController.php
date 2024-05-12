<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Todo;
use DateTime;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TodoController extends Controller {

  private function associateTags(Request $req, Todo $todo): Todo {
    $todo->tags()->delete();
    if (isset($req['tags']) && is_array($req['tags'])) {
      foreach ($req['tags'] as $tag) {
        if ($tag['label']) {
          $tag = Tag::firstOrNew([
            'label' => $tag['label'],
            'color' => $tag['color'],
            'user_id' => auth()->user()->id
          ]);
          $todo->tags()->save($tag);
        }
      }
    }
    return $todo;
  }

  private function parseRequest(Request $request): Request {
    $date = new DateTime($request->due_date);
    $request['due_date'] = $date->format('Y-m-d H:i:s');
    return $request;
  }

  public function getByUserId(Request $req): JsonResponse {
    $userId = $req->route('userId');
    $sharedWith = $req->query('sharedWith');
    $filter = $req->query('filter');

    if ($sharedWith) {
      $todos = Todo::with(['tags', 'user', 'share'])
        ->whereHas('share', function ($query) use ($userId) {
          $query->where('user_id', '=', $userId)->where('accepted', '=', true);
        })->get();
    } else if ($filter) {
      $todos = Todo::with(['tags'])
        ->where('user_id', '=', $userId)
        ->where('note_id', '=', null)
        ->whereHas('tags', function ($query) use ($filter) {
          $query->where('id', '=', $filter);
        })->get();

    } else {
      $todos = Todo::with(['tags'])
        ->where('user_id', '=', $userId)
        ->where('note_id', '=', null)->get();
    }
    return response()->json($todos);
  }

  public function getByNoteId($noteId): JsonResponse {
    $todos = Todo::with(['tags', 'share.user'])
      ->where('note_id', '=', $noteId)->get();
    return response()->json($todos);
  }

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $req = $this->parseRequest($req);
      $todo = $req->all();
      $todo['user_id'] = auth()->user()->id;
      $todo = Todo::create($todo);
      $todo = $this->associateTags($req, $todo);
      DB::commit();
      $r = Todo::with(['tags'])->find($todo->id);
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
      $todo = Todo::all()->find($id);
      $todo->update($req->all());
      $todo->checked = $req->checked ? 1 : 0;
      $todo->save();
      $todo = $this->associateTags($req, $todo);
      TagController::cleanupTags();
      DB::commit();
      $return = Todo::with(['tags'])->find($todo->id);
      return response()->json($return);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete($id): JsonResponse {
    DB::beginTransaction();
    try {
      $todo = Todo::all()->find($id);
      $todo->delete();
      TagController::cleanupTags();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }


}
