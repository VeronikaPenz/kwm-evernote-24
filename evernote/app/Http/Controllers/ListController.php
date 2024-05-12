<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\NoteList;
use App\Models\Share;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ListController extends Controller {

  public function getById($id, $withOwner = false): JsonResponse {
    $with = ['shares.user', 'notes.todos.tags', 'notes.todos.share.user', 'notes.tags'];
    if ($withOwner) $with[] = 'user';
    $list = NoteList::with($with)->find($id);
    return response()->json($list);
  }

  public function getByUserId(Request $req): JsonResponse {
    $userId = $req->route('userId');
    $sharedWith = $req->query('sharedWith');
    $filter = $req->query('filter');
    if ($sharedWith) {
      $accepted = NoteList::with(['user', 'shares.user', 'notes.todos.tags', 'notes.todos.share.user', 'notes.tags'])
        ->whereHas('shares', function ($query) use ($userId) {
          $query->where('user_id', '=', $userId)->where('accepted', '=', true);
        })->get();
      $pending = NoteList::with(['user'])
        ->whereHas('shares', function ($query) use ($userId) {
          $query->where('user_id', '=', $userId)->where('accepted', '=', false);
        })->get();
      return response()->json(['accepted' => $accepted, 'pending' => $pending]);
    } else if ($filter) {
      $lists = NoteList::with(['shares.user', 'notes.todos.tags', 'notes.todos.share.user', 'notes.tags'])
        ->where('user_id', '=', $userId)
        ->whereHas('notes', function ($query) use ($filter) {
          $query->whereHas('tags', function ($query) use ($filter) {
            $query->where('id', '=', $filter);
          })->orWhereHas('todos', function ($query) use ($filter) {
            $query->whereHas('tags', function ($query) use ($filter) {
              $query->where('id', '=', $filter);
            });
          });
        })->get();
    } else {
      $lists = NoteList::with(['shares.user', 'notes.todos.tags', 'notes.todos.share.user', 'notes.tags'])
        ->where('user_id', '=', $userId)->get();
    }
    return response()->json($lists);
  }

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $list = $req->all();
      $list['user_id'] = auth()->user()->id;
      $list = NoteList::create($list);
      DB::commit();
      return response()->json($list);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function update(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $id = $req->route('id');
      $list = NoteList::all()->find($id);
      $list->update($req->all());

      if (isset($req['notes']) && is_array($req['notes'])) {
        foreach ($req['notes'] as $note) {
          $note = Note::find($note['id']);
          if ($note) $list->notes()->save($note);
        }
      }

      DB::commit();
      $r = NoteList::with(['shares.user', 'notes.todos.tags', 'notes.todos.share.user', 'notes.tags'])->find($list->id);
      return response()->json($r);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete($id): JsonResponse {
    DB::beginTransaction();
    try {
      $list = NoteList::all()->find($id);
      $list->delete();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function share(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $listId = $req->route('id');
      $list = NoteList::find($listId);
      $share = Share::firstOrNew([
        'user_id' => $req['user_id']
      ]);
      $list->shares()->save($share);
      DB::commit();
      return $this->getById($listId);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function accept(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $listId = $req->route('id');
      $userId = auth()->user()->id;
      $share = Share::where('user_id', '=', $userId)->where('list_id', '=', $listId)->first();
      $share->accepted = true;
      $share->save();
      DB::commit();
      return $this->getById($listId, true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

}
