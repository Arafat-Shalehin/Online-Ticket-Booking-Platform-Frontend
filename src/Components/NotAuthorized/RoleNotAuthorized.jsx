import React from "react";
import NotAuthorized from "./NotAuthorized";

// For guests / non-logged-in users trying to hit private routes
export const UserNotAuthorized = () => <NotAuthorized role="user" />;

// For logged-in users who are NOT vendors but try to access vendor dashboard
export const VendorNotAuthorized = () => <NotAuthorized role="vendor" />;

// For logged-in users who are NOT admins but try to access admin dashboard
export const AdminNotAuthorized = () => <NotAuthorized role="admin" />;