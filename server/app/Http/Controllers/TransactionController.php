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

  public function index(Request $request)
  {
    $msg = "GET all Transactions successfully";
    $order = ['item_name', 'transaction_stock', 'transaction_quantity', 'transaction_date', 'type_name'];
    $sort = ['asc', 'desc'];
    $data = DB::table('transactions')
      ->join('items', 'transactions.item_id', '=', 'items.id')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->select([
        'transactions.id as transaction_id',
        'transactions.quantity as transaction_quantity',
        'transactions.remaining_stock as transaction_stock',
        'transactions.date as transaction_date',
        'items.id as item_id',
        'items.name as item_name',
        // 'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ]);

    if ($request->has('search') && $request->search != '') {
      $query = strtolower($request->search);
      $data->where(DB::raw('LOWER(items.name)'), 'like', "%$query%");
    }

    if ($request->has('order') && in_array($request->order, $order)) {
      $orderBy = $request->order;
      $sortBy = $request->has('sort') && in_array($request->sort, $sort) ? $request->sort : 'asc';
      $data->orderBy($orderBy, $sortBy);
    }

    $data = $data->get();

    return $this->successResponse($msg, $data);
  }

  public function show($id)
  {
    $data = DB::table('transactions')
      ->join('items', 'transactions.item_id', '=', 'items.id')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->where('transactions.id', $id)
      ->select([
        'transactions.id as transaction_id',
        'transactions.quantity as transaction_quantity',
        'transactions.remaining_stock as transaction_stock',
        'transactions.date as transaction_date',
        'items.id as item_id',
        'items.name as item_name',
        // 'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ])
      ->first();

    if (!$data) {
      return $this->errorResponse("Transaction with id $id not found", 404);
    }

    return $this->successResponse("GET Transaction with id $id successfully", $data);
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
