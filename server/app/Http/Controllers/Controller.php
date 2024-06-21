<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    protected function errorResponse($message, $statusCode)
    {
        return response()->json([
            'message' => $message,
            'status' => 'error',
            'error' => true,
        ], $statusCode);
    }

    protected function successResponse($message, $data = null, $statusCode = 200)
    {
        $res = [
            'message' => $message,
            'status' => 'success',
            'error' => false,
        ];

        if ($data) {
            $res['data'] = $data;
        }

        return response()->json($res, $statusCode);
    }
}
