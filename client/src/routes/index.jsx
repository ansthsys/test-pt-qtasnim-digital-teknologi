/* eslint-disable react-refresh/only-export-components */
import React from "react";
import Constants from "./constants";

const IndexPage = React.lazy(() => import("@/pages/IndexPage"));
const ItemPage = React.lazy(() => import("@/pages/ItemPage"));
const ItemTypePage = React.lazy(() => import("@/pages/ItemTypePage"));
const TransactionPage = React.lazy(() => import("@/pages/TransactionPage"));
const TransactionComparePage = React.lazy(() => {
  return import("@/pages/TransactionComparePage");
});

const routes = [
  { path: Constants.INDEX, element: <IndexPage /> },
  { path: Constants.ITEM, element: <ItemPage /> },
  { path: Constants.ITEM_TYPE, element: <ItemTypePage /> },
  { path: Constants.TRANSACTION, element: <TransactionPage /> },
  { path: Constants.TRANSACTION_COMPARE, element: <TransactionComparePage /> },
];

export default routes;
