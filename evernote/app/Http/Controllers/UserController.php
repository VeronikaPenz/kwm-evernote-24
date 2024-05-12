<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller {

  const PASSWORD_ERROR = [
    'error' => true,
    'message' => "Wrong password"
  ];

  const USER_NOT_FOUND = [
    'error' => true,
    'message' => "User not found"
  ];

  private function encryptPassword(string $password) {
    return password_hash($password, PASSWORD_DEFAULT);
  }

  private function checkPassword(string|null $password, User $user) {
    if (!$password) return false;
    return password_verify($password, $user['password']);
  }

  public function getAll(): JsonResponse {
    $users = User::with([])->get();
    return response()->json($users);
  }

  public function getById($id): JsonResponse {

    $user = User::all()->find($id);
    unset($user['password']);
    return response()->json($user);
  }

  public function login(Request $req): JsonResponse {
    $user = User::where('email', '=', $req['email'])->first();
    if (!$user) {
      return response()->json($this::USER_NOT_FOUND, 500);
    }
    if (!$this->checkPassword($req["password"], $user)) {
      return response()->json($this::USER_NOT_FOUND, 500);
    }
    unset($user['password']);
    return response()->json($user);
  }

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $req["password"] = $this->encryptPassword($req["password"]);
      $user = User::create($req->all());
      DB::commit();
      unset($user['password']);
      return response()->json($user);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function update(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $id = $req->route('id');
      $user = User::all()->find($id);
      if (!$this->checkPassword($req["old_password"], $user)) {
        return response()->json($this::PASSWORD_ERROR, 500);
      }
      if ($req["password"]) {
        $req["password"] = $this->encryptPassword($req["password"]);
      }
      $user->update($req->all());
      DB::commit();
      unset($user['password']);
      return response()->json($user);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $id = $req->route('id');
      $user = User::all()->find($id);
      if (!$this->checkPassword($req["password"], $user)) {
        return response()->json($this::PASSWORD_ERROR, 500);
      }
      $user->delete();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }
}
