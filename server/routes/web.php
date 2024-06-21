<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/item-types', ['uses' => 'ItemTypeController@index']);
$router->post('/item-types', ['uses' => 'ItemTypeController@store']);
$router->get('/item-types/{id:\d+}', ['uses' => 'ItemTypeController@show']);
$router->patch('/item-types/{id:\d+}', ['uses' => 'ItemTypeController@update']);
$router->delete('/item-types/{id:\d+}', ['uses' => 'ItemTypeController@destroy']);
