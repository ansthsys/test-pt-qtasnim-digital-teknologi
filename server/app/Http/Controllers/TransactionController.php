<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
  }

  public function store(Request $request)
  {
    $this->validate($request, [
      'item_id' => 'required|integer|exists:items,id',
      'quantity' => 'required|integer|min:0|max:50',
      'date' => 'required|date'
    ]);

    $item = DB::table('items')->where('id', $request->item_id)->first();
    $remaining_stock = $item->stock - $request->quantity;

    if ($remaining_stock < 0) {
      return $this->errorResponse('Stock is not enough', 400);
    }

    DB::table('transactions')->insert([
      'item_id' => $request->item_id,
      'quantity' => $request->quantity,
      'remaining_stock' => $remaining_stock,
      'date' => $request->date,
    ]);

    DB::table('items')->where('id', $request->item_id)->update([
      'stock' => $remaining_stock,
    ]);

    return $this->successResponse('CREATE Transactions successfully', $request->all(), 201);
  }
}
