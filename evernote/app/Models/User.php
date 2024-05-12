<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject {
  use HasApiTokens, HasFactory, Notifiable;

  protected $fillable = ['name', 'email', 'password', 'profilepic', 'role'];
  protected $hidden = ['remember_token'];
  protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed',];

  public function lists(): HasMany {
    return $this->hasMany(NoteList::class);
  }

  public function notes(): HasMany {
    return $this->hasMany(Note::class);
  }

  public function todos(): HasMany {
    return $this->hasMany(Todo::class);
  }

  public function shared() {
    return $this->hasMany(Share::class);
  }

  // --- AUTH ---
  public function getJWTIdentifier() {
    return $this->getKey();
  }

  public function getJWTCustomClaims() {
    return ['user' => ['id' => $this->id]];
  }
}
