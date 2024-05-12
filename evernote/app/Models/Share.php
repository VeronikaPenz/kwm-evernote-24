<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Share extends Model {
  use HasFactory;

  protected $fillable = [
    'list_id', 'user_id', 'accepted'
  ];

  public function list(): BelongsTo {
    return $this->belongsTo(User::class);
  }

  public function user(): BelongsTo {
    return $this->belongsTo(User::class);
  }

  public function assignments(): HasMany {
    return $this->hasMany(Todo::class);
  }
}
